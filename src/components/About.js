import React, { useEffect } from 'react';
import { FaUniversalAccess, FaStar, FaLinkedin, FaKey, FaShippingFast, FaGithub } from 'react-icons/fa'
import { IoIosApps } from 'react-icons/io'
import { GiTwoCoins } from 'react-icons/gi'

export default function About() {
    document.title = 'About | CloudNotes'

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

    return <div className='flex flex-col items-center text-center absolute top-0 w-full'>
        <div className='w-11/12 sm:w-2/3 h-screen flex flex-col justify-center items-center' data-aos='fade-up'>
            <img src='/images/logo.webp' alt="CloudNotes" className='w-16 h-16' />
            <h2 className='text-2xl font-semibold'>CloudNotes - Notes on Cloud</h2>
            <p className='pt-4'>
                CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.
            </p>
        </div>
        <hr className='w-11/12 border-black' />
        <div className='w-11/12 sm:w-2/3 min-h-screen flex flex-col justify-center items-center py-5'>
            <h2 className='text-2xl font-semibold' data-aos='fade-up'>Why CloudNotes?</h2>
            <ul className='mt-6 border border-black rounded-sm p-3 sm:p-5 flex flex-col space-y-2 text-left' data-aos='fade-up'>
                <li data-aos='fade-up' className='flex items-center'>
                    <span>
                        <FaUniversalAccess className="mr-2 w-5 text-red-500 scale-110" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>Access notes from anywhere anytime - </span>CloudNotes is available 24/7 all over the World!
                    </span>
                </li>
                <li data-aos='fade-up' className='flex items-center'>
                    <span>
                        <FaKey className="mr-2 w-5 text-green-600 scale-110" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>100% security - </span>Your notes are end-to-end encrypted!
                    </span>
                </li>
                <li data-aos='fade-up' className='flex items-center'>
                    <span>
                        <FaShippingFast className="mr-2 w-5 text-red-500 scale-110" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>Blazingly fast website - </span>CloudNotes has over 95 score on PageSpeed Insights!
                    </span>
                </li>
                <li data-aos='fade-up' className='flex items-center'>
                    <span>
                        <FaStar className="mr-2 w-5 text-green-600 scale-110" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>Platform friendly - </span>CloudNotes is independent of the OS of device!
                    </span>
                </li>
                <li data-aos='fade-up' className='flex items-center'>
                    <span>
                        <IoIosApps className="mr-2 w-5 text-red-500 scale-125" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>Progressive Web App - </span>Works even when you are offline!
                    </span>
                </li>
                <li data-aos='fade-up' data-aos-offset={100} className='flex items-center'>
                    <span>
                        <GiTwoCoins className="mr-2 w-5 text-green-600 scale-125" />
                    </span>
                    <span>
                        <span className='font-semibold mr-1'>All time free - </span>We focus on user satisfaction instead of money!
                    </span>
                </li>
            </ul>
        </div>
        <hr className='w-11/12 border-black' />
        <div className='flex flex-col h-[calc(100vh-5.5rem)] xs:h-[calc(100vh-4rem)] sm:h-[calc(100vh-2.5rem)] justify-center w-11/12 sm:max-w-fit'>
            <h3 className='text-xl font-semibold' data-aos='fade-up'>Created By:</h3>
            <div className='flex flex-col items-center px-10 py-4 m-3 relative mt-24 pt-16 border border-black rounded-sm' data-aos='fade-up'>
                <img src='/images/creator.webp' alt="Sahil Aggarwal" className='w-36 h-36 rounded-full border-2 border-black absolute top-0 translate-y-[-50%]' />
                <div className='font-semibold text-lg mt-4' data-aos='fade-up'>Sahil Aggarwal</div>
                <div className='text-gray-700 mt-2' data-aos='fade-up'>CSE, 1st Year, MSIT</div>
                <div className='text-gray-700 mt-2' data-aos='fade-up'>Full Stack Web Developer</div>
            </div>
        </div>
        <footer className='w-full text-center bg-purple-600 text-white px-3 py-2 flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0'>
            <div className='flex space-x-4 px-2'>
                <a href="https://www.linkedin.com/in/sahilaggarwal2004/" target="_blank" rel="noreferrer"><FaLinkedin className="scale-125 inline" title='LinkedIn' /></a>
                <a href="https://github.com/SahilAggarwal2004" target="_blank" rel="noreferrer"><FaGithub className="scale-125 inline" title='GitHub' /></a>
            </div>
            <div>Copyright&copy; <strong>CloudNotes</strong> 2022 | All rights reserved</div>
        </footer>
    </div>
}
