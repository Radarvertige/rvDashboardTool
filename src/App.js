import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Header';
import FormGroup from './components/FormGroup';
import DashboardLinkList from './components/DashboardLinkList';
import { handleKeyPress } from './utils/keyboard';
import { generateToken } from './utils/token';
import { generateShortUrl } from './utils/url';

const JWTGenerator = () => {
  const { team } = useParams(); // Extract the team from the URL, if any
  const [groupNames, setGroupNames] = useState('');
  const [tokens, setTokens] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [filteredDashboards, setFilteredDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);

  useEffect(() => {
    // Attach the event listener for the keyboard shortcut
    window.addEventListener('keydown', handleKeyPress);

    // Fetch dashboards data
    fetch('/dashboards.json')
      .then((response) => response.json())
      .then((data) => {
        setDashboards(data);

        // Filter dashboards only if a team is specified in the URL
        if (team) {
          const teamDashboards = data.filter(dashboard => dashboard.team.replace(/\s+/g, '-').toLowerCase() === team.toLowerCase());
          setFilteredDashboards(teamDashboards);
        } else {
          setFilteredDashboards(data); // If no team is specified, show all dashboards
        }
      });

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [team]);

  const generateTokensAndUrls = async () => {
    if (!groupNames || !selectedDashboard) {
      alert("Voer minstens één groepsnaam in en selecteer een dashboard");
      return;
    }

    const dashboard = filteredDashboards.find(d => d.name === selectedDashboard);
    if (!dashboard) {
      alert("Geselecteerd dashboard niet gevonden");
      return;
    }

    const groups = groupNames.split(',').map(name => name.trim());
    const generatedTokens = [];
    const generatedUrls = [];
    let clipboardText = ''; // Variable to store the concatenated text

    for (let group of groups) {
      if (group) {
        const token = await generateToken(group, dashboard);
        const finalUrl = await generateShortUrl(token, dashboard, group);

        if (finalUrl) {
          generatedTokens.push({ group, token });
          generatedUrls.push({ group, url: finalUrl, team: dashboard.team });

          clipboardText += `Groep: ${group}\nURL: ${finalUrl}\n\n`;
        }
      }
    }

    setTokens(generatedTokens);
    setCombinedUrls(generatedUrls);

    // Copy the concatenated URLs and names to the clipboard
    navigator.clipboard.writeText(clipboardText).then(() => {
      alert("Links zijn gekopieerd!");
    });
  };

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
        options={filteredDashboards.map(dashboard => ({ label: dashboard.name, value: dashboard.name }))}
      />

      <button className="btn btn-primary mt-3" onClick={generateTokensAndUrls}>
        Genereer link
      </button>

      {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
    </div>
  );
};

export default JWTGenerator;
