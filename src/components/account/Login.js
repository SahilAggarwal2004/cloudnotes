/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStorage, setStorage } from '../../modules/storage';
import Logo from '../Logo';
import Password from './Password';
import { useNoteContext } from '../../context/NoteState';
import { useToggleContext } from '../../context/ToggleState';

export default function Login() {
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()
    const email = useRef();
    const password = useRef();
    const redirect = useNavigate()

    useEffect(() => {
        if (getStorage('name')) redirect('/dashboard')
        document.title = 'Login | CloudNotes'
    }, []);

    async function submit(event) {
        event.preventDefault()
        setProgress(33)
        const { success, name, token } = await fetchApp('api/auth/login', 'POST', { email: email.current.value, password: password.current.value })
        setProgress(100)
        if (!success) return
        setStorage('name', name)
        setStorage('token', token)
        toast.success('Logged in successfully!')
        redirect('/dashboard')
    }

    return <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div className='space-y-2 text-center'>
                <Logo />
                <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
                <p className="text-sm text-gray-600">
                    or <Link to='/signup'><span className="font-medium hover:text-black">Sign Up</span></Link>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={submit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <input ref={email} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm" placeholder="Email address" />
                    <Password password={password} />
                </div>

                <Link to='/forgot' className='flex'><div className="cursor-pointer font-medium text-sm text-gray-600 hover:text-black">Forgot your password?</div></Link>

                <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">Log in</button>
            </form>
        </div>
    </div>
}
