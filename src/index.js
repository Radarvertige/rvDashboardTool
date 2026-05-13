import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';
import { normalizeTeamSlug } from './utils/dashboardData';

const container = document.getElementById('root');
const root = createRoot(container);

const UppercaseTeam = ({ children }) => {
  const { team } = useParams();

  if (team) {
    const normalizedTeam = normalizeTeamSlug(team);

    if (team !== normalizedTeam) {
      return <Navigate to={`/${normalizedTeam}`} replace />;
    }
  }

  return children;
};

root.render(
  <React.StrictMode>
    <Router basename="/">
      <Routes>
        <Route
          path="/:team"
          element={
            <UppercaseTeam>
              <DashboardPage />
            </UppercaseTeam>
          }
        />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
