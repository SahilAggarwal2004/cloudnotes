/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'
import { offlineFallback } from 'workbox-recipes'
import { nanoid } from 'nanoid'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const revision = nanoid();
const urlsToCache = (self.__WB_MANIFEST || []).concat([
    { url: '/', revision },
    { url: '/about', revision },
    { url: '/signup', revision },
    { url: '/login', revision },
    { url: '/dashboard', revision },
    { url: '/forgot', revision }
])
precacheAndRoute(urlsToCache)

setDefaultHandler(new StaleWhileRevalidate())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ request }) => request.url.includes('cloudnotes.onrender.com'), new NetworkOnly())
registerRoute(({ request }) => request.destination === 'image', new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))