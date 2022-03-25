import React, { useEffect } from 'react';
import logo from '../media/logo.webp'
import creator from '../media/owner.webp';

export default function About() {
    document.title = 'About | CloudNotes'

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (<div className='flex flex-col items-center text-center absolute top-0'>
        <div className='w-11/12 sm:w-2/3 h-screen flex flex-col justify-center items-center' data-aos='fade-up'>
            <img src={logo} alt="CloudNotes" className='w-16 h-16' />
            <h2 className='text-2xl font-semibold'>CloudNotes - Notes on Cloud</h2>
            <p className='pt-4'>
                CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.
            </p>
        </div>
        <hr className='w-11/12 border-black' />
        <div className='w-11/12 sm:w-2/3 min-h-screen flex flex-col justify-center items-center py-5'>
            <h2 className='text-2xl font-semibold' data-aos='fade-up'>Why CloudNotes?</h2>
            <ul className='mt-6 border border-black rounded-sm p-5 flex flex-col space-y-2 text-left' data-aos='fade-up'>
                <li data-aos='fade-up'>
                    <i className="fas fa-universal-access mr-2 w-5 text-red-500" />
                    <span className='font-semibold'>Access notes from anywhere anytime</span> - CloudNotes is available 24/7 all over the World!
                </li>
                <li data-aos='fade-up'>
                    <i className="fas fa-key mr-2 w-5 text-green-600" />
                    <span className='font-semibold'>100% security</span> - Your notes are end-to-end encryted!
                </li>
                <li data-aos='fade-up'>
                    <i className="fas fa-shipping-fast mr-2 w-5 text-red-500" />
                    <span className='font-semibold'>Blazingly fast website</span> - CloudNotes has over 95 score on PageSpeed Insights!
                </li>
                <li data-aos='fade-up'>
                    <i className="fas fa-star mr-2 w-5 text-green-600" />
                    <span className='font-semibold'>Platform friendly</span> - CloudNotes is independent of the OS of device!
                </li>
                <li data-aos='fade-up'>
                    <i className="fas fa-browser mr-2 w-5 text-red-500" />
                    <span className='font-semibold'>Convertible into a Web App</span> - Don't want to go to browser everytime? No worries!
                </li>
                <li data-aos='fade-up'>
                    <i className="fas fa-coins mr-2 w-5 text-green-600" />
                    <span className='font-semibold'>All time free</span> - We focus on user satisfaction instead of money!
                </li>
            </ul>
        </div>
        <hr className='w-11/12 border-black' />
        <div className='flex flex-col h-[calc(100vh-5.5rem)] xs:h-[calc(100vh-4rem)] sm:h-[calc(100vh-2.5rem)] justify-center w-11/12 sm:max-w-fit'>
            <h3 className='text-xl font-semibold' data-aos='fade-up'>Created By:</h3>
            <div className='flex flex-col items-center px-10 py-4 m-3 relative mt-24 pt-16 border border-black rounded-sm' data-aos='fade-up'>
                <img src={creator} alt="Sahil Aggarwal" className='w-36 h-36 rounded-full border-2 border-black absolute top-0 translate-y-[-50%]' />
                <div className='font-semibold text-lg mt-4' data-aos='fade-up'>Sahil Aggarwal</div>
                <div className='text-gray-700 mt-2' data-aos='fade-up'>CSE, 1st Year, MSIT</div>
                <div className='text-gray-700 mt-2' data-aos='fade-up'>Full Stack Web Developer</div>
            </div>
        </div>
        <footer className='w-full text-center bg-purple-600 text-white px-3 py-2 flex flex-col sm:flex-row justify-between'>
            <a href="https://www.linkedin.com/in/sahilaggarwal2004/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin" /> Follow me on LinkedIn!</a>
            <div>Copyright&copy; <strong>CloudNotes</strong> 2022 | All rights reserved</div>
        </footer>
    </div>)
}
