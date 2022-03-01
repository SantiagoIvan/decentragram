import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import './index.css'
import { AppContextProvider } from './context/appContext'
import { ModalContextProvider } from './context/modalContext'

import App from './App';
import Home from './App/screens/Home'
import Login from './App/screens/Login'
import NotFound from './App/screens/NotFound'

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <ModalContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ModalContextProvider>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
