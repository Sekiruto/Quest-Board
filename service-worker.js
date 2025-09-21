const CACHE = 'rpgq-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k)));
  })());
  self.clients.claim();
});

// Network-first, fallback to cache
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    try {
      const fresh = await fetch(e.request);
      return fresh;
    } catch (err) {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(e.request);
      return cached || Response.error();
    }
  })());
});
