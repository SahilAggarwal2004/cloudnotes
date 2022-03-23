import './App.css';
import './index.css';
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Notes from './components/Notes';
import NoteState from './context/notes/NoteState'; // importing NoteState function
import "aos/dist/aos.css";
import AOS from "aos";

const Navbar = lazy(() => import('./components/Navbar'));
const Alert = lazy(() => import('./components/Alert'));
const Modal = lazy(() => import('./components/Modal'));
const Welcome = lazy(() => import('./components/Welcome'));
const About = lazy(() => import('./components/About'));
const Signup = lazy(() => import('./components/Signup'));
const Login = lazy(() => import('./components/Login'));
const Forgot = lazy(() => import('./components/Forgot'));
const Account = lazy(() => import('./components/Account'));

function App() {
	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, [])


	return (
		// All the components stored inside NoteState tag are now props(as mentioned in NoteState.js) and now can access the NoteContext using useContext()
		<NoteState>
			<Router>
				<Suspense fallback={<></>}>
					<Navbar />
					<Alert />
					<Modal />
				</Suspense>
				<Suspense fallback={<div className='fixed top-0 w-full h-full flex flex-col space-y-2 items-center justify-center'>
					<div className='w-[1.375rem] h-[1.375rem] border-2 border-transparent border-t-black border-b-black rounded-[50%] animate-spin-fast' />
					<p>Loading CloudNotes...</p>
				</div>}>
					<Routes>
						<Route path='/' element={<Welcome />} />
						<Route path="/dashboard" element={<Notes />} />
						<Route path="/about" element={<About />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route path="/forgot" element={<Forgot />} />
						<Route path="/account/:type/:token" element={<Account />} />
					</Routes>
				</Suspense>
			</Router>
		</NoteState>
	);
}

export default App;
