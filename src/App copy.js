import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

function App() {
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [combinedUrl, setCombinedUrl] = useState("");

  useEffect(() => {
    fetch("/dashboards.json")
      .then(response => response.json())
      .then(data => setDashboards(data));
  }, []);

  const generateJWT = (dashboardKey, groupName) => {
    const header = { alg: "HS256", typ: "JWT" };

    // Aangepaste payload met 'dataModelFilter'
    const payload = 
      {"dataModelFilter": [{
        "table": "Groups",
        "column": "Name",
        "datatype": "text",
        "members": [groupName]
        }]
    };

    const secret = dashboardKey; // Gebruik een veilige manier om de secret op te slaan

    const base64UrlEncode = (obj) => {
      return btoa(JSON.stringify(obj))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const encodedSecret = base64UrlEncode(secret);
console.log(header);
console.log(payload);
console.log(secret)
    console.log(`${encodedHeader}.${encodedPayload}.${encodedSecret}`)
    return `${encodedHeader}.${encodedPayload}.${encodedSecret}`;
  };

  const combineUrlWithGroup = () => {
    console.log(selectedDashboard.key, groupName)
    if (selectedDashboard && groupName) {
    
      const jwtToken = generateJWT(selectedDashboard.key, groupName); // JWT genereren met aangepaste payload
      console.log(jwtToken)
      // Voeg de token zonder querystring toe aan de URL
      const finalUrl = `${selectedDashboard.url}/${jwtToken}`;
      setCombinedUrl(finalUrl);
    } else {
      alert("Selecteer een dashboard en voer de groepsnaam in!");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(combinedUrl).then(() => {
      alert("URL gekopieerd naar het klembord!");
    });
  };

  return (
    <div className="App container mt-5">
      <header className="App-header text-center">
        <h1>JWT URL Combiner</h1>
        <div className="form-group mt-4">
          <label className="form-label">Selecteer Dashboard:</label>
          <Select
            options={dashboards.map(dashboard => ({
              value: dashboard.key,
              label: dashboard.name
            }))}
            onChange={(selectedOption) => {
              const selected = dashboards.find(d => d.key === selectedOption.value);
              setSelectedDashboard(selected);
            }}
            classNamePrefix="react-select"
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Groepsnaam:</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Voer de groepsnaam in"
          />
        </div>
        <button 
          className="btn btn-primary mt-4"
          onClick={combineUrlWithGroup}
        >
          Combineer URL met Groep
        </button>
        {combinedUrl && (
          <div className="mt-4">
            <h2>Gecombineerde URL:</h2>
            <div className="alert alert-success d-flex align-items-center justify-content-between">
              <a 
                href={combinedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white"
              >
                {combinedUrl}
              </a>
              <button 
                className="btn btn-outline-light btn-sm ml-2" 
                onClick={copyToClipboard}
              >
                Kopieer
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
