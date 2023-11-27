/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';
import { resetStorage } from '../modules/storage'
import { useNoteContext } from '../contexts/NoteProvider';
import { useToggleContext } from '../contexts/ToggleProvider';
import { useCallback } from 'react';

export default function Modal({ router }) {
    const { fetchApp, deleteNote, noteToDelete } = useNoteContext()
    const { modal: { active, type, ...props }, setModal, setProgress } = useToggleContext()
    const { name } = props

    const closeModal = useCallback(() => setModal({ active: false }), []);

    async function logOut() {
        setProgress(100)
        setModal({ active: false })
        toast.success('Logged out successfully!')
        resetStorage()
        router.replace('/account/login')
    }

    async function delUser() {
        setProgress(33)
        setModal({ active: false })
        const { success, error } = await fetchApp('api/auth/delete', 'DELETE', {})
        setProgress(100)
        if (!success) return toast.error(error)
        toast.success('Account deleted successfully!')
        resetStorage()
        router.replace('/account/signup')
    }

    return <div>
        <div className={`${active ? 'bg-opacity-50' : 'invisible bg-opacity-0'} bg-black fixed inset-0 transition-all duration-700 z-40`} onClick={closeModal} />
        <div className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white ${active ? 'opacity-100' : 'hidden'} p-4 rounded-md ${type === 'edit' ? 'w-4/5' : 'w-max'}`}>
            {type === 'user' ? <div>
                <h3 className='font-semibold mb-2 text-lg'>Hi, {name}!</h3>
                <div className='flex flex-col sm:space-x-2 sm:flex-row'>
                    <button className='btn' onClick={logOut}>Log Out</button>
                    <button className='btn' onClick={() => setModal({ active: true, type: 'deleteUser' })}>Delete Account</button>
                    <button className='btn' onClick={closeModal}>Cancel</button>
                </div>
            </div> : type === 'deleteUser' ? <div>
                <h3 className='font-bold'>Delete Account?</h3>
                <p className='text-red-600 text-sm'>This action is irreversible</p>
                <div className='space-x-2'>
                    <button className='btn' onClick={delUser}>Yes</button>
                    <button className='btn' onClick={closeModal}>No</button>
                </div>
            </div> : type === 'deleteNote' && <div>
                <h3 className='font-bold'>Delete Note?</h3>
                <p className='text-red-600 text-sm'>This action is irreversible</p>
                <div className='space-x-2'>
                    <button className='btn' onClick={() => deleteNote(noteToDelete)}>Yes</button>
                    <button className='btn' onClick={closeModal}>No</button>
                </div>
            </div>}
        </div>
    </div>
}