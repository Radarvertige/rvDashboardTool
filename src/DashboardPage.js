import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Header';
import DashboardForm from './components/DashboardForm';
import TeamDashboardList from './components/TeamDashboardList';
import { useDashboards } from './hooks/useDashboards';
import { handleKeyPress } from './utils/keyboard';

const DashboardPage = () => {
  const { team } = useParams();
  const { filteredDashboards, isLoading, error } = useDashboards(team);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="container mt-5">
      <Header team={team} />

      {isLoading && <p>Dashboards worden geladen...</p>}
      {!isLoading && error && <p className="text-danger">{error}</p>}
      {!isLoading && !error && (team ? (
        <DashboardForm dashboards={filteredDashboards} />
      ) : (
        <TeamDashboardList dashboards={filteredDashboards} />
      ))}
    </div>
  );
};

export default DashboardPage;