import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// below code contains react-snap method which is a library that pre-renders an html page which is good for SEO and google bot now sees some content in our website.
// const rootElement = document.getElementById("root");

// if (rootElement.hasChildNodes()) {
//   ReactDOM.hydrate(
//     <React.StrictMode>
//       <ToggleState>
//         <App />
//       </ToggleState>
//     </React.StrictMode>, rootElement);
// } else {
//   ReactDOM.render(
//     <React.StrictMode>
//       <ToggleState>
//         <App />
//       </ToggleState>
//     </React.StrictMode>, rootElement);
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
