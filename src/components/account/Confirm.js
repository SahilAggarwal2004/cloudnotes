import { useEffect } from 'react'
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '../../context/NoteState';
import { useToggleContext } from '../../context/ToggleState';

export default function Confirm() {
    const { token } = useParams();
    const redirect = useNavigate();
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()

    useEffect(() => { document.title = 'CloudNotes - Notes on Cloud' }, [])

    async function verify() {
        if (!token) return
        setProgress(33)
        const json = await fetchApp('api/auth/confirm', 'PUT', {}, token);
        setProgress(100)
        if (!json.success) return
        toast.success(json.confirmed ? 'User already confirmed!' : 'Successfully confirmed your CloudNotes account!')
        redirect('/login')
    }

    return <div>
        <div className='fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] space-y-5 text-center'>
            <h3 className='font-semibold'>Confirm your CloudNotes account</h3>
            <button className='btn' onClick={verify}>Click Here!</button>
        </div>
    </div>
}
