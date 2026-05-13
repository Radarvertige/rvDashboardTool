import React from 'react';

const DashboardStatus = ({ status }) => {
  if (!status?.message) {
    return null;
  }

  return (
    <p className={`form-status ${status.type ? `form-status-${status.type}` : ''}`}>
      {status.message}
    </p>
  );
};

export default DashboardStatus;