// serviceWorker.js

const CACHE_NAME = 'app-cache-v0.1.1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed 1');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/index.html',
        // Adicione aqui outros recursos estáticos do seu aplicativo
      ]))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated 1');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
          return null;
        })
      ))
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:1 ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
