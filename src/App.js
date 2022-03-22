import './App.css';
import './index.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Modal from './components/Modal';
import Welcome from './components/Welcome';
import Notes from './components/Notes';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
import Forgot from './components/Forgot';
import NoteState from './context/notes/NoteState'; // importing NoteState function
import Account from './components/Account';
import "aos/dist/aos.css";
import AOS from "aos";

function App() {
	useEffect(() => {
		AOS.init({ once: true, offset: 20 });
		AOS.refresh();
	}, [])


	return (
		// All the components stored inside NoteState tag are now props(as mentioned in NoteState.js) and now can access the NoteContext using useContext()
		<NoteState>
			<Router>
				<Navbar />
				<Alert />
				<Modal />
				<Routes>
					<Route path='/' element={<Welcome />} />
					<Route path="/dashboard" element={<Notes />} />
					<Route path="/about" element={<About />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route path="/account/:type/:token" element={<Account />} />
				</Routes>
			</Router>
		</NoteState>
	);
}

export default App;
