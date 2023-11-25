import Head from "next/head";

export default function Offline() {
    return <>
        <Head><title>You are Offline!</title></Head>
        <div className="w-screen h-screen flex justify-center items-center bg-purple-700 inset-0 fixed z-20">
            <div className='text-white text-center px-4 font-sans space-y-2'>
                <h1 className='text-3xl'>Offline...</h1>
                <p>The current page isn&#39;t available offline. Please try again when you&#39;re back online.</p>
            </div>
        </div>
    </>
}