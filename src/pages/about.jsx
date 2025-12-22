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
          <p className="pt-4">
            CloudNotes is a simple and reliable platform for taking notes and accessing them across devices. It is designed with an offline first approach, allowing you to create,
            edit, and view notes even without an internet connection. Your notes are automatically synced when you come back online.
          </p>
        </div>

        <hr className="w-11/12 border-black" />

        <div className="flex min-h-screen w-11/12 flex-col items-center justify-center py-5 sm:w-2/3">
          <h2 className="text-2xl font-semibold" data-aos="fade-up">
            Why CloudNotes?
          </h2>

          <ul className="mt-6 flex flex-col space-y-2 rounded-sm border border-black p-3 text-left sm:p-5" data-aos="fade-up">
            <li data-aos="fade-up" className="flex items-center">
              <FaUniversalAccess className="mr-2 w-5 scale-110 text-red-500" />
              <span>
                <span className="mr-1 font-semibold">Access anywhere anytime -</span>
                Your notes are available across devices.
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <FaKey className="mr-2 w-5 scale-110 text-green-600" />
              <span>
                <span className="mr-1 font-semibold">Privacy focused -</span>
                Built with modern security best practices.
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <FaShippingFast className="mr-2 w-5 scale-110 text-red-500" />
              <span>
                <span className="mr-1 font-semibold">Fast and responsive -</span>
                Quick and smooth experience.
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <FaStar className="mr-2 w-5 scale-110 text-green-600" />
              <span>
                <span className="mr-1 font-semibold">Platform independent -</span>
                Works across devices and OS.
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <IoIosApps className="mr-2 w-5 scale-125 text-red-500" />
              <span>
                <span className="mr-1 font-semibold">Progressive Web App -</span>
                Use it even when offline.
              </span>
            </li>
            <li data-aos="fade-up" className="flex items-center">
              <GiTwoCoins className="mr-2 w-5 scale-125 text-green-600" />
              <span>
                <span className="mr-1 font-semibold">Lifetime free tier -</span>
                Core features are always free.
              </span>
            </li>
          </ul>
        </div>
        <footer className="flex w-full flex-col items-center justify-between space-y-1 bg-purple-600 px-3 py-2 text-center text-white sm:flex-row sm:space-y-0">
          <div>Made with 🤍 by Sahil Aggarwal</div>
          <div className="flex-group px-2">
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
