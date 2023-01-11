import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ToggleContext from '../../context/toggle/ToggleContext'
import Loadbar from './../Loadbar'
import { FaRegUser, FaBars } from 'react-icons/fa'
import { getStorage } from '../../modules/storage'

export default function Navbar() {
    const location = useLocation() // useLocation() returns a js object containing current location data and is immutable. pathname key of this object contains the url/path.
    const { setModal, hide, setHide } = useContext(ToggleContext)
    const name = getStorage('name')
    const extendNav = () => setHide(!hide)

    return <nav className='sticky inset-0 z-20'>
        <div className='flex bg-purple-700 text-white sm:justify-between items-center py-2 px-4 flex-col sm:flex-row overflow-hidden'>
            <div className={`flex items-center justify-between w-full sm:justify-start ${name && 'sm:space-x-5'}`}>
                <FaRegUser className={`cursor-pointer scale-125 font-extrabold transition-all ${!name && 'fixed invisible'}`} onClick={() => setModal([{}, true, 'user'])} />
                <Link to='/'><h2 className='text-xl text-center font-semibold'>CloudNotes</h2></Link>
                <FaBars className="sm:invisible scale-125" onClick={extendNav} />
            </div>
            <div className={`mt-3 space-y-0.5 sm:m-0 sm:space-y-0 sm:space-x-4 sm:flex ${hide && 'hidden'} sm:inline-block`}>
                {name ?
                    <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/dashboard" ? "font-bold" : "text-gray-300"}`} to="/dashboard" onClick={extendNav}>Dashboard</Link> :
                    <>
                        <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/signup" ? "font-bold" : "text-gray-300"}`} to="/signup" onClick={extendNav}>Signup</Link>
                        <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/login" ? "font-bold" : "text-gray-300"}`} to="/login" onClick={extendNav}>Login</Link>
                    </>}
                <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/about" ? "font-bold" : "text-gray-300"}`} to="/about" onClick={extendNav}>About</Link>
            </div>
        </div>
        <Loadbar />
    </nav>
}
