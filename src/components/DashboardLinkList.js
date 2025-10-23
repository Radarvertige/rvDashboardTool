import React from 'react';
import '../styles/DashboardLinkList.css';

function DashboardLinkList({ combinedUrls }) {
  return (
    <div className="mt-4">
      <h2>Dashboard links:</h2>
      {combinedUrls.map(({ group, url }) => (
        <div key={group} className="mb-3">
          {group && <h4>Groep: {group}</h4>}
          <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
            {url}
          </a>
        </div>
      ))}
    </div>
  );
}

export default DashboardLinkList;
