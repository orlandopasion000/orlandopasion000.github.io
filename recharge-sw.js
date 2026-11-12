/* Daily Recharge Alarm — Service Worker v11
   • Caches core app, clean blank edition, manifests, song chorus clips, mobile QR code, and Lexend font for 100% offline playback.
   • Handles notification actions (Snooze / Dismiss / Focus).
   Scope: ./ */
var VERSION = "recharge-v21";
var CORE = [
  "orlandorecharge",
  "orlandorecharge.html",
  "orlandorecharge/index.html",
  "recharge-clean.html",
  "orlandorecharge-manifest.webmanifest",
  "recharge-manifest.webmanifest",
  "recharge-clean-manifest.webmanifest",
  "assets/app-icon.ico",
  "assets/recharge-icon-192.png",
  "assets/recharge-icon-512.png",
  "assets/recharge-icon-maskable.png",
  "assets/recharge-apple-touch.png",
  "assets/qr-code.svg",
  "assets/qrcode.min.js",
  "assets/lexend.ttf",
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
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      return c.addAll(CORE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k.indexOf("recharge-") === 0 && k !== VERSION; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  /* Page navigation: network-first, cache fallback */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put("orlandorecharge.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("orlandorecharge.html") || caches.match("orlandorecharge/index.html");
      })
    );
    return;
  }

  /* Google Fonts: cache with background refresh */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(VERSION + "-fonts").then(function (c) {
        return c.match(req).then(function (hit) {
          var net = fetch(req).then(function (res) {
            if (res.ok || res.type === "opaque") c.put(req, res.clone());
            return res;
          }).catch(function () { return hit; });
          return hit || net;
        });
      })
    );
    return;
  }

  /* Local assets, songs, sounds: cache-first */
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(req);
      })
    );
  }
});

self.addEventListener("notificationclick", function (e) {
  var action = e.action || "open";
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      var client = list.find(function (c) {
        return c.url.indexOf("orlandorecharge") !== -1 || c.url.indexOf("recharge-clean") !== -1 || c.url.indexOf("daily-recharge-alarm") !== -1;
      });
      if (client) {
        client.postMessage({ type: "alarm-action", action: action, tag: e.notification.tag });
        return client.focus();
      }
      return self.clients.openWindow("orlandorecharge");
    })
  );
});
