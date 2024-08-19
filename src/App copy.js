import React, { useState } from 'react';
import { SignJWT } from 'jose';

const JWTGenerator = () => {
  const [groupName, setGroupName] = useState('');
  const [token, setToken] = useState('');

  const secretKey = new TextEncoder().encode('c3172a47-3122-4a7b-8ccd-fbe61771564a'); // Convert the secret to Uint8Array

  const generateToken = async () => {
    if (!groupName) {
      alert("Please enter a group name");
      return;
    }

    const payload = {
      dataModelFilter: [
        {
          table: "Groups",
          column: "Name",
          datatype: "text",
          members: [groupName],
        },
      ],
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(secretKey);

    setToken(token);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token).then(() => {
      alert("Token copied to clipboard!");
    });
  };

  return (
    <div className="container mt-5">
      <h1>JWT Generator</h1>
      <div className="form-group">
        <label htmlFor="groupName">Group Name</label>
        <input
          type="text"
          id="groupName"
          className="form-control"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={generateToken}>
        Generate JWT
      </button>
      {token && (
        <div className="mt-4">
          <h2>Generated JWT:</h2>
          <textarea
            className="form-control"
            rows="5"
            value={token}
            readOnly
          ></textarea>
          <button className="btn btn-success mt-3" onClick={copyToClipboard}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default JWTGenerator;
