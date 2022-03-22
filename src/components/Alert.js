import React, { useContext } from 'react'
import ToggleContext from '../context/toggle/ToggleContext'

export default function Alert() {
    const { alert } = useContext(ToggleContext)

    return (
        <div id='alert' className={`z-30 fixed w-full bottom-0 text-center py-1.5 text-white ${alert[1] === 'green' ? 'bg-green-700' : 'bg-red-700'} ${alert[2] ? 'visible' : 'invisible'}`}>
            {alert[0]}
        </div>
    )
}
