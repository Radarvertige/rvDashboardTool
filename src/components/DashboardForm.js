import React, { useState, useRef } from 'react';
import FormGroup from './FormGroup';
import DashboardLinkList from './DashboardLinkList';
import { generateToken } from '../utils/token';
import { generateShortUrl } from '../utils/url';
import '../styles/DashboardForm.css';

const DashboardForm = ({ team, dashboards }) => {
  const [groupNames, setGroupNames] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const groupInputRef = useRef(null);

  const generateTokensAndUrls = async () => {
    if (!selectedDashboard) {
      alert("Selecteer een dashboard");
      return;
    }

    let groups = [];
    if (!groupNames) {
      const confirmNoGroup = window.confirm("Geen groep(en)? Weet je het zeker?");
      if (!confirmNoGroup) {
        groupInputRef.current.focus(); // Focus on the group input field
        return;
      }
    } else {
      groups = groupNames.split(',').map(name => name.trim());
    }

    const dashboard = dashboards.find(d => d.name === selectedDashboard);
    if (!dashboard) {
      alert("Geselecteerd dashboard niet gevonden");
      return;
    }

    const generatedUrls = [];
    let clipboardText = '';

    // Generate the token and URL for each group, or just once if no groups
    if (groups.length === 0) {
      const token = await generateToken('', dashboard); // Generate without group
      const finalUrl = await generateShortUrl(token, dashboard, '');
      if (finalUrl) {
        generatedUrls.push({ group: '', url: finalUrl, team: dashboard.team });
        clipboardText += `URL: ${finalUrl}\n\n`;
      }
    } else {
      for (let group of groups) {
        if (group) {
          const token = await generateToken(group, dashboard);
          const finalUrl = await generateShortUrl(token, dashboard, group);

          if (finalUrl) {
            generatedUrls.push({ group, url: finalUrl, team: dashboard.team });
            clipboardText += `Groep: ${group}\nURL: ${finalUrl}\n\n`;
          }
        }
      }
    }

    setCombinedUrls(generatedUrls);

    navigator.clipboard.writeText(clipboardText).then(() => {
      alert("Links zijn gekopieerd!");
    });
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

      <button className="btn btn-primary mt-3" onClick={generateTokensAndUrls}>
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
