import React from 'react';
import { render } from "react-dom";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import LinkGenerator from './components/LinkGenerator'
import Game from './components/Game';

render(
  <BrowserRouter>
  <React.StrictMode>
  <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true} />
          <Routes>
      <Route path="/" element={<App />} />
      <Route path="generate" element={<LinkGenerator />} />
      <Route path="games/:link" element={<Game />} />

    </Routes>
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
