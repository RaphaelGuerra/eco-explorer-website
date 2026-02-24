// Service Worker for Eco-Explorer - Offline support for app shell + locales.
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `eco-explorer-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `eco-explorer-runtime-${CACHE_VERSION}`;
const CACHE_PREFIX = 'eco-explorer-';

// Relative paths keep this working on subpath hosts (e.g. GitHub Pages project sites).
const APP_SHELL = [
  './',
  './index.html',
  './assets/css/tailwind.css',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/js/i18n.js',
  './assets/js/language-switcher.js',
  './assets/images/eco-explorer-thumbnail.png',
  './assets/images/itatiaia-jaguar.jpg',
  './assets/images/itatiaia-forest.jpg',
  './locales/en.json',
  './locales/pt.json',
  './locales/es.json',
  './locales/fr.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            const isOwnedCache = cacheName.startsWith(CACHE_PREFIX);
            const isCurrent = cacheName === STATIC_CACHE || cacheName === RUNTIME_CACHE;
            return isOwnedCache && !isCurrent ? caches.delete(cacheName) : Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // Navigation: prefer fresh HTML, fall back to cached shell when offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedDoc = await caches.match('./index.html');
        return cachedDoc || caches.match('./');
      })
    );
    return;
  }

  // Static assets/locales: cache-first, then network.
  event.respondWith(
    caches.match(event.request).then(async cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(event.request);
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        const responseClone = networkResponse.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, responseClone));
      }
      return networkResponse;
    })
  );
});
