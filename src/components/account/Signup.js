/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStorage } from '../../modules/storage';
import Logo from '../Logo';
import Password from './Password';
import { useNoteContext } from '../../context/NoteState';
import { useToggleContext } from '../../context/ToggleState';

export default function Signup() {
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const redirect = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (getStorage('name')) redirect('/dashboard')
        else document.title = 'Signup | CloudNotes'
    }, []);

    async function submit(event) {
        event.preventDefault()
        setProgress(33)
        const json = await fetchApp('api/auth/signup', 'POST', { name: name.current.value, email: email.current.value, password: password.current.value })
        setProgress(100)
        if (!json.success) return
        toast.success('Account created successfully! Please confirm your account via email to proceed!')
        redirect('/login')
    }

    return <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div className='space-y-2 text-center'>
                <Logo />
                <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
                <p className="text-sm text-gray-600">
                    or <Link to='/login'><span className="font-medium hover:text-black">Log In</span></Link>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={submit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <input ref={name} type="text" autoComplete="name" required minLength={3} maxLength={20} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-600 focus:border-purplr-600 focus:z-10 sm:text-sm" placeholder="Your name" />
                    <input ref={email} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm" placeholder="Email address" />
                    <Password password={password} />
                </div>

                <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">Sign up</button>
            </form>
        </div>
    </div>
}
