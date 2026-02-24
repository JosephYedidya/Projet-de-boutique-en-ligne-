const CACHE_NAME = 'quincaillerie-shop-v1.0.0';
const STATIC_CACHE = 'quincaillerie-static-v1.0.0';
const DYNAMIC_CACHE = 'quincaillerie-dynamic-v1.0.0';
const API_CACHE = 'quincaillerie-api-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/products.js',
  '/app.js',
  '/manifest.json',
  // Icons
  '/icon-72.png',
  '/icon-96.png',
  '/icon-128.png',
  '/icon-144.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests
    if (request.destination === 'document') {
      // HTML pages - Network first, fallback to cache
      event.respondWith(
        fetch(request)
          .then(response => {
            // Cache successful responses
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
            return response;
          })
          .catch(() => {
            return caches.match(request)
              .then(cachedResponse => {
                return cachedResponse || caches.match('/index.html');
              });
          })
      );
    } else if (request.destination === 'image') {
      // Images - Cache first, fallback to network
      event.respondWith(
        caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then(response => {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
                return response;
              })
              .catch(() => {
                // Return a placeholder for failed image requests
                return new Response('', { status: 404 });
              });
          })
      );
    } else if (request.url.includes('.css') || request.url.includes('.js')) {
      // CSS and JS files - Cache first, fallback to network
      event.respondWith(
        caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then(response => {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
                return response;
              });
          })
      );
    } else {
      // Other same-origin requests - Network first
      event.respondWith(
        fetch(request)
          .catch(() => caches.match(request))
      );
    }
  } else {
    // External requests (CDNs, APIs, etc.)
    if (url.hostname.includes('unsplash.com') || url.hostname.includes('images.unsplash.com')) {
      // External images - Cache them
      event.respondWith(
        caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then(response => {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
                return response;
              });
          })
      );
    } else if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
      // Google Fonts - Cache them
      event.respondWith(
        caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then(response => {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
                return response;
              });
          })
      );
    } else {
      // Other external requests - Network only with cache fallback
      event.respondWith(
        fetch(request)
          .catch(() => caches.match(request))
      );
    }
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync-cart') {
    event.waitUntil(syncCartData());
  }

  if (event.tag === 'background-sync-contact') {
    event.waitUntil(syncContactForm());
  }
});

// Sync cart data when back online
async function syncCartData() {
  try {
    const cartData = await getStoredCartData();
    if (cartData && cartData.length > 0) {
      // Here you would typically send cart data to server
      console.log('[SW] Syncing cart data:', cartData);
      // For now, just log the sync attempt
    }
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

// Sync contact form submissions
async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData) {
      // Here you would typically send form data to server
      console.log('[SW] Syncing contact form:', formData);
      // For now, just log the sync attempt
    }
  } catch (error) {
    console.error('[SW] Contact form sync failed:', error);
  }
}

// Helper functions for data retrieval (would need to be implemented based on your storage method)
async function getStoredCartData() {
  // This would retrieve cart data from IndexedDB or similar
  // For now, return null
  return null;
}

async function getStoredFormData() {
  // This would retrieve form data from IndexedDB or similar
  // For now, return null
  return null;
}

// Push notification handling (for future enhancement)
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
