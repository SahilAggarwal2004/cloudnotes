/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { offlineFallback } from 'workbox-recipes'
import { nanoid } from 'nanoid'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const revision = nanoid();
const urlsToCache = (self.__WB_MANIFEST || []).concat([
    { url: '/', revision },
    { url: '/dashboard', revision },
    { url: '/about', revision }
]).filter(({ url }) => url !== '/manifest.json')
precacheAndRoute(urlsToCache)
cleanupOutdatedCaches()

setDefaultHandler(new CacheFirst())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ url }) => url.host === 'cloudnotes.onrender.com', new NetworkOnly())

registerRoute(({ url }) => url.pathname === '/manifest.json', new NetworkFirst({
    cacheName: 'manifest',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ request }) => request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))