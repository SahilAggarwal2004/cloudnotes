import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Welcome() {
  document.title = 'CloudNotes - Notes on Cloud'

  const redirect = useNavigate();
  const [welcome, setWelcome] = useState(false);
  const bg = 'https://images.weserv.nl/?url=https://cloudnotesweb.herokuapp.com/media/bg.webp&maxage=1y&q=50'
  const logo = 'https://images.weserv.nl/?url=https://cloudnotesweb.herokuapp.com/media/logo.webp&width=100&height=100&maxage=1y&q=1'

  useEffect(() => {
    localStorage.getItem('token') ? redirect('/dashboard') : setWelcome(true)
    return () => {
      setWelcome(false)
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`flex container fixed inset-0 normal:text-white normal:text-opacity-90 justify-center min-w-full ${welcome ? '' : 'hidden'}`}>
      <div className="container col-span-3 flex flex-col justify-evenly items-center min-w-[30vw] h-full normal:bg-purple-600">
        <div className='flex flex-col items-center'>
          <img src={logo} alt="CloudNotes" id="logo" className='w-16 h-16 normal:hidden' />
          <img src={logo} alt="CloudNotes" id="logo" className='w-16 h-16 hidden normal:block' style={{ filter: "invert(90%)" }} />
          <h1 className='text-xl font-bold normal:font-semibold'>CloudNotes - Notes on Cloud</h1>
        </div>
        <div className='px-7 text-justify'>CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.</div>
        <Link className="p-1 relative hover:after:scale-100 hover:translate-x-2 after:content-[''] after:h-0.5 after:w-[100%] after:absolute after:scale-0 after:left-0 after:top-[calc(100%)] after:z-10 after:border after:opacity-90 after:border-black normal:after:border-white after:transition-transform after:duration-300 transition-transform duration-300" to="/signup"><strong>Continue to Website</strong> ➤</Link>
      </div>
      <img src={bg} alt="CloudNotes" className='fixed normal:static h-full object-cover w-full -z-10 normal:z-0 normal:min-w-[70vw]' />
    </div>
  )
}
