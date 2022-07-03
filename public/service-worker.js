const cacheName = "version-1"
const urlsToCache = ['index.html', 'offline.html']

const self = this;

// Install SW
self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)))
})

// Listen for requests
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(async () => {
        return fetch(event.request).catch(() => caches.match('offline.html'))
    }))
})

// Activate the SW
self.addEventListener('activate', event => {
    const cacheWhiteList = [];
    cacheWhiteList.push(cacheName);

    event.waitUntil(caches.keys().then(cacheNames => Promise.all(
        cacheNames.map(cacheName => cacheWhiteList.includes(cacheName) ? null : caches.delete(cacheName))
    )))
})