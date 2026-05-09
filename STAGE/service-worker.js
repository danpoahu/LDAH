// Service Worker for LDAH Progressive Web App — STAGE
// Separate cache namespace from production so STAGE and live don't share cached HTML.
const CACHE_NAME = 'ldah-stage-v3';
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

// Fetch event:
//   HTML (navigation/document requests) — network-first so freshly-pushed STAGE always wins.
//   Everything else — stale-while-revalidate.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isHTML = req.mode === 'navigate' || req.destination === 'document' ||
                 (req.url.endsWith('.html') || req.url.endsWith('/'));
  if (isHTML) {
    event.respondWith(
      fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return networkResponse;
      }).catch(() => caches.match(req))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return networkResponse;
      }).catch(() => {});
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
