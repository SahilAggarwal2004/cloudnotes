import Navbar from './Navbar';
import Modal from './Modal';

export default function Container({ router }) {
    return router.pathname !== '/' && <>
        <Navbar router={router} />
        <Modal />
    </>
}
