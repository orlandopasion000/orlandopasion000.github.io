/**
 * Orlando Timer — Service Worker
 * Enables ultra-fast offline caching & PWA installation
 */

const CACHE_NAME = 'orlandotimer-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'manifest.webmanifest',
  'favicon.ico',
  'assets/ot-logo.png',
  'assets/ot-icon-192.png',
  'assets/ot-icon-512.png',
  'assets/app-icon.ico',
  'assets/lexend.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Offline fallback
        return caches.match('./') || caches.match('index.html');
      });
    })
  );
});
