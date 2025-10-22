/**
 * Service Worker for Symptom2Care PWA
 * Handles offline caching and background sync
 */

const CACHE_NAME = 'symptom2care-v1.0.0';
const RUNTIME_CACHE = 'symptom2care-runtime';

// Files to cache immediately on install
const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './firebase/firebase-config.js',
    './nlp/nlp.js',
    './data/asanas.csv',
    './data/medicines.csv',
    './data/symptom_map.csv',
    './data/red_flags.json',
    'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Precaching failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin && !url.href.includes('cdn.jsdelivr.net') && !url.href.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    // Network-first strategy for API calls
    if (url.href.includes('firebaseio.com') || url.href.includes('googleapis.com')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Cache-first strategy for app resources
    event.respondWith(cacheFirst(request));
});

/**
 * Cache-first strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        console.log('[Service Worker] Serving from cache:', request.url);
        return cached;
    }
    
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        
        // Return offline page if available
        if (request.mode === 'navigate') {
            const offlineResponse = await cache.match('./index.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }
        
        throw error;
    }
}

/**
 * Network-first strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);
        
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        
        throw error;
    }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-sessions') {
        event.waitUntil(syncSessions());
    }
});

/**
 * Sync offline sessions to Firebase
 */
async function syncSessions() {
    try {
        console.log('[Service Worker] Syncing offline sessions...');
        
        // This would retrieve data from IndexedDB and sync to Firebase
        // Implementation depends on your offline storage strategy
        
        console.log('[Service Worker] Sync complete');
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        throw error;
    }
}

// Push notification support (optional)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New health recommendation available',
        icon: './icon-192.png',
        badge: './badge-72.png',
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification('Symptom2Care', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

console.log('[Service Worker] Script loaded');
