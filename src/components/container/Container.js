import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Modal from './Modal';

export default function Container() {
    const location = useLocation()

    return location.pathname !== '/' && <>
        <Navbar />
        <Modal />
    </>
}
