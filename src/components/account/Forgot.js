/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from '../../context/notes/NoteContext';
import ToggleContext from '../../context/toggle/ToggleContext';
import Logo from '../Logo';
import Password from './Password';


export default function Forgot() {
    document.title = 'Reset Password | CloudNotes'

    const { fetchApp } = useContext(NoteContext)
    const { showAlert, setLoadbar } = useContext(ToggleContext)
    const email = useRef();
    const otp = useRef();
    const password = useRef();
    const redirect = useNavigate();
    const [stage, setStage] = useState(0)
    const { REACT_APP_OTP, REACT_APP_FORGOT } = process.env

    useEffect(() => { if (localStorage.getItem('token')) redirect('/dashboard') }, []);

    async function submit(event) {
        event.preventDefault()
        setLoadbar([1 / 3, true])
        if (!stage) {
            const { success, error } = await fetchApp(REACT_APP_OTP, 'POST', { email: email.current.value })
            setTimeout(() => {
                if (success) {
                    showAlert('OTP sent to your email!', 'green')
                    setStage(1)
                }
                else if (error === "OTP already sent!") setStage(stage + 1)
                setLoadbar([0, false])
            }, 300);
        } else {
            const { success } = await fetchApp(REACT_APP_FORGOT, 'PUT', { email: email.current.value, otp: otp.current.value, password: password.current.value })
            setTimeout(() => {
                setLoadbar([0, false])
                if (!success) return
                showAlert('Password reset successful!', 'green')
                redirect('/login')
            }, 300);
        }
        setLoadbar([1, true])
    }

    return <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div className='space-y-2 text-center'>
                <Logo />
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-sm text-gray-600">
                    or <Link to='/login'><span className="font-medium hover:text-black">Login</span></Link>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={submit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <input ref={email} type="email" autoComplete="email" required className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md ${stage ? 'rounded-b-none' : ''} focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm`} placeholder="Email address" />
                    {Boolean(stage) && <>
                        <input ref={otp} type="text" autoComplete="new-password" minLength={6} maxLength={6} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Enter OTP" />
                        <Password password={password} />
                    </>}
                </div>
                <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">{stage ? 'Reset password' : 'Send OTP'}</button>
            </form>
        </div>
    </div>
}
