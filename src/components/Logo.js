import React from 'react'

export default function Logo({ type, width, height }) {
    return <div className="flex justify-center select-none">
        <img src="/images/logo.webp" alt="CloudNotes" width={width || 60} height={height || 60} className={type === 'black' ? 'normal:hidden' : type === 'white' ? 'hidden normal:block' : undefined} style={type === 'white' ? { filter: "invert(90%)" } : {}} />
    </div>
}