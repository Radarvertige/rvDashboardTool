import React, { useState, useEffect } from 'react';
import { SignJWT } from 'jose';
import headerImage from './assets/rvlogo.png';

// Retrieve YOURLS API URL and Signature from environment variables
const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php'; // Vervang dit door je YOURLS API URL
const YOURLS_SIGNATURE = '157448975e';


let isDebug = false;

const handleKeyPress = (event) => {
  if (event.ctrlKey && event.key === 'b') {
    isDebug = !isDebug;
    console.log(`Debugging is now ${isDebug ? 'enabled' : 'disabled'}`);
  }
};

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

  const generateTokens = async () => {
    if (isDebug) console.log("Starting token generation");

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
    if (isDebug) console.log("Secret Key:", dashboard.key);

    const groups = groupNames.split(',').map(name => name.trim());
    const generatedTokens = [];
    const generatedUrls = [];
    let clipboardText = ''; // Variable to store the concatenated text

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

        if (isDebug) console.log("Token:", token);
        if (isDebug) console.log("Header:", header);
        if (isDebug) console.log("Payload:", JSON.stringify(payload));
        if (isDebug) console.log("Key:", dashboard.key);

        const dashboardUrl = dashboard.url;
        const combinedUrl = `${dashboardUrl}${token}`;

        try {
          const response = await fetch(`${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(combinedUrl)}`);
          const data = await response.json();
          const shortUrl = data.shorturl;

          generatedTokens.push({ group, token });
          generatedUrls.push({ group, url: shortUrl });

          if (isDebug) console.log(`Short URL for ${group}: ${shortUrl}`);

          // Add each URL and group name to the clipboardText
          clipboardText += `Groep: ${group}\nURL: ${shortUrl}\n\n`;
        } catch (error) {
          console.error(`Error shortening URL for ${group}:`, error);
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
      {/* Header Image */}
      <img src={headerImage} alt="Header" className="img-fluid mb-4" />

      <h1>Dashboard link generator</h1>
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
        Genereer link
      </button>

      {combinedUrls.length > 0 && (
        <div className="mt-4">
          <h2>Gegenereerde dashboard link:</h2>
          {combinedUrls.map(({ group, url }) => (
            <div key={group} className="mb-3">
              <h4>Groep: {group}</h4>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
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
