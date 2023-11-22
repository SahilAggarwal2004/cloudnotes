/* eslint-disable react-hooks/exhaustive-deps */
import{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Offline() {
    const redirect = useNavigate();

    useEffect(() => { document.title = 'You are Offline' }, [])

    useEffect(() => { if (navigator.onLine) redirect('/dashboard') }, [navigator.onLine])

    return <div className="w-screen h-screen flex justify-center items-center bg-purple-700 inset-0 fixed z-20">
        <div className='text-white text-center px-4 font-sans space-y-2'>
            <h1 className='text-3xl'>Offline...</h1>
            <p>The current page isn't available offline. Please try again when you're back online.</p>
        </div>
    </div>
}
