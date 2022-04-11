import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mutate } from 'swr';
import NoteContext from '../context/notes/NoteContext';
import ToggleContext from '../context/toggle/ToggleContext'

export default function Account() {
    document.title = 'CloudNotes - Notes on Cloud'

    const { type, token } = useParams();
    const redirect = useNavigate();
    const { fetchApp, setNotes, setShow, fetchAPI } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const { REACT_APP_CONFIRM, REACT_APP_DELETEUSER } = process.env

    async function verify() {
        if (!token) return
        setLoadbar([1 / 3, true])
        let json = {};
        if (type === 'confirm') {
            json = await fetchApp(REACT_APP_CONFIRM, 'PUT', {}, token)
        } else if (type === 'delete') {
            json = await fetchApp(REACT_APP_DELETEUSER, 'DELETE', {}, token)
        }
        setLoadbar([1, true])

        setTimeout(() => {
            setLoadbar([0, false])
            if (!json.success) {
                showAlert(json.error, '')
                return
            }
            if (type === 'delete') {
                localStorage.removeItem('name')
                localStorage.removeItem('token')
                localStorage.removeItem('notes')
                mutate(fetchAPI, [], false)
                setNotes([])
                setShow([])
                showAlert('Successfully deleted your CloudNotes account!', 'green')
                redirect('/signup')
                return
            }
            json.confirmed ? showAlert('User already confirmed!', 'green') : showAlert('Successfully confirmed your CloudNotes account!', 'green')
            redirect('/login')
        }, 300);
    }

    return (
        <div className={`${(type === 'confirm' || type === 'delete') ? '' : 'hidden'}`}>
            <div className='fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] space-y-5 text-center'>
                <h3 className='font-semibold'>{type === 'confirm' ? 'Confirm' : 'Delete'} your CloudNotes account</h3>
                <button className='btn' onClick={verify}>Click Here!</button>
            </div>
        </div>
    )
}
