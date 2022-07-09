import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import registersw from './registersw';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);

registersw();

// below code contains react-snap method which is a library that pre-renders an html page which is good for SEO and google bot now sees some content in our website. Outdated-code (react-17)
// const rootElement = document.getElementById("root");
// if (!rootElement.hasChildNodes()) {
//   ReactDOM.hydrate(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>, rootElement);
// } else {
//   ReactDOM.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>, rootElement);
// }