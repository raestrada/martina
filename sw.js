// Martina PWA Service Worker — cache estrategia stale-while-revalidate
const CACHE = 'martina-v1';
const SHELL = [
  '/',
  '/index.html',
  '/juegos.html',
  '/album.html',
  '/galeria.html',
  '/acerca-de.html',
  '/difundir.html',
  '/css/style.css',
  '/css/games.css',
  '/js/main.js',
  '/js/games-hub.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      })
    )
  );
});
