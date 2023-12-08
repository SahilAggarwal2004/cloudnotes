import { toast } from 'react-toastify';
import { useNoteContext } from '../../../contexts/NoteProvider';
import { useToggleContext } from '../../../contexts/ToggleProvider';
import Head from 'next/head';

export default function Confirm({ router }) {
    const { token } = router.query;
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()

    async function verify() {
        if (!token) return
        setProgress(33)
        const json = await fetchApp('api/auth/confirm', 'PUT', {}, token);
        setProgress(100)
        if (!json.success) return
        toast.success(json.confirmed ? 'User already confirmed!' : 'Successfully confirmed your CloudNotes account!')
        router.replace('/account/login')
    }

    return <>
        <Head><title>CloudNotes - Notes on Cloud</title></Head>
        <div>
            <div className='fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] space-y-5 text-center'>
                <h3 className='font-semibold'>Confirm your CloudNotes account</h3>
                <button className='btn' onClick={verify}>Click Here!</button>
            </div>
        </div>
    </>
}
