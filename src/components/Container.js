import React from 'react'
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './Navbar';
import Alert from './Alert';
import Modal from './Modal';
// const Navbar = lazy(() => import('./Navbar'));
// const Alert = lazy(() => import('./Alert'));
// const Modal = lazy(() => import('./Modal'));

export default function Container() {
    const location = useLocation()

    return (
        location.pathname !== '/' ?
            <>
                <HelmetProvider>
                    <Helmet>
                        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/fontawesome.css" />
                        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/solid.css" />
                        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/regular.css" />
                        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/brands.css" />
                    </Helmet>
                </HelmetProvider>
                <Navbar />
                <Alert />
                <Modal />
            </> : <></>
    )
}
