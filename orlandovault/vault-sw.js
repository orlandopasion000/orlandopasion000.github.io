/* OrlandoVault · Offline-First Jarvis Security Service Worker */
var CACHE_NAME = 'vault-jarvis-v49';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './assets/vault-icon-192.png',
  './assets/vault-icon-512.png',
  './assets/vault-icon-maskable.png',
  './assets/app-icon.ico',
  './assets/qrcode.min.js',
  './assets/vault-icon-128.png',
  './assets/relative-time.js'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {});
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
  var url = e.request.url || '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (url.indexOf('firestore.googleapis.com') !== -1 || url.indexOf('docs.google.com') !== -1 || url.indexOf('ntfy.sh') !== -1) return;

  // Stale-While-Revalidate: Instant 0ms load from disk cache, revalidate in background
  e.respondWith(
    caches.match(e.request).then(function(cachedResponse) {
      var networkFetch = fetch(e.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          var responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, responseToCache).catch(function() {});
          });
        }
        return networkResponse;
      }).catch(function() {});

      return cachedResponse || networkFetch;
    })
  );
});
