const cacheName = "pages"
const urlsToCache = ['/', '/about', '/dashboard', '/offline.html', '/static/js/bundle.js']
// const urlsToCache = ['/', '/about', '/dashboard', '/index.html', '/offline.html', '/static/js/bundle.js', '/static/js/src_components_Welcome_js.chunk.js', '/static/js/src_components_Container_js.chunk.js', '/static/js/src_components_About_js.chunk.js', '/static/js/src_components_Notes_js.chunk.js']

// Install SW
this.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)))
})

// Listen for requests
this.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(async (resp) => {
        return resp || fetch(event.request).catch(() => caches.match('offline.html'))
    }))
})

// Activate the SW
this.addEventListener('activate', event => {
    const cacheWhiteList = [];
    cacheWhiteList.push(cacheName);

    event.waitUntil(caches.keys().then(cacheNames => Promise.all(
        cacheNames.map(cacheName => cacheWhiteList.includes(cacheName) ? null : caches.delete(cacheName))
    )))
})