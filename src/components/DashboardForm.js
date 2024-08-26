import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FormGroup from './FormGroup';
import DashboardLinkList from './DashboardLinkList';
import TeamDashboardList from './TeamDashboardList';
import { generateUrls } from '../utils/urlGenerator';
import '../styles/DashboardForm.css';

const DashboardForm = () => {
  const { team } = useParams();
  const [dashboards, setDashboards] = useState([]);
  const [filteredDashboards, setFilteredDashboards] = useState([]);
  const [groupNames, setGroupNames] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const groupInputRef = useRef(null);

  // Fetch the dashboards.json file on component mount
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/dashboards.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDashboards(data);
      })
      .catch(error => {
        console.error('Error fetching dashboards.json:', error);
      });
  }, []);

  // Filter dashboards based on the team from the URL params
  useEffect(() => {
    if (team) {
      const filtered = dashboards.filter(dashboard => dashboard.team === team);
      setFilteredDashboards(filtered);
    } else {
      const filtered = dashboards.filter(dashboard => dashboard.team);
      setFilteredDashboards(filtered);
    }
  }, [team, dashboards]);

  const handleGenerateUrls = async () => {
    if (!selectedDashboard) {
      alert("Selecteer een dashboard");
      return;
    }

    const dashboard = filteredDashboards.find(d => d.name === selectedDashboard);
    if (!dashboard) {
      alert("Geselecteerd dashboard niet gevonden");
      return;
    }

    const generatedUrls = await generateUrls(dashboard, groupNames);
    setCombinedUrls(generatedUrls);
  };

  const clearForm = () => {
    setGroupNames('');
    setSelectedDashboard('');
    setCombinedUrls([]);
  };

  return (
    <div>
      <h1>Dashboard Link Generator</h1>
      {team ? (
        <>
          <FormGroup
            label="Groepsnamen (komma gescheiden)"
            smallText="Voer de namen van de groepen in, gescheiden door komma's."
            id="groupNames"
            value={groupNames}
            onChange={(e) => setGroupNames(e.target.value)}
            placeholder="Voer groepsnamen in"
            inputRef={groupInputRef}
          />

          <FormGroup
            label="Selecteer Dashboard"
            smallText="Kies een dashboard uit de lijst."
            id="dashboard"
            value={selectedDashboard}
            onChange={(e) => setSelectedDashboard(e.target.value)}
            type="select"
            options={filteredDashboards.map(dashboard => ({ label: dashboard.name, value: dashboard.name }))}
          />

          <button className="btn btn-primary mt-3" onClick={handleGenerateUrls}>
            Genereer link
          </button>

          <button className="btn btn-clear mt-3" onClick={clearForm}>
            Nieuw link maken
          </button>

          {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
        </>
      ) : (
        <TeamDashboardList dashboards={filteredDashboards} />
      )}
    </div>
  );
};

export default DashboardForm;
