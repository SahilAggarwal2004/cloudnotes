import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    document.title = 'Page Not Found | CloudNotes'

    const redirect = useNavigate()
    useEffect(() => {
        const timeout = setTimeout(() => redirect('/dashboard'), 3000);
        return () => clearTimeout(timeout)
        // eslint-disable-next-line
    }, [])


    return (
        <div className='fixed top-0 w-full h-full flex flex-col space-y-2 items-center justify-center'>
            <h3 className='text-xl font-semibold'>This page is not available!</h3>
            <span>Redirecting you to the Dashboard...</span>
        </div>
    )
}
