import withSerwistInit from "@serwist/next";

const pages = ["/", "/about", "/account/forgot", "/account/login", "/account/signup", "/_offline"];
const images = ["bg.webp", "logo.webp"].map((image) => `/images/${image}`);
const revision = Date.now().toString();

const withPWA = withSerwistInit({
  swSrc: "src/sw.js",
  swDest: "public/sw.js",
  exclude: [/public\/sw.js/],
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: pages.concat(images).map((url) => ({ url, revision })),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
  },
};

export default withPWA(nextConfig);
