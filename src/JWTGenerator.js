import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Header';
import DashboardForm from './components/DashboardForm';
import TeamDashboardList from './components/TeamDashboardList';
import { handleKeyPress } from './utils/keyboard';

const JWTGenerator = () => {
  const { team } = useParams();
  const [dashboards, setDashboards] = useState([]);
  const [filteredDashboards, setFilteredDashboards] = useState([]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    fetch('/dashboards.json')
      .then((response) => response.json())
      .then((data) => {
        setDashboards(data || []); // Ensure that dashboards is an array
        if (team) {
          const teamDashboards = data.filter(dashboard => dashboard.team.replace(/\s+/g, '-').toLowerCase() === team.toLowerCase());
          setFilteredDashboards(teamDashboards);
        } else {
          setFilteredDashboards([]);
        }
      });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [team]);

  return (
    <div className="container mt-5">
      <Header team={team} />

      {team ? (
        <DashboardForm
          team={team}
          dashboards={filteredDashboards}
        />
      ) : (
        <TeamDashboardList dashboards={dashboards} />
      )}
    </div>
  );
};

export default JWTGenerator;
