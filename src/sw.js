/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { offlineFallback } from 'workbox-recipes'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const urlsToCache = (self.__WB_MANIFEST || []).concat([
    { url: '/', revision: null },
    { url: '/dashboard', revision: null },
    { url: '/about', revision: null }
])
precacheAndRoute(urlsToCache)

setDefaultHandler(new NetworkOnly())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ url }) => url.pathname === '/api/notes/fetch', new NetworkFirst({
    cacheName: 'notes',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ request }) => request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
}))