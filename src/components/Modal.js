import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { mutate } from 'swr'
import NoteContext from '../context/notes/NoteContext'
import ToggleContext from '../context/toggle/ToggleContext'

export default function Modal() {
    const { fetchApp, deleteNote, setNotes, setShow, noteToDelete, fetchAPI } = useContext(NoteContext)
    const { showAlert, modal, setModal, setLoadbar } = useContext(ToggleContext)
    const redirect = useNavigate()
    const { REACT_APP_DELETEUSER } = process.env

    function handleCancel(event) {
        event.preventDefault()
        setModal([{}, false, ''])
    }

    function logOut(msg, color) {
        if (msg === 'Cannot find the user!') {
            msg = 'Account deleted successfully!'
            color = 'green'
        }
        setLoadbar([1, true])
        setTimeout(() => {
            showAlert(msg, color)
            setLoadbar([0, false])
            if (!color) return
            localStorage.removeItem('name')
            localStorage.removeItem('token')
            localStorage.removeItem('notes')
            mutate(fetchAPI, [], false)
            setNotes([])
            setShow([])
            redirect('/signup')
            setModal([{}, false, ''])
        }, 300);
    }

    async function delUser() {
        setModal([{}, false, ''])
        setLoadbar([1 / 3, true])
        const authtoken = localStorage.getItem('token')
        if (!authtoken) {
            logOut('Account deleted successfully!', 'green')
            return
        }
        const json = await fetchApp(REACT_APP_DELETEUSER, 'DELETE', {}, authtoken)
        json.success ? logOut('Account deleted successfully!', 'green') : logOut(json.error, '')
    }

    return (
        <div className={`${modal[1] ? 'bg-opacity-50' : 'invisible bg-opacity-0'} bg-black fixed inset-0 flex items-center justify-center text-center transition-all duration-700 z-40`}>
            <div className={`z-50 bg-white ${modal[1] ? 'opacity-100' : 'hidden'} p-4 rounded-md ${modal[2] === 'edit' ? 'w-4/5' : 'w-max'}`}>
                {modal[2] === 'user' ?
                    <div>
                        {localStorage.getItem('name') ? <h3 className='font-bold'>Hi, {localStorage.getItem('name')}!</h3> : <></>}
                        <div className='flex flex-col sm:space-x-2 sm:flex-row'>
                            <button className='btn' onClick={() => { logOut('Logged out successfully!', 'green') }}>Log Out</button>
                            <button className='btn' onClick={() => {
                                setModal([{}, true, 'deleteUser'])
                            }}>Delete Account</button>
                            <button className='btn' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div> :
                    modal[2] === 'deleteUser' ?
                        <div>
                            <h3 className='font-bold'>Delete Account?</h3>
                            <p className='text-red-600 text-sm'>This action is irreversible</p>
                            <div className='space-x-2'>
                                <button className='btn' onClick={delUser}>Yes</button>
                                <button className='btn' onClick={handleCancel}>No</button>
                            </div>
                        </div> :
                        modal[2] === 'deleteNote' ?
                            <div>
                                <h3 className='font-bold'>Delete Note?</h3>
                                <p className='text-red-600 text-sm'>This action is irreversible</p>
                                <div className='space-x-2'>
                                    <button className='btn' onClick={() => {
                                        deleteNote(noteToDelete)
                                    }}>Yes</button>
                                    <button className='btn' onClick={handleCancel}>No</button>
                                </div>
                            </div> :
                            <></>
                }
            </div>
        </div>
    );
}
