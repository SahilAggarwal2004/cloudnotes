import './App.css';
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NoteState from './context/notes/NoteState' // importing NoteState function
import ToggleState from './context/toggle/ToggleState'
import Loading from './components/Loading';
// import Welcome from './components/Welcome';
import "aos/dist/aos.css";
import AOS from "aos";


// const NoteState = lazy(() => import('./context/notes/NoteState')); // importing NoteState function
// const ToggleState = lazy(() => import('./context/toggle/ToggleState'));
const Container = lazy(() => import('./components/Container')); // making components lazy
const Welcome = lazy(() => import('./components/Welcome'));
const Notes = lazy(() => import('./components/Notes'));
const About = lazy(() => import('./components/About'));
const Signup = lazy(() => import('./components/Signup'));
const Login = lazy(() => import('./components/Login'));
const Forgot = lazy(() => import('./components/Forgot'));
const Account = lazy(() => import('./components/Account'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, [])

	return (
		// Keeping things below in suspense(only lazy components will go under suspense) and fallback component will show up until the required lazy components loads up
		<ToggleState>
			{/* All the components stored inside NoteState tag are now props(as mentioned in NoteState.js) and now can access the NoteContext using useContext() */}
			<NoteState>
				<Router>
					<Suspense fallback={<></>}>
						<Container />
					</Suspense>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route path='/' element={<Welcome />} />
							<Route path="/dashboard" element={<Notes />} />
							<Route path="/about" element={<About />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/login" element={<Login />} />
							<Route path="/forgot" element={<Forgot />} />
							<Route path="/account/:type/:token" element={<Account />} />
							<Route path="/*" element={<NotFound />} />
						</Routes>
					</Suspense >
				</Router>
			</NoteState>
		</ToggleState>
	);
}

export default App;
