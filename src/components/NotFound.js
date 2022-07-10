import React from 'react'

export default function NotFound() {
    document.title = 'Page Not Found | CloudNotes'

    return (
        <div className='fixed top-0 w-full h-full flex flex-col space-y-2 items-center justify-center'>
            <h3 className='text-3xl font-semibold'>404</h3>
            <h3 className='text-xl'>This page is not available!</h3>
        </div>
    )
}
