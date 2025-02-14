import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FormGroup from './FormGroup';
import DashboardLinkList from './DashboardLinkList';
import TeamDashboardList from './TeamDashboardList';
import { generateUrls } from '../utils/urlGenerator';  // Import the updated function
import { Button } from 'react-bootstrap';
import UserManualModal from './UserManualModal';
import CopilotIframe from '../utils/CopilotIframe';
import { generateToken } from '../utils/token';

import '../styles/DashboardForm.css';

const DashboardForm = () => {
  const { team } = useParams();
  const [dashboards, setDashboards] = useState([]);
  const [filteredDashboards, setFilteredDashboards] = useState([]);
  const [groupNames, setGroupNames] = useState('');
  const [participants, setParticipants] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const groupInputRef = useRef(null);

  // Fetch dashboards.json file on component mount
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
      const filtered = dashboards
        .filter(dashboard => dashboard.team === team)
        .sort((a, b) => a.name.localeCompare(b.name));
      setFilteredDashboards(filtered);
    } else {
      const filtered = dashboards
        .filter(dashboard => dashboard.team)
        .sort((a, b) => a.name.localeCompare(b.name));
      setFilteredDashboards(filtered);
    }
  }, [team, dashboards]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'RESULT_DATA') {
        setParticipants(event.data.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

    const isNvwaDashboard = selectedDashboard.includes('NVWA');
    
    // Converteer participants naar een array, als het een string is
    const participantsArray = participants
      ? participants.split(',').map(name => name.trim())
      : [];

    const generatedUrls = await generateUrls(dashboard, groupNames, participantsArray, isNvwaDashboard);
    setCombinedUrls(generatedUrls);
  };

  const clearForm = () => {
    setGroupNames('');
    setParticipants('');
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
            label="Selecteer Dashboard"
            id="dashboard"
            value={selectedDashboard}
            onChange={(e) => setSelectedDashboard(e.target.value)}
            type="select"
            options={filteredDashboards.map(dashboard => ({ label: dashboard.name, value: dashboard.name }))}
            placeholder="Kies een dashboard uit de lijst."
          />

          {selectedDashboard.includes('NVWA') ? (
            <>
              <CopilotIframe />
              <FormGroup
                label="Vul hier de namen in"
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Voer de namen van de deelnemers in, gescheiden door komma's."
              />
            </>
          ) : (
            <FormGroup
              label="Groepsnaam (of namen)"
              id="groupNames"
              value={groupNames}
              onChange={(e) => setGroupNames(e.target.value)}
              placeholder="Voer de namen van de groepen in, gescheiden door komma's."
              inputRef={groupInputRef}
            />
          )}

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
