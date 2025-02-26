import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import JWTGenerator from './JWTGenerator';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';
import { LTIProvider } from './context/LTIContext';  // Import the context provider

const container = document.getElementById('root');
const root = createRoot(container);

const UppercaseTeam = ({ children }) => {
  const { team } = useParams();

  if (team && team !== team.toUpperCase()) {
    const uppercaseTeam = team.toUpperCase();
    return <Navigate to={`/${uppercaseTeam}`} />;
  }

  return children;
};

root.render(
  <React.StrictMode>
    <LTIProvider>
      <Router basename="/">
        <Routes>
          <Route 
            path="/:team" 
            element={
              <UppercaseTeam>
                <JWTGenerator />
              </UppercaseTeam>
            } 
          />
          <Route path="/" element={<JWTGenerator />} />
        </Routes>
      </Router>
    </LTIProvider>
  </React.StrictMode>
);

reportWebVitals();
