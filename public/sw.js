/**
 * TheGridNexus Service Worker
 * PWA capabilities and offline support
 */

// Bump this to force old cached bundles to be dropped.
const CACHE_NAME = 'thegridnexus-v2';
const urlsToCache = [
  '/',
  '/guides',
  '/roadmap',
  '/breach-sim',
  '/nexus-intersection',
  '/topics',
  '/explore',
  '/manifest.json',
  '/css/critical.css',
  '/fonts/inter-var.woff2',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  // Activate updated SW ASAP.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // Never cache built asset bundles (prevents stale vendor JS causing runtime errors).
  if (url.origin === self.location.origin) {
    if (event.request.destination === 'script' || url.pathname.startsWith('/assets/')) {
      event.respondWith(fetch(event.request));
      return;
    }
  }

  // Network-first for navigations so the app shell updates quickly.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          return response;
        })
        .catch(function() {
          return caches.match('/');
        })
    );
    return;
  }

  // Cache-first for a small set of static resources / offline support.
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) return response;

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of any existing clients without requiring a reload loop.
  self.clients.claim();
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notification handler
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New content available',
    icon: '/favicon-32x32.png',
    badge: '/favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('The Grid Nexus', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received.');
  
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
