/** @type {import('next').NextConfig} */

const revision = `${Date.now()}`
const pages = ['/', '/about', '/account/forgot', '/account/login', '/account/signup']
const images = ['/images/bg.webp', '/images/creator.webp', '/images/logo.webp']

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheStartUrl: false,
  workboxOptions: {
    additionalManifestEntries: pages.concat(images).map(url => ({ url, revision })),
    offlineGoogleAnalytics: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'static-font-assets' }
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'static-image-assets' }
      },
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'next-image' }
      },
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: 'CacheFirst',
        options: {
          rangeRequests: true,
          cacheName: 'static-audio-assets'
        }
      },
      {
        urlPattern: /\.(?:mp4)$/i,
        handler: 'CacheFirst',
        options: {
          rangeRequests: true,
          cacheName: 'static-video-assets'
        }
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'js-assets' }
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'static-style-assets' }
      },
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'next-data' }
      },
      {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: 'NetworkFirst',
        options: { cacheName: 'static-data-assets' }
      },
      {
        urlPattern: () => true,
        handler: 'NetworkOnly',
        options: { cacheName: 'others' }
      }
    ]
  }
})

const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
    optimizePackageImports: ['']
  }
}

module.exports = withPWA(nextConfig)
