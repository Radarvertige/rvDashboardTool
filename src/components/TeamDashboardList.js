import React from 'react';
import { Link } from 'react-router-dom';

const TeamDashboardList = ({ dashboards = [] }) => { // Default to an empty array
  // Group dashboards by team and filter out empty or falsy team names
  const teams = dashboards.reduce((acc, dashboard) => {
    const teamName = dashboard.team && dashboard.team.trim(); // Ensure team name is not empty or just spaces
    if (teamName) {
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push(dashboard);
    }
    return acc;
  }, {});

  // Convert the object to an array and filter out any teams that still might be empty
  const nonEmptyTeams = Object.keys(teams).filter(team => teams[team].length > 0);

  return (
    <>
      <h2>Beschikbare teams:</h2>
      <ul>
        {nonEmptyTeams.map(team => (
          <li key={team}>
            <Link to={`/${team.replace(/\s+/g, '-')}`}>
              {team}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TeamDashboardList;
