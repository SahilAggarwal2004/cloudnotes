import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NoteContext from '../../context/notes/NoteContext';
import ToggleContext from '../../context/toggle/ToggleContext'

export default function Confirm() {
    document.title = 'CloudNotes - Notes on Cloud'

    const { token } = useParams();
    const redirect = useNavigate();
    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const { REACT_APP_CONFIRM } = process.env

    async function verify() {
        if (!token) return
        setLoadbar([1 / 3, true])
        let json = await fetchApp(REACT_APP_CONFIRM, 'PUT', {}, token);
        setLoadbar([1, true])

        setTimeout(() => {
            setLoadbar([0, false])
            if (!json.success) return
            json.confirmed ? showAlert('User already confirmed!', 'green') : showAlert('Successfully confirmed your CloudNotes account!', 'green')
            redirect('/login')
        }, 300);
    }

    return <div>
        <div className='fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] space-y-5 text-center'>
            <h3 className='font-semibold'>Confirm your CloudNotes account</h3>
            <button className='btn' onClick={verify}>Click Here!</button>
        </div>
    </div>
}
