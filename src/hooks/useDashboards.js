import { useEffect, useState } from 'react';
import { filterDashboardsByTeam } from '../utils/dashboardData';

export const useDashboards = (team) => {
  const [dashboards, setDashboards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboards = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/dashboards.json`);

        if (!response.ok) {
          throw new Error('Kon dashboards niet laden.');
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setDashboards(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setDashboards([]);
        setError(loadError.message || 'Kon dashboards niet laden.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboards();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    dashboards,
    filteredDashboards: filterDashboardsByTeam(dashboards, team),
    isLoading,
    error,
  };
};