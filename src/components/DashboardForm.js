import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FormGroup from './FormGroup';
import DashboardLinkList from './DashboardLinkList';
import TeamDashboardList from './TeamDashboardList';
import { generateUrls } from '../utils/urlGenerator';
import { Button, Modal } from 'react-bootstrap';
import UserManualModal from './UserManualModal';  // Import the modal component

import '../styles/DashboardForm.css';

const DashboardForm = () => {
  const { team } = useParams();
  const [dashboards, setDashboards] = useState([]);
  const [filteredDashboards, setFilteredDashboards] = useState([]);
  const [groupNames, setGroupNames] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);  // State to control the modal visibility
  const groupInputRef = useRef(null);

  // Fetch the dashboards.json file using a Netlify function
  useEffect(() => {
    fetch('/.netlify/functions/getDashboards')
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
        console.error('Error fetching dashboards:', error);
      });
  }, []);

  // Filter and sort dashboards based on the team from the URL params
  useEffect(() => {
    if (team) {
      const filtered = dashboards
        .filter(dashboard => dashboard.team === team)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
      setFilteredDashboards(filtered);
    } else {
      const filtered = dashboards
        .filter(dashboard => dashboard.team)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      {team ? (
        <>
          <FormGroup
            label="Groepsnaam (of namen)"
            id="groupNames"
            value={groupNames}
            onChange={(e) => setGroupNames(e.target.value)}
            placeholder="Voer de namen van de groepen in, gescheiden door komma's."
            inputRef={groupInputRef}
          />

          <FormGroup
            label="Selecteer Dashboard"
            smallText=""
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
          <Button variant="link" onClick={handleShowModal} style={{ float: 'right', fontSize: '1.5rem', marginRight: '10px' }}>
            ?
          </Button>

          {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
        </>
      ) : (
        <TeamDashboardList dashboards={filteredDashboards} />
      )}

      <UserManualModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default DashboardForm;