const CACHE_NAME = 'neon-bites-v2'; // Bumped to v2 to force a clean update

// Using relative paths (./) so it works perfectly on GitHub Pages
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// 1. Install Event: Caches our files when the app is first loaded
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache v2');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Cleans up old caches if we ever update the CACHE_NAME
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event: Intercepts network requests and serves from cache if offline
self.addEventListener('fetch', (event) => {
    // We only want to cache our local app files, NOT the live Firebase data calls
    if (event.request.url.includes('firestore.googleapis.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached file if we have it, otherwise try to fetch from the network
            return response || fetch(event.request);
        })
    );
});
