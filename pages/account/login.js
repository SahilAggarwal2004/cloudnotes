/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { setStorage } from '../../modules/storage';
import Logo from '../../components/Logo';
import Password from '../../components/Password';
import { useNoteContext } from '../../contexts/NoteProvider';
import { useToggleContext } from '../../contexts/ToggleProvider';

export default function Login({ router }) {
    const { fetchApp } = useNoteContext()
    const { setProgress } = useToggleContext()
    const email = useRef();
    const password = useRef();

    async function submit(event) {
        event.preventDefault()
        setProgress(33)
        const { success, name, token } = await fetchApp('api/auth/login', 'POST', { email: email.current.value, password: password.current.value })
        setProgress(100)
        if (!success) return
        setStorage('name', name)
        setStorage('token', token)
        toast.success('Logged in successfully!')
        router.replace('/dashboard')
    }

    return <>
        <Head><title>Login | CloudNotes</title></Head>
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className='space-y-2 text-center'>
                    <Logo />
                    <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
                    <p className="text-sm text-gray-600">
                        or <Link href='/account/signup'><span className="font-medium hover:text-black">Sign Up</span></Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input ref={email} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm" placeholder="Email address" />
                        <Password password={password} />
                    </div>

                    <Link href='/account/forgot' className='flex'><div className="cursor-pointer font-medium text-sm text-gray-600 hover:text-black">Forgot your password?</div></Link>

                    <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">Log in</button>
                </form>
            </div>
        </div>
    </>
}
