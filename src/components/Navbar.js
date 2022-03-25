import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ToggleContext from '../context/toggle/ToggleContext'
import Loadbar from './Loadbar'

export default function Navbar() {
    let location = useLocation() // useLocation() returns a js object containing current location data and is immutable. pathname key of this object contains the url/path.
    const { setModal, hide, setHide } = useContext(ToggleContext)

    function extendNav() {
        setHide(!hide)
    }

    return (
        <div className='sticky inset-0 z-20'>
            <nav className={`flex bg-purple-700 text-white sm:justify-between items-center py-1.5 px-4 flex-col transition-all duration-500 sm:flex-row overflow-hidden ${hide ? 'h-10' : 'h-24'} sm:h-10 ${location.pathname.includes('/account/confirm') || location.pathname.includes('/account/delete') ? 'hidden' : ''}`}>
                <div className={`flex items-center justify-between w-full sm:justify-start ${localStorage.getItem('token') ? 'sm:space-x-5' : ''}`}>
                    <i className={`far fa-user cursor-pointer hover:scale-110 transition-all ${localStorage.getItem('token') ? '' : 'fixed invisible'}`} onClick={() => { setModal([{}, true, 'user']) }} />
                    <h2 className='text-xl text-center'>CloudNotes</h2>
                    <i className="fas fa-bars sm:invisible" onClick={extendNav} />
                </div>
                <div className='m-2 sm:m-0 sm:space-x-4 sm:flex'>
                    <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/dashboard" ? "font-bold" : "text-gray-300"}`} to="/dashboard" onClick={extendNav}>Dashboard</Link>
                    <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer ${location.pathname === "/about" ? "font-bold" : "text-gray-300"}`} to="/about" onClick={extendNav}>About</Link>
                </div>
            </nav>
            <Loadbar />
        </div>
    )
}
