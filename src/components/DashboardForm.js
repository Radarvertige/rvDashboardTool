import React, { useState, useRef } from 'react';
import FormGroup from './FormGroup';
import DashboardLinkList from './DashboardLinkList';
import { generateUrls } from '../utils/urlGenerator';
import '../styles/DashboardForm.css';

const DashboardForm = ({ team, dashboards }) => {
  const [groupNames, setGroupNames] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const groupInputRef = useRef(null);

  const handleGenerateUrls = async () => {
    if (!selectedDashboard) {
      alert("Selecteer een dashboard");
      return;
    }

    const dashboard = dashboards.find(d => d.name === selectedDashboard);
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
        options={dashboards.map(dashboard => ({ label: dashboard.name, value: dashboard.name }))}
      />

      <button className="btn btn-primary mt-3" onClick={handleGenerateUrls}>
        Genereer link
      </button>

      <button className="btn btn-clear mt-3" onClick={clearForm}>
        Nieuw link maken
      </button>

      {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
    </>
  );
};

export default DashboardForm;
