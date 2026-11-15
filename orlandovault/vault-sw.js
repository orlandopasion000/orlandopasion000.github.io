/* OrlandoVault · Offline-First Jarvis Security Service Worker */
var CACHE_NAME = 'vault-jarvis-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './assets/vault-icon-192.png',
  './assets/vault-icon-512.png',
  './assets/vault-icon-maskable.png',
  './assets/app-icon.ico'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {
        /* Continue gracefully even if an icon is pending */
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(k) {
          if (k.indexOf('vault-') === 0 && k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var fetchPromise = fetch(e.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          var responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(function() {
        return cached;
      });
      return cached || fetchPromise;
    })
  );
});
