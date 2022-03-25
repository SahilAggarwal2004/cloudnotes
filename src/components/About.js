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
            <h2 className='text-2xl font-semibold'>CloudNotes</h2>
            <p className='pt-4'>
                CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.
            </p>
        </div>
        <hr className='w-11/12 border-black' />
        {/* <div>

        </div>
        <hr className='w-11/12 border-black' /> */}
        <div className='flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-2.5rem)] justify-center w-11/12 sm:max-w-fit'>
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
