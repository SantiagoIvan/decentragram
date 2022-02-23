import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import './index.css'
import { AppContextProvider } from './context/appContext'

import App from './App';
import Home from './App/screens/Home'
import Login from './App/screens/Login'

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
