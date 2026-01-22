const CACHE_NAME = 'ipoteka-krym-v1';
const RUNTIME_CACHE = 'runtime-cache';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png',
  'https://i.imgur.com/LxyQAtM.jpeg'
];

const API_CACHE_PATTERNS = [
  /^https:\/\/functions\.poehali\.dev\//,
  /^https:\/\/cdn\.poehali\.dev\//
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  const shouldCacheAPI = API_CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
  
  if (shouldCacheAPI) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Ипотека Крым';
  const options = {
    body: data.body || 'Новая информация об ипотечных программах',
    icon: 'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png',
    badge: 'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png',
    image: data.image || 'https://i.imgur.com/LxyQAtM.jpeg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'mortgage-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Открыть',
        icon: 'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ],
    data: {
      url: data.url || '/',
      date: new Date().toISOString()
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});