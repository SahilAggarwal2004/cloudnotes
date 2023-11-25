import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import AOS from "aos";
import Loading from './components/Loading';
import Container from './components/container/Container';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import "aos/dist/aos.css";

const Welcome = lazy(() => import('./components/Welcome')); // making components lazy
const Notes = lazy(() => import('./components/Notes'));
const About = lazy(() => import('./components/About'));
const Signup = lazy(() => import('./components/account/Signup'));
const Login = lazy(() => import('./components/account/Login'));
const Forgot = lazy(() => import('./components/account/Forgot'));
const Offline = lazy(() => import('./components/Offline'));
const Confirm = lazy(() => import('./components/account/Confirm'));
const NotFound = lazy(() => import('./components/NotFound'));


function App() {
	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, [])

	return <>
		<Container />
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route path='/' element={<Welcome />} />
				<Route path="/dashboard" element={<Notes />} />
				<Route path="/about" element={<About />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/account/login" element={<Login />} />
				<Route path="/forgot" element={<Forgot />} />
				<Route path="/offline" element={<Offline />} />
				<Route path="/account/confirm/:token" element={<Confirm />} />
				<Route path="/*" element={<NotFound />} />
			</Routes>
		</Suspense >
		<ToastContainer autoClose={2500} pauseOnFocusLoss={false} pauseOnHover={false} position='bottom-left' closeButton={false} />
	</>
}

export default App;
