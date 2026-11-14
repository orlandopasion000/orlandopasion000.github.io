/* OrlandoRecharge · Offline-First Service Worker (PWA Ready) */
var CACHE_NAME = 'recharge-v28';
var ASSETS = [
  './',
  './index.html',
  './orlandorecharge-manifest.webmanifest',
  './manifest.webmanifest',
  './assets/recharge-icon-192.png',
  './assets/recharge-icon-512.png',
  './assets/recharge-icon-maskable.png',
  './assets/recharge-apple-touch.png',
  './assets/app-icon.ico',
  './favicon.ico',
  './music/palagi.mp3',
  './music/na-para-bang.mp3',
  './music/what-if-i-miss-you.mp3',
  './music/okay.mp3',
  './music/training-season.mp3',
  './music/stop-the-wedding.mp3',
  './music/malibu-nights.mp3',
  './music/enchanted.mp3',
  './music/the-man-who-cant-be-moved.mp3',
  './music/youre-still-the-one.mp3'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).catch(function () {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME && (k.indexOf('orlandorecharge-') === 0 || k.indexOf('recharge-') === 0); })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        }).catch(function () {});
        return res;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('notificationclick', function (e) {
  var action = e.action || 'open';
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      var client = list.find(function (c) {
        return c.url.indexOf('orlandorecharge') !== -1 || c.url.indexOf('recharge-clean') !== -1;
      });
      if (client) {
        client.postMessage({ type: 'alarm-action', action: action, tag: e.notification.tag });
        return client.focus();
      }
      return self.clients.openWindow('https://orlandopasion000.github.io/orlandorecharge/');
    })
  );
});
