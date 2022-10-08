/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from '../../context/notes/NoteContext';
import ToggleContext from '../../context/toggle/ToggleContext';


export default function Forgot() {
    document.title = 'Reset Password | CloudNotes'

    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const email = useRef();
    const otp = useRef();
    const password = useRef();
    const cpassword = useRef();
    const redirect = useNavigate();
    const [stage, setStage] = useState(1)
    const { REACT_APP_OTP, REACT_APP_FORGOT } = process.env

    useEffect(() => { if (localStorage.getItem('token')) redirect('/dashboard') }, []);

    async function stage1(event) {
        event.preventDefault()
        setLoadbar([1 / 3, true])
        const json = await fetchApp(REACT_APP_OTP, 'POST', { email: email.current.value })
        setLoadbar([1, true])
        setTimeout(() => {
            if (json.success) {
                showAlert('OTP sent to your email!', 'green')
                setStage(stage + 1)
            }
            else {
                if (json.error === "OTP already sent!") setStage(stage + 1)
            }
            setLoadbar([0, false])
        }, 300);
    }

    async function stage2(event) {
        event.preventDefault()
        if (password.current.value !== cpassword.current.value) return showAlert("Password doesn't match", '')
        setLoadbar([1 / 3, true])
        const json = await fetchApp(REACT_APP_FORGOT, 'PUT', { email: email.current.value, otp: otp.current.value, password: password.current.value })
        setLoadbar([1, true])
        setTimeout(() => {
            setLoadbar([0, false])
            if (!json.success) return
            showAlert('Password reset successful!', 'green')
            redirect('/login')
        }, 300);
    }

    return <div className='text-center py-5'>
        <h2 className='text-xl font-semibold mb-2 px-4'>Forgot Password</h2>
        <form action="" method='post' onSubmit={stage === 1 ? stage1 : stage2}>
            <div>
                <input ref={email} type="email" placeholder='Enter email' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' required />
            </div>
            {stage === 2 ?
                <>
                    <div>
                        <input ref={otp} type="text" placeholder='Enter OTP' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={6} maxLength={6} required />
                    </div>
                    <div>
                        <input ref={password} type="password" placeholder='Enter new password' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={4} required autoComplete='new-password' />
                    </div>
                    <div>
                        <input ref={cpassword} type="password" placeholder='Confirm new password' className='text-center border-2 border-grey-600 my-1 w-4/5 sm:w-1/3' minLength={4} required />
                    </div>
                </> : <></>}
            <div className='my-2'></div>
            <button type='submit' className='btn'>{stage === 1 ? 'Send OTP' : 'Reset Password'}</button>
        </form>
        <div className='text-sm pt-2'>
            <span>Remember your password? </span>
            <Link to='/login' className='text-blue-500 active:text-purple-500 font-semibold'>Click Here</Link>
        </div>
    </div>
}
