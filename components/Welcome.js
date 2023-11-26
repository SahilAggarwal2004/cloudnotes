/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../components/Logo';

export default function Welcome() {
    return <>
        <Head><title>CloudNotes - Notes on Cloud</title></Head>
        <div className='flex container fixed inset-0 normal:text-white normal:text-opacity-90 justify-center min-w-full'>
            <div className="container col-span-3 flex flex-col justify-evenly items-center min-w-[30vw] h-full normal:bg-purple-600">
                <div className='flex flex-col items-center'>
                    <Logo type='white' width={64} height={64} />
                    <Logo type='black' width={64} height={64} />
                    <h1 className='text-xl font-bold normal:font-semibold'>CloudNotes - Notes on Cloud</h1>
                </div>
                <div className='px-7 text-justify'>CloudNotes is an online platform to save all your notes at one place on the cloud and access them anywhere anytime. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.</div>
                <div className='flex flex-col space-y-3'>
                    <div className='welcome-btn-container'>
                        <Link className="welcome-btn" href="/account/signup"><strong>Create a new account</strong> ➤</Link>
                    </div>
                    <div className='welcome-btn-container'>
                        <Link className="welcome-btn" href="/account/login"><strong>Login to your account</strong> ➤</Link>
                    </div>
                    <div className='welcome-btn-container'>
                        <Link className="welcome-btn" href="/about"><strong>Know More</strong> ➤</Link>
                    </div>
                </div>
            </div>
            <img src='/images/bg.webp' alt="CloudNotes" className='fixed normal:static h-full object-cover w-full -z-10 normal:z-0 normal:min-w-[70vw]' />
        </div >
    </>
}