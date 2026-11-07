/* Daily Recharge Alarm — service worker
   • Makes the app installable and fully usable offline (page, songs, icons, fonts).
   • Handles notification buttons (Snooze / Dismiss) and brings the app to the front.
   Scope is limited to /daily-recharge-alarm* so the rest of the site is untouched. */
var VERSION = "recharge-v1";
var CORE = [
  "daily-recharge-alarm.html",
  "recharge-manifest.webmanifest",
  "assets/recharge-icon-192.png",
  "assets/recharge-icon-512.png",
  "assets/recharge-icon-maskable.png",
  "assets/recharge-apple-touch.png",
  "music/palagi.mp3",
  "music/na-para-bang.mp3",
  "music/what-if-i-miss-you.mp3",
  "music/okay.mp3",
  "music/training-season.mp3",
  "music/stop-the-wedding.mp3",
  "music/malibu-nights.mp3",
  "music/enchanted.mp3",
  "music/the-man-who-cant-be-moved.mp3",
  "music/youre-still-the-one.mp3"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("recharge-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  /* The page itself: network first (so updates arrive), cache when offline */
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put("daily-recharge-alarm.html", copy); });
      return res;
    }).catch(function () { return caches.match("daily-recharge-alarm.html"); }));
    return;
  }

  /* Google Fonts: serve from cache, refresh in the background */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(VERSION + "-fonts").then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }

  /* Songs, icons, manifest: cache first (instant + offline) */
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || fetch(req); }));
  }
});

/* Notification buttons → tell the open app, or open it */
self.addEventListener("notificationclick", function (e) {
  var action = e.action || "open";
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    var client = list.find(function (c) { return c.url.indexOf("daily-recharge-alarm") !== -1; });
    if (client) {
      client.postMessage({ type: "alarm-action", action: action, tag: e.notification.tag });
      return action === "open" ? client.focus() : undefined;
    }
    return self.clients.openWindow("daily-recharge-alarm.html");
  }));
});
