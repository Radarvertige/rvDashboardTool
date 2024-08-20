import React from 'react';

function DashboardLinkList({ combinedUrls }) {
  return (
    <div className="mt-4">
      <h2>Gegenereerde dashboard link:</h2>
      {combinedUrls.map(({ group, url, team }) => (
        <div key={group} className="mb-3">
          <h4>Groep: {group} | Team: {team}</h4>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      ))}
    </div>
  );
}

export default DashboardLinkList;
