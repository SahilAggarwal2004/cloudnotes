/* eslint-disable no-restricted-globals */
import * as navigationPreload from 'workbox-navigation-preload';
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

precacheAndRoute(self.__WB_MANIFEST)

// Enable navigation preload
navigationPreload.enable();

// Create a new navigation route that uses the Network-first, falling back to
// cache strategy for navigation requests with its own cache. This route will be
// handled by navigation preload. The NetworkOnly strategy will work as well.
const navigationRoute = new NavigationRoute(new NetworkFirst({
    cacheName: 'navigations'
}));

// Register the navigation route
registerRoute(navigationRoute);

registerRoute(({ url }) => url.pathname === '/api/notes/fetch', new StaleWhileRevalidate({
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

registerRoute(({ request }) => request.destination === 'script' || request.destination === 'style', new StaleWhileRevalidate({ cacheName: 'static-resources' }))