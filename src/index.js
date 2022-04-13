import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// below code contains react-snap method which is a library that pre-renders an html page which is good for SEO and google bot now sees some content in our website.
const rootElement = document.getElementById("root");
if (!rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>, rootElement);
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>, rootElement);
}