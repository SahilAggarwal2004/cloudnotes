import { useEffect, lazy, Suspense, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import AOS from "aos";
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loading from './components/Loading';
import Container from './components/container/Container';
import { resetStorage } from './modules/storage';
import NoteContext from './context/notes/NoteContext';
import ToggleContext from './context/toggle/ToggleContext';
import './App.css';
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
	const { setNotes } = useContext(NoteContext)
	const { showAlert, setSpinner, setLoadbar } = useContext(ToggleContext)
	const redirect = useNavigate()

	const client = new QueryClient({
		defaultOptions: { queries: { staleTime: 15000, retry: 1 } },
		queryCache: new QueryCache({
			onError: (error) => {
				const json = error.response?.data;
				if (json?.error?.toLowerCase().includes('session expired')) {
					showAlert(json.error, '')
					setLoadbar([0, false])
					setNotes([])
					resetStorage();
					redirect('/login')
				} else {
					setLoadbar([1, true])
					setTimeout(() => {
						setLoadbar([0, false])
						setSpinner(false)
					}, 300);
				}
			}
		})
	})

	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, [])

	return <QueryClientProvider client={client}>
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
	</QueryClientProvider>
}

export default App;
