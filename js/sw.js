const CACHE_NAME = 'honesty-home-v1.1.0';
const urlsToCache = [
  './index.html',
  './about.html',
  './css/style.css',
  './css/about.css',
  './css/artalk.css',
  './js/config.js',
  './js/about.js',
  './images/avatar.jpeg',
  './images/favicon.ico',
  './images/favicon.png',
  './images/logo.png',
  './images/INFJ.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  const isHTML = event.request.mode === 'navigate' || url.pathname.endsWith('.html');
  const isVersioned = url.search && /version=/.test(url.search);
  const isAudio = url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || url.pathname.endsWith('.ogg');
  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url.pathname);
  const isStaticAsset = /\.(css|js|json)$/i.test(url.pathname);

  if (isHTML || isVersioned || isAudio) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic' && !isAudio) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => {
          return caches.match(event.request, { ignoreSearch: true })
            .then(m => m || caches.match(event.request))
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic' && (isImage || isStaticAsset)) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
          }
          return resp;
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
