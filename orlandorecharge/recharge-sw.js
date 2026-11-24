/* OrlandoRecharge · Offline-First Service Worker (PWA Ready) */
var CACHE_NAME = 'recharge-v93';
var ASSETS = [
  './',
  './index.html',
  './orlandorecharge-manifest.webmanifest',
  './assets/recharge-icon-192.png',
  './assets/recharge-icon-512.png',
  './assets/recharge-icon-maskable.png',
  './assets/recharge-apple-touch.png',
  './assets/app-icon.ico',
  './favicon.ico'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        ASSETS.map(function (url) {
          return cache.add(url).catch(function () {});
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
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
  var url = event.request.url || '';
  
  // 1. Never intercept non-HTTP schemes or Range/Audio media streams (prevents ERR_CACHE_OPERATION_NOT_SUPPORTED on MP3s)
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (event.request.headers.get('range') || url.indexOf('.mp3') !== -1 || event.request.destination === 'audio') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (res) {
        // 2. Never cache Partial Content (HTTP 206) or non-200 responses
        if (!res || !res.ok || res.status !== 200 || res.type === 'opaque') {
          return res;
        }
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy).catch(function () {});
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
