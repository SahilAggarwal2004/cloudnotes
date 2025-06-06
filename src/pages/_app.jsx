/* eslint-disable react-hooks/exhaustive-deps */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { init } from "aos";
import "aos/dist/aos.css";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";

import Modal from "../components/Modal";
import Navbar from "../components/navbar/Navbar";
import { hideNavbar, onlyGuest } from "../constants";
import NoteProvider from "../contexts/NoteProvider";
import { clearSessionStorage, getStorage } from "../modules/storage";
import { handleVersionUpdate } from "../modules/update";
import "../styles/globals.css";

const api = process.env.NEXT_PUBLIC_API;
const client = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } });

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const name = useMemo(() => getStorage("name"), [router.pathname]);
  pageProps.name = name;
  pageProps.router = router;

  useEffect(() => {
    setLoading(false);
    init();
    if ("serviceWorker" in navigator && window.serwist) {
      window.serwist.register().then(() => window.serwist.addEventListener("controlling", handleVersionUpdate));
      return () => window.serwist.removeEventListener("controlling", handleVersionUpdate);
    }
  }, []);

  useEffect(() => {
    if (router.pathname !== "/") clearSessionStorage("edit");
    if (name && onlyGuest.includes(router.pathname)) router.replace("/");
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>CloudNotes - Notes on Cloud</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="keywords"
          content="cloud, notes, notes cloud, cloudnotes, platform, encryption, security, save, short notes, vercel, reactjs, online, online platform, free, access, anywhere, anytime, fast, independent, web app, world, continue"
        />
        <meta
          name="description"
          content="CloudNotes is an online platform to save all your notes on the cloud. We ensure strong encryption of your notes so that only you can access your notes."
        />
        <link rel="manifest" href="/manifest.json" />

        <link rel="preconnect" href={api} />

        <meta name="google-site-verification" content="5_rdfkDpTLo7tXDzIkEfmQb1wH_0AmpbcQOAPhLNBLQ" />

        <meta
          httpEquiv="Content-Security-Policy"
          content="
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleads.g.doubleclick.net https://www.google.co.in;
            style-src 'self' 'unsafe-inline';
            img-src * data:;
            connect-src *;"
        />

        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2732-2048.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1668-2388.jpg"
          media="(device-width: 834px) and (device-height: 
1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2388-1668.jpg"
          media="(device-width: 834px) and (device-height: 
1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1536-2048.jpg"
          media="(device-width: 768px) and (device-height: 
1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2048-1536.jpg"
          media="(device-width: 768px) and (device-height: 
1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1668-2224.jpg"
          media="(device-width: 834px) and (device-height: 
1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2224-1668.jpg"
          media="(device-width: 834px) and (device-height: 
1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1620-2160.jpg"
          media="(device-width: 810px) and (device-height: 
1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2160-1620.jpg"
          media="(device-width: 810px) and (device-height: 
1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 
926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2778-1284.jpg"
          media="(device-width: 428px) and (device-height: 
926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 
844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2532-1170.jpg"
          media="(device-width: 390px) and (device-height: 
844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 
812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2436-1125.jpg"
          media="(device-width: 375px) and (device-height: 
812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1242-2688.jpg"
          media="(device-width: 414px) and (device-height: 
896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2688-1242.jpg"
          media="(device-width: 414px) and (device-height: 
896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-828-1792.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1792-828.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1242-2208.jpg"
          media="(device-width: 414px) and (device-height: 
736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-2208-1242.jpg"
          media="(device-width: 414px) and (device-height: 
736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1334-750.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-640-1136.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-splash-1136-640.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
      </Head>

      {/* Google tag (gtag.js) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-DK5RMXJJMJ" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag() {dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-DK5RMXJJMJ');`}
      </Script>

      <QueryClientProvider client={client}>
        <NoteProvider router={router}>
          {!loading && router.isReady && (
            <>
              {(!hideNavbar.includes(router.pathname) || (name && router.pathname === "/")) && (
                <>
                  <Navbar name={name} router={router} />
                  <Modal router={router} />
                </>
              )}
              <Component {...pageProps} />
              <ToastContainer stacked autoClose={3000} pauseOnFocusLoss={false} position="bottom-left" />
            </>
          )}
        </NoteProvider>
      </QueryClientProvider>
    </>
  );
}
