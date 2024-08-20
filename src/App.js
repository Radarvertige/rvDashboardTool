import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FormGroup from './components/FormGroup';
import DashboardLinkList from './components/DashboardLinkList';
import { handleKeyPress } from './utils/keyboard';
import { generateTokens } from './utils/token';

const JWTGenerator = () => {
  const [groupNames, setGroupNames] = useState('');
  const [tokens, setTokens] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);

  useEffect(() => {
    // Attach the event listener for the keyboard shortcut
    window.addEventListener('keydown', handleKeyPress);

    // Fetch dashboards data
    fetch('/dashboards.json')
      .then((response) => response.json())
      .then((data) => setDashboards(data));

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="container mt-5">
      <Header />

      <h1>Dashboard link generator</h1>

      <FormGroup
        label="Groepsnamen (komma gescheiden)"
        smallText="Voer de namen van de groepen in, gescheiden door komma's."
        id="groupNames"
        value={groupNames}
        onChange={(e) => setGroupNames(e.target.value)}
        placeholder="Voer groepsnamen in"
      />

      <FormGroup
        label="Selecteer Dashboard"
        smallText="Kies een dashboard uit de lijst."
        id="dashboard"
        value={selectedDashboard}
        onChange={(e) => setSelectedDashboard(e.target.value)}
        type="select"
        options={dashboards.map(dashboard => ({ label: dashboard.name, value: dashboard.name }))}
      />

      <button className="btn btn-primary mt-3" onClick={() => generateTokens(groupNames, selectedDashboard, dashboards, setTokens, setCombinedUrls)}>
        Genereer link
      </button>

      {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
    </div>
  );
};

export default JWTGenerator;
