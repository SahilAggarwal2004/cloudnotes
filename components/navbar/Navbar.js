import Link from 'next/link'
import { FaRegUser, FaBars } from 'react-icons/fa'
import LoadingBar from "react-top-loading-bar"
import Expandable from './Expandable'
import NavLink from './NavLink'
import { useToggleContext } from '../../contexts/ToggleProvider'

export default function Navbar({ name }) {
    const { setModal, hide, setHide, progress, setProgress } = useToggleContext()
    const extendNav = () => setHide(!hide)

    return <nav className='sticky inset-0 z-20'>
        <div className='flex bg-purple-700 text-white sm:justify-between items-center py-2 px-4 flex-col sm:flex-row overflow-hidden'>
            <div className={`flex items-center justify-between w-full sm:justify-start ${name && 'sm:space-x-5'}`}>
                <FaRegUser className={`cursor-pointer scale-125 font-extrabold transition-all ${!name && 'fixed invisible'}`} onClick={() => setModal({ active: true, type: 'user', name })} />
                <Link href='/'><h2 className='text-xl text-center font-semibold'>CloudNotes</h2></Link>
                <FaBars className="sm:invisible scale-125" onClick={extendNav} />
            </div>
            <Expandable expand={!hide}>
                <div className='mt-3 space-y-0.5 sm:m-0 sm:space-y-0 sm:space-x-4 sm:flex'>
                    {name ? <NavLink href='/' text='Dashboard' onClick={extendNav} /> : <>
                        <NavLink href='/account/signup' text='Signup' onClick={extendNav} />
                        <NavLink href='/account/login' text='Login' onClick={extendNav} />
                    </>}
                    <NavLink href='/about' text='About' onClick={extendNav} />
                </div>
            </Expandable>
        </div>
        <LoadingBar color='#dc2626' containerStyle={{ position: 'relative' }} shadow={false} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
    </nav>
}
