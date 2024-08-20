import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JWTGenerator from './JWTGenerator'; // Import the new main component
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<JWTGenerator />} />
        <Route path="/:team" element={<JWTGenerator />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
