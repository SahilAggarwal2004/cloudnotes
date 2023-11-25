import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { getStorage, resetStorage } from '../../modules/storage'
import { useNoteContext } from '../../contexts/NoteProvider';
import { useToggleContext } from '../../contexts/ToggleProvider';

export default function Modal({ router }) {
    const { fetchApp, deleteNote, noteToDelete } = useNoteContext()
    const { modal, setModal, setProgress } = useToggleContext()
    const name = useMemo(() => getStorage('name'), [])

    function handleCancel(event) {
        event.preventDefault()
        setModal([{}, false, ''])
    }

    async function logOut() {
        setProgress(100)
        toast.success('Logged out successfully!')
        setModal([{}, false, ''])
        resetStorage()
        router.replace('/account/account/login')
    }

    async function delUser() {
        setModal([{}, false, ''])
        setProgress(33)
        const { success, error } = await fetchApp('api/auth/delete', 'DELETE', {})
        setProgress(100)
        if (!success) return toast.error(error)
        toast.success('Account deleted successfully!')
        resetStorage()
        router.replace('/account/signup')
        setModal([{}, false, ''])
    }

    return <div>
        <div className={`${modal[1] ? 'bg-opacity-50' : 'invisible bg-opacity-0'} bg-black fixed inset-0 transition-all duration-700 z-40`} onClick={handleCancel} />
        <div className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white ${modal[1] ? 'opacity-100' : 'hidden'} p-4 rounded-md ${modal[2] === 'edit' ? 'w-4/5' : 'w-max'}`}>
            {modal[2] === 'user' ?
                <div>
                    {name && <h3 className='font-bold'>Hi, {name}!</h3>}
                    <div className='flex flex-col sm:space-x-2 sm:flex-row'>
                        <button className='btn' onClick={logOut}>Log Out</button>
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