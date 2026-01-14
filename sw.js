// Service Worker for Eco-Explorer - Offline Support & Performance
const CACHE_NAME = 'eco-explorer-v1';
const STATIC_CACHE = 'eco-explorer-static-v1';

// Resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/js/i18n.js',
  '/assets/js/language-switcher.js',
  '/assets/images/eco-explorer-thumbnail.png',
  '/assets/images/itatiaia-jaguar.jpg',
  '/assets/images/itatiaia-forest.jpg'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return offline fallback for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});
