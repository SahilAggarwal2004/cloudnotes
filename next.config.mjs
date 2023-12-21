import withPWAInit from '@serwist/next'

const pages = ['/', '/about', '/account/forgot', '/account/login', '/account/signup']
const images = ['bg.webp', 'creator.webp', 'logo.webp'].map(image => `/images/${image}`)
const revision = `${Date.now()}`

const withPWA = withPWAInit({
  swSrc: 'src/sw.js',
  swDest: 'public/sw.js',
  exclude: [/public\/sw.js/],
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: pages.concat(images).map(url => ({ url, revision }))
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
    optimizePackageImports: ['']
  }
}

export default withPWA(nextConfig)
