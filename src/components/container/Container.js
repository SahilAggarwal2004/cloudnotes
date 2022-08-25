import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Alert from './Alert';
import Modal from './Modal';

export default function Container() {
    const location = useLocation()
    const hideNavbar = ['/account/confirm', '/account/delete']

    return location.pathname !== '/' && <>
        {!hideNavbar.includes(location.pathname) && <Navbar />}
        <Alert />
        <Modal />
    </>
}
