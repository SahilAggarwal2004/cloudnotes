/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { FaUniversalAccess, FaStar, FaLinkedin, FaKey, FaShippingFast, FaGithub } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";
import { GiTwoCoins } from "react-icons/gi";
import Logo from "../components/icons/Logo";
import Head from "next/head";

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Head>
        <title>About | CloudNotes</title>
      </Head>
      <div className="absolute top-0 flex w-full flex-col items-center text-center">
        <div className="flex h-screen w-11/12 flex-col items-center justify-center sm:w-2/3" data-aos="fade-up">
          <Logo />
          <h2 className="text-2xl font-semibold">CloudNotes - Notes on Cloud</h2>
          <p className="pt-4">CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.</p>
        </div>
        <hr className="w-11/12 border-black" />
        <div className="flex min-h-screen w-11/12 flex-col items-center justify-center py-5 sm:w-2/3">
          <h2 className="text-2xl font-semibold" data-aos="fade-up">
            Why CloudNotes?
          </h2>
          <ul className="mt-6 flex flex-col space-y-2 rounded-sm border border-black p-3 text-left sm:p-5" data-aos="fade-up">
            <li data-aos="fade-up" className="flex items-center">
              <span>
                <FaUniversalAccess className="mr-2 w-5 scale-110 text-red-500" />
              </span>
              <span>
                <span className="mr-1 font-semibold">Access notes from anywhere anytime - </span>CloudNotes is available 24/7 all over the World!
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <span>
                <FaKey className="mr-2 w-5 scale-110 text-green-600" />
              </span>
              <span>
                <span className="mr-1 font-semibold">100% security - </span>Your notes are end-to-end encrypted!
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <span>
                <FaShippingFast className="mr-2 w-5 scale-110 text-red-500" />
              </span>
              <span>
                <span className="mr-1 font-semibold">Blazingly fast website - </span>CloudNotes has over 95 score on PageSpeed Insights!
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <span>
                <FaStar className="mr-2 w-5 scale-110 text-green-600" />
              </span>
              <span>
                <span className="mr-1 font-semibold">Platform friendly - </span>CloudNotes is independent of the OS of device!
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <span>
                <IoIosApps className="mr-2 w-5 scale-125 text-red-500" />
              </span>
              <span>
                <span className="mr-1 font-semibold">Progressive Web App - </span>Works even when you are offline!
              </span>
            </li>
            <li data-aos="fade-up" data-aos-offset={100} className="flex items-center">
              <span>
                <GiTwoCoins className="mr-2 w-5 scale-125 text-green-600" />
              </span>
              <span>
                <span className="mr-1 font-semibold">All time free - </span>We focus on user satisfaction instead of money!
              </span>
            </li>
          </ul>
        </div>
        <footer className="flex w-full flex-col items-center justify-between space-y-1 bg-purple-600 px-3 py-2 text-center text-white sm:flex-row sm:space-y-0">
          <div>Made with 🤍 by Sahil Aggarwal</div>
          <div className="flex space-x-4 px-2">
            <a href="https://www.linkedin.com/in/sahilaggarwal2004/" target="_blank" rel="noreferrer">
              <FaLinkedin className="inline scale-125" title="LinkedIn" />
            </a>
            <a href="https://github.com/SahilAggarwal2004" target="_blank" rel="noreferrer">
              <FaGithub className="inline scale-125" title="GitHub" />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
