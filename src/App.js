import './App.css';
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NoteState from './context/notes/NoteState' // importing NoteState function
import ToggleState from './context/toggle/ToggleState'
import Loading from './components/Loading';
import Container from './components/container/Container';
import "aos/dist/aos.css";
import AOS from "aos";
import { SWRConfig } from 'swr';
import axios from 'axios';
import { getStorage } from './modules/storage';

const Welcome = lazy(() => import('./components/Welcome')); // making components lazy
const Notes = lazy(() => import('./components/Notes'));
const About = lazy(() => import('./components/About'));
const Signup = lazy(() => import('./components/account/Signup'));
const Login = lazy(() => import('./components/account/Login'));
const Forgot = lazy(() => import('./components/account/Forgot'));
const Offline = lazy(() => import('./components/Offline'));
const Confirm = lazy(() => import('./components/account/Confirm'));
const NotFound = lazy(() => import('./components/NotFound'));

const dimensions = window.screen.width + window.screen.height

function App() {
	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, [])

	return (
		<SWRConfig value={{
			fetcher: url => axios(url, { headers: { token: getStorage('token'), dimensions, 'Content-Type': 'application/json' } }).then(res => res.data),
			shouldRetryOnError: !Boolean(getStorage('notes')), errorRetryInterval: 0, errorRetryCount: 1, focusThrottleInterval: 15000
		}}>
			<Router>
				<ToggleState>
					{/* All the components stored inside NoteState tag are now props(as mentioned in NoteState.js) and now can access the NoteContext using useContext() */}
					<NoteState>
						{/* Keeping things below in suspense(only lazy components will go under suspense) and fallback component will show up until the required lazy components loads up */}
						<Container />
						<Suspense fallback={<Loading />}>
							<Routes>
								<Route path='/' element={<Welcome />} />
								<Route path="/dashboard" element={<Notes />} />
								<Route path="/about" element={<About />} />
								<Route path="/signup" element={<Signup />} />
								<Route path="/login" element={<Login />} />
								<Route path="/forgot" element={<Forgot />} />
								<Route path="/offline" element={<Offline />} />
								<Route path="/account/confirm/:token" element={<Confirm />} />
								<Route path="/*" element={<NotFound />} />
							</Routes>
						</Suspense >
					</NoteState>
				</ToggleState >
			</Router>
		</SWRConfig >
	);
}

export default App;
