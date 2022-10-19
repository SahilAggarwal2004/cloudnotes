/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'
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
])
precacheAndRoute(urlsToCache)

setDefaultHandler(new StaleWhileRevalidate())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ url }) => url.host === 'cloudnotes.onrender.com', new NetworkOnly())
registerRoute(({ request }) => request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))