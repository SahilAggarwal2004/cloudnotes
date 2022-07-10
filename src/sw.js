/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const urlsToCache = (self.__WB_MANIFEST || []).concat(['/offline', '/', '/dashboard', '/about'])
precacheAndRoute(urlsToCache)

// registerRoute(({ url }) => url.pathname === '/api/notes/fetch', new StaleWhileRevalidate({
//     cacheName: 'notes',
//     plugins: [new CacheableResponsePlugin({ statuses: [200] })]
// }))

registerRoute(({ request }) => request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
}))

registerRoute(({ request }) => request.destination === 'script' || request.destination === 'style', new StaleWhileRevalidate({ cacheName: 'static-resources' }))

// Use a stale-while-revalidate strategy to handle requests by default.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({ request }) => {
    // Fallback assets are precached when the service worker is installed, and are
    // served in the event of an error below. Use `event`, `request`, and `url` to
    // figure out how to respond, or use request.destination to match requests for
    // specific resource types.
    switch (request.destination) {
        case 'document':
            return matchPrecache('/offline');

        default:
            // If we don't have a fallback, return an error response.
            return Response.error();
    }
});