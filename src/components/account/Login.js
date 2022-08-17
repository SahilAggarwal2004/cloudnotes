import React, { useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from '../../context/notes/NoteContext';
import ToggleContext from '../../context/toggle/ToggleContext';


export default function Login() {
    document.title = 'Login | CloudNotes'

    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const email = useRef();
    const password = useRef();
    const redirect = useNavigate()
    const { REACT_APP_LOGIN } = process.env

    useEffect(() => {
        if (localStorage.getItem('token')) redirect('/dashboard')
        // eslint-disable-next-line
    }, []);

    async function verify(event) {
        event.preventDefault()
        setLoadbar([1 / 3, true])
        const json = await fetchApp(REACT_APP_LOGIN, 'POST', { email: email.current.value, password: password.current.value })
        setLoadbar([1, true])
        setTimeout(() => {
            setLoadbar([0, false])
            if (!json.success) return showAlert(json.error, '')
            localStorage.setItem('name', json.name)
            localStorage.setItem('token', json.authtoken)
            showAlert('Logged in successfully!', 'green')
            redirect('/dashboard')
        }, 300);
    }

    return <div className='text-center py-5'>
        <h2 className='text-xl font-semibold mb-2'>Login to your account</h2>
        <form action="" method='post' onSubmit={verify}>
            <div className='w-4/5 sm:w-1/2 md:w-1/3 m-auto'>
                <div>
                    <input ref={email} type="email" placeholder='Enter email' className='text-center border-2 border-grey-600 my-1 w-full' required />
                </div>
                <div>
                    <input ref={password} type="password" placeholder='Enter password' className='text-center border-2 border-grey-600 my-1 w-full' minLength={4} required />
                </div>
                <Link to='/forgot' className='block text-gray-600 active:text-black font-semibold text-xs mb-2 mr-0.5 text-right'>Forgot Password?</Link>
            </div>
            <button type='submit' className='btn'>Log In</button>
        </form>
        <div className='text-sm pt-2'>
            <span>New to CloudNotes? </span>
            <Link to='/signup' className='text-blue-500 active:text-purple-500 font-semibold'>Click Here</Link>
        </div>
    </div>
}
