import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { mutate } from 'swr'
import NoteContext from '../../context/notes/NoteContext'
import ToggleContext from '../../context/toggle/ToggleContext'
import { getStorage, resetStorage } from '../../modules/storage'

export default function Modal() {
    const { fetchApp, deleteNote, setNotes, noteToDelete, fetchAPI } = useContext(NoteContext)
    const { showAlert, modal, setModal, setLoadbar } = useContext(ToggleContext)
    const redirect = useNavigate()
    const { REACT_APP_DELETEUSER } = process.env
    const name = getStorage('name')

    function handleCancel(event) {
        event.preventDefault()
        setModal([{}, false, ''])
    }

    async function logOut() {
        setLoadbar([1 / 3, true])
        const { success } = await fetchApp('/api/auth/logout')
        setLoadbar([1, true])
        setTimeout(() => {
            success ? showAlert('Account deleted successfully!', 'green') : showAlert('Something went wrong', 'red')
            setLoadbar([0, false])
            setModal([{}, false, ''])
            if (!success) return
            resetStorage()
            mutate(fetchAPI, [], false)
            setNotes([])
            redirect('/login')
        }, 300);
    }

    async function delUser() {
        setModal([{}, false, ''])
        setLoadbar([1 / 3, true])
        const { success, error } = await fetchApp(REACT_APP_DELETEUSER, 'DELETE', {})
        setLoadbar([1, true])
        setTimeout(() => {
            success ? showAlert('Account deleted successfully!', 'green') : showAlert(error, 'red')
            setLoadbar([0, false])
            if (!success) return
            resetStorage()
            mutate(fetchAPI, [], false)
            setNotes([])
            redirect('/signup')
            setModal([{}, false, ''])
        }, 300);
    }

    return <div>
        <div className={`${modal[1] ? 'bg-opacity-50' : 'invisible bg-opacity-0'} bg-black fixed inset-0 transition-all duration-700 z-40`} onClick={handleCancel} />
        <div className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white ${modal[1] ? 'opacity-100' : 'hidden'} p-4 rounded-md ${modal[2] === 'edit' ? 'w-4/5' : 'w-max'}`}>
            {modal[2] === 'user' ?
                <div>
                    {name && <h3 className='font-bold'>Hi, {name}!</h3>}
                    <div className='flex flex-col sm:space-x-2 sm:flex-row'>
                        <button className='btn' onClick={() => logOut()}>Log Out</button>
                        <button className='btn' onClick={() => setModal([{}, true, 'deleteUser'])}>Delete Account</button>
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
                    modal[2] === 'deleteNote' && <div>
                        <h3 className='font-bold'>Delete Note?</h3>
                        <p className='text-red-600 text-sm'>This action is irreversible</p>
                        <div className='space-x-2'>
                            <button className='btn' onClick={() => {
                                deleteNote(noteToDelete)
                            }}>Yes</button>
                            <button className='btn' onClick={handleCancel}>No</button>
                        </div>
                    </div>}
        </div>
    </div>
}
