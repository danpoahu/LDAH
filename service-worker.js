// Service Worker for LDAH Progressive Web App
const CACHE_NAME = 'ldah-v2';
const urlsToCache = [
  './',
  './index.html',
  './events.html',
  './faq.html',
  './volunteer.html',
  './contact.html',
  './resources.html',
  './install.html',
  './styles.css',
  './analytics-tracker.js',
  './accessibility.js',
  './logo_transparent.png',
  './background.png',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version immediately, but also fetch fresh copy
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, cached response already returned above
        });

        return cachedResponse || fetchPromise;
      })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
