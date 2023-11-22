/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStorage } from '../../modules/storage';
import Logo from '../Logo';
import Password from './Password';
import { useNoteContext } from '../../context/NoteState';
import { useToggleContext } from '../../context/ToggleState';

export default function Forgot() {
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()
    const email = useRef();
    const otp = useRef();
    const password = useRef();
    const redirect = useNavigate();
    const [stage, setStage] = useState(0)

    useEffect(() => {
        if (getStorage('name')) redirect('/dashboard')
        else document.title = 'Reset Password | CloudNotes'
    }, []);

    async function submit(event) {
        event.preventDefault()
        setProgress(33)
        if (!stage) {
            const { success, error } = await fetchApp('api/auth/otp', 'POST', { email: email.current.value })
            if (success) {
                toast.success('OTP sent to your email!')
                setStage(1)
            }
            else if (error === "OTP already sent!") setStage(stage + 1)
        } else {
            const { success } = await fetchApp('api/auth/forgot', 'PUT', { email: email.current.value, otp: otp.current.value, password: password.current.value })
            if (!success) return
            toast.success('Password reset successful!')
            redirect('/login')
        }
        setProgress(100)
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
                    <input ref={email} type="email" autoComplete="email" required className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md ${stage ? 'rounded-b-none' : ''} focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm`} placeholder="Email address" />
                    {Boolean(stage) && <>
                        <input ref={otp} type="text" autoComplete="new-password" minLength={6} maxLength={6} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm" placeholder="Enter OTP" />
                        <Password password={password} />
                    </>}
                </div>
                <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">{stage ? 'Reset password' : 'Send OTP'}</button>
            </form>
        </div>
    </div>
}
