export default function Loading({ text }) {
    return <div className='fixed top-0 w-full h-full flex flex-col space-y-2 items-center justify-center'>
        <div className='w-[1.375rem] h-[1.375rem] border-2 border-transparent border-t-black border-b-black rounded-[50%] animate-spin-fast' />
        {text && <p>{text}</p>}
    </div>
}
