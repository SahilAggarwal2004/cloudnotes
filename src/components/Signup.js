import React, { useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';
import ToggleContext from '../context/toggle/ToggleContext';


export default function Signup() {
    document.title = 'Signup | CloudNotes'

    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const cpassword = useRef();
    const redirect = useNavigate();
    // In react app, we can create environment variables to hide something confidential from public. They can be stored in a file named .env.local which is by default present in .gitignore and must be names like REACT_APP_NAME to be accessible in react app. These variables are stored in a js object and can be accessed in the application as shown below
    const { REACT_APP_SIGNUP } = process.env

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (localStorage.getItem('token')) redirect('/dashboard') }, []);

    async function verify(event) {
        event.preventDefault()
        if (password.current.value === cpassword.current.value) {
            setLoadbar([1 / 3, true])
            const json = await fetchApp(REACT_APP_SIGNUP, 'POST', { name: name.current.value, email: email.current.value, password: password.current.value })
            setLoadbar([1, true])
            setTimeout(() => {
                setLoadbar([0, false])
                if (!json.success) return showAlert(json.error, '')
                showAlert('Account created successfully! Please confirm your account via email to proceed!', 'green')
                redirect('/login')
            }, 300);
        } else {
            showAlert("Password doesn't match", '')
        }
    }

    return <div className='text-center py-5'>
        <h2 className='text-xl font-semibold mb-2'>Create a new account</h2>
        <form action="" method='post' onSubmit={verify}>
            <div>
                <input ref={name} type="text" placeholder='Enter name' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={3} maxLength={20} required />
            </div>
            <div>
                <input ref={email} type="email" placeholder='Enter email' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' required />
            </div>
            <div>
                <input ref={password} type="password" placeholder='Enter password' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={4} required autoComplete='new-password' />
            </div>
            <div className='mb-2'>
                <input ref={cpassword} type="password" placeholder='Confirm password' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={4} required />
            </div>
            <button type='submit' className='btn'>Sign Up</button>
        </form>
        <div className='text-sm pt-2'>
            <span>Already have an account? </span>
            <Link to='/login' className='text-blue-500 active:text-purple-500 font-semibold'>Click Here</Link>
        </div>
    </div>
}
