import React from 'react';
import FormGroup from '../FormGroup';

const DashboardSelector = ({ dashboards, selectedDashboard, onChange }) => (
  <FormGroup
    label="Selecteer Dashboard"
    id="dashboard"
    value={selectedDashboard}
    onChange={onChange}
    type="select"
    options={dashboards.map((dashboard) => ({
      label: dashboard.name,
      value: dashboard.name,
    }))}
    placeholder="Kies een dashboard uit de lijst."
  />
);

export default DashboardSelector;