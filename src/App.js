import React, { useState, useEffect } from 'react';
import { SignJWT } from 'jose';

const YOURLS_API_URL = 'http://rdar.nl/yourls-api.php'; // Vervang dit door je YOURLS API URL
const YOURLS_SIGNATURE = '157448975e'; // Vervang dit door je YOURLS signature token

const JWTGenerator = () => {
  const [groupNames, setGroupNames] = useState('');
  const [tokens, setTokens] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);

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

    const dashboard = dashboards.find(d => d.name === selectedDashboard);
    if (!dashboard) {
      alert("Geselecteerd dashboard niet gevonden");
      return;
    }

    const secretKey = new TextEncoder().encode(dashboard.key);
    console.log("Secret Key:", dashboard.key);

    const groups = groupNames.split(',').map(name => name.trim());
    const generatedTokens = [];
    const generatedUrls = [];

    for (let group of groups) {
      if (group) {
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

        const header = { alg: 'HS256', typ: 'JWT' };
        const token = await new SignJWT(payload)
          .setProtectedHeader(header)
          .sign(secretKey);

        console.log("Token:", token);
        console.log("Header:", header);
        console.log("Payload:", JSON.stringify(payload));
        console.log("Key:", dashboard.key);

        const dashboardUrl = dashboard.url;
        const combinedUrl = `${dashboardUrl}${token}`;

        try {
          const response = await fetch(`${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(combinedUrl)}`);
          const data = await response.json();
          const shortUrl = data.shorturl;

          generatedTokens.push({ group, token });
          generatedUrls.push({ group, url: shortUrl });

          console.log(`Short URL for ${group}: ${shortUrl}`);
        } catch (error) {
          console.error(`Error shortening URL for ${group}:`, error);
        }
      }
    }

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
