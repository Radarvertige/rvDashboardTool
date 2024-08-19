import React, { useState, useEffect } from 'react';
import { SignJWT } from 'jose';

const JWTGenerator = () => {
  const [groupNames, setGroupNames] = useState('');
  const [tokens, setTokens] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);

  // Fetch dashboards from dashboards.json
  useEffect(() => {
    fetch('/dashboards.json')
      .then((response) => response.json())
      .then((data) => setDashboards(data));
  }, []);

  const generateTokens = async () => {
    if (!groupNames || !selectedDashboard) {
      alert("Voer minstens één groepsnaam in en selecteer een dashboard");
      return;
    }

    // Vind de geselecteerde dashboardgegevens
    const dashboard = dashboards.find(d => d.name === selectedDashboard);
    if (!dashboard) {
      alert("Geselecteerd dashboard niet gevonden");
      return;
    }

    // Converteer de geheime sleutel (dashboard key) naar Uint8Array
    const secretKey = new TextEncoder().encode(dashboard.key);
    
    // Log de geheime sleutel
    console.log("Secret Key:", dashboard.key);

    // Splits groupNames op komma en trim witruimte
    const groups = groupNames.split(',').map(name => name.trim());

    // Voorbereiden van arrays om tokens en URLs op te slaan
    const generatedTokens = [];
    const generatedUrls = [];

    for (let group of groups) {
      if (group) {
        // Maak de JWT payload
        const payload = {
          dataModelFilter: [
            {
              table: "Groups",
              column: "Name",
              datatype: "text",
              members: [group],
            },
          ],
        };

        // Maak de JWT header
        const header = { alg: 'HS256', typ: 'JWT' };

        // Genereer het token
        const token = await new SignJWT(payload)
          .setProtectedHeader(header)
          .sign(secretKey);

        // Log het token, header, payload (als string), en key
        console.log("Token:", token);
        console.log("Header:", header);
        console.log("Payload:", JSON.stringify(payload));
        console.log("Key:", dashboard.key);

        // Maak de gecombineerde URL
        const dashboardUrl = dashboard.url;
        const combinedUrl = `${dashboardUrl}${token}`;

        // Sla het token en de URL op
        generatedTokens.push({ group, token });
        generatedUrls.push({ group, url: combinedUrl });
      }
    }

    // Update de state met gegenereerde tokens en URLs
    setTokens(generatedTokens);
    setCombinedUrls(generatedUrls);
  };

  const copyToClipboard = (group, url) => {
    const textToCopy = `Groep: ${group}\nURL: ${url}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert(`URL en groepsnaam voor ${group} gekopieerd naar klembord!`);
    });
  };

  return (
    <div className="container mt-5">
      <h1>JWT Generator</h1>
      <div className="form-group">
        <label htmlFor="groupNames">Groepsnamen (komma gescheiden)</label>
        <small className="form-text text-muted">Voer de namen van de groepen in, gescheiden door komma's.</small>
        <input
          type="text"
          id="groupNames"
          className="form-control"
          value={groupNames}
          onChange={(e) => setGroupNames(e.target.value)}
          placeholder="Voer groepsnamen in"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dashboard">Selecteer Dashboard</label>
        <small className="form-text text-muted">Kies een dashboard uit de lijst.</small>
        <select
          id="dashboard"
          className="form-control"
          value={selectedDashboard}
          onChange={(e) => setSelectedDashboard(e.target.value)}
        >
          <option value="">-- Selecteer een Dashboard --</option>
          {dashboards.map((dashboard) => (
            <option key={dashboard.name} value={dashboard.name}>
              {dashboard.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mt-3" onClick={generateTokens}>
        Genereer JWTs
      </button>

      {combinedUrls.length > 0 && (
        <div className="mt-4">
          <h2>Gegenereerde URLs met JWTs:</h2>
          {combinedUrls.map(({ group, url }) => (
            <div key={group} className="mb-3">
              <h4>Groep: {group}</h4>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => copyToClipboard(group, url)}
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JWTGenerator;
