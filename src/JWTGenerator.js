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

    fetch(`${process.env.PUBLIC_URL}/dashboards.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setDashboards(data || []); // Ensure that dashboards is an array
        if (team) {
          const teamDashboards = data.filter(dashboard =>
            dashboard.team.replace(/\s+/g, '-').toLowerCase() === team.toLowerCase()
          );
          setFilteredDashboards(teamDashboards);
        } else {
          setFilteredDashboards(data.filter(dashboard => dashboard.team)); // Show all dashboards with a team if no specific team is selected
        }
      })
      .catch(error => {
        console.error('Error fetching dashboards.json:', error);
        setDashboards([]);
        setFilteredDashboards([]);
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
        <TeamDashboardList dashboards={filteredDashboards} />
      )}
    </div>
  );
};

export default JWTGenerator;
