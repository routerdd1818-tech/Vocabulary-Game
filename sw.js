// Word Dungeon & Babel Tower - Service Worker
const CACHE_NAME = 'word-dungeon-v9';
const ASSETS_TO_CACHE = [
  '/',
  './css/styles.css',
  './js/supabase-config.js',
  './js/supabase-client.js',
  './js/pixel-sprites.js',
  './js/vocab-data.js',
  './js/vocab-repository.js',
  './js/sentence-engine.js',
  './js/game-data.js',
  './js/audio.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

// Helper to strip Safari WebKit internal redirect metadata
const sanitizeResponse = async (response) => {
  if (!response) return response;
  // If response was redirected, WebKit will abort navigation with "Response served by service worker has redirections"
  // Reconstructing a fresh Response strips the redirected flag and satisfies WebKit security requirements
  if (response.redirected) {
    const body = await response.blob();
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Handle Navigation Requests (Safari WebKit Critical Fix)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(async (networkResponse) => {
          return sanitizeResponse(networkResponse);
        })
        .catch(async () => {
          const cached = await caches.match('/');
          return sanitizeResponse(cached);
        })
    );
    return;
  }

  // Handle Asset Requests (Cache First, Network Fallback)
  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return sanitizeResponse(cachedResponse);
      }
      try {
        const networkResponse = await fetch(event.request);
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return sanitizeResponse(networkResponse);
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return sanitizeResponse(networkResponse);
      } catch (err) {
        const fallback = await caches.match('/');
        return sanitizeResponse(fallback);
      }
    })
  );
});
