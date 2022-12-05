import React, { useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from '../../context/notes/NoteContext';
import ToggleContext from '../../context/toggle/ToggleContext';
import Logo from '../Logo';
import Password from './Password';


export default function Signup() {
    document.title = 'Signup | CloudNotes'

    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const redirect = useNavigate();
    // In react app, we can create environment variables to hide something confidential from public. They can be stored in a file named .env.local which is by default present in .gitignore and must be names like REACT_APP_NAME to be accessible in react app. These variables are stored in a js object and can be accessed in the application as shown below
    const { REACT_APP_SIGNUP } = process.env

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (localStorage.getItem('name')) redirect('/dashboard') }, []);

    async function submit(event) {
        event.preventDefault()
        setLoadbar([1 / 3, true])
        const json = await fetchApp(REACT_APP_SIGNUP, 'POST', { name: name.current.value, email: email.current.value, password: password.current.value })
        setLoadbar([1, true])
        setTimeout(() => {
            setLoadbar([0, false])
            if (!json.success) return
            showAlert('Account created successfully! Please confirm your account via email to proceed!', 'green')
            redirect('/login')
        }, 300);
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
