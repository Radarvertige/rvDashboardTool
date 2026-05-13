import React from 'react';
import FormGroup from '../FormGroup';

const DashboardInputFields = ({
  isLTIDashboard,
  groupNames,
  participants,
  onGroupNamesChange,
  onParticipantsChange,
}) => {
  if (isLTIDashboard) {
    return (
      <>
        <FormGroup
          label="Vul hier uitvoeringsdatum in"
          id="Uitvoeringsdatum"
          value={groupNames}
          onChange={onGroupNamesChange}
          placeholder="Bijvoorbeeld: 2026-03-28"
        />
        <FormGroup
          label="Vul hier de e-mailadressen in van de deelnemers"
          id="participants"
          value={participants}
          onChange={onParticipantsChange}
          placeholder="naam@domein.nl, tweede@domein.nl"
        />
      </>
    );
  }

  return (
    <FormGroup
      label="Groepsnaam (of namen)"
      id="groupNames"
      value={groupNames}
      onChange={onGroupNamesChange}
      placeholder="Voer de namen van de groepen in, gescheiden door komma's."
    />
  );
};

export default DashboardInputFields;