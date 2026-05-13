import React, { useState } from 'react';
import DashboardLinkList from './DashboardLinkList';
import { generateUrls } from '../utils/urlGenerator';
import UserManualModal from './UserManualModal';
import { parseCommaSeparatedValues, parseParticipantEmails } from '../utils/validation';
import DashboardSelector from './dashboard-form/DashboardSelector';
import DashboardInputFields from './dashboard-form/DashboardInputFields';
import DashboardStatus from './dashboard-form/DashboardStatus';
import DashboardActions from './dashboard-form/DashboardActions';

import '../styles/DashboardForm.css';

const DashboardForm = ({ dashboards = [] }) => {
  const [groupNames, setGroupNames] = useState('');
  const [participants, setParticipants] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [combinedUrls, setCombinedUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const selectedDashboardConfig = dashboards.find((dashboard) => dashboard.name === selectedDashboard);

  const handleGenerateUrls = async () => {
    setStatus({ type: '', message: '' });

    if (!selectedDashboard) {
      setStatus({ type: 'error', message: 'Selecteer een dashboard.' });
      return;
    }

    if (!selectedDashboardConfig) {
      setStatus({ type: 'error', message: 'Geselecteerd dashboard niet gevonden.' });
      return;
    }

    try {
      setIsGenerating(true);

      const groups = parseCommaSeparatedValues(groupNames);
      const participantEmails = selectedDashboardConfig.LTI
        ? parseParticipantEmails(participants)
        : [];

      if (!selectedDashboardConfig.LTI && groups.length === 0) {
        setStatus({ type: 'error', message: 'Voer minimaal één groepsnaam in.' });
        return;
      }

      if (selectedDashboardConfig.LTI && groups.length === 0) {
        setStatus({ type: 'error', message: 'Voer een uitvoeringsdatum of label in.' });
        return;
      }

      const result = await generateUrls({
        dashboard: selectedDashboardConfig,
        groups,
        participants: participantEmails,
        isLTIDashboard: selectedDashboardConfig.LTI,
      });

      setCombinedUrls(result.generatedUrls);

      if (!result.generatedUrls.length) {
        setStatus({ type: 'error', message: result.error || 'Er konden geen links worden gegenereerd.' });
        return;
      }

      if (result.clipboardText) {
        try {
          await navigator.clipboard.writeText(result.clipboardText);
          setStatus({ type: 'success', message: 'Links zijn gegenereerd en gekopieerd.' });
        } catch {
          setStatus({
            type: 'warning',
            message: 'Links zijn gegenereerd, maar konden niet automatisch worden gekopieerd.',
          });
        }
      }

      if (result.error) {
        setStatus({ type: 'warning', message: result.error });
      }
    } catch (error) {
      setCombinedUrls([]);
      setStatus({ type: 'error', message: error.message || 'Er ging iets mis tijdens het genereren.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    setGroupNames('');
    setParticipants('');
    setSelectedDashboard('');
    setCombinedUrls([]);
    setStatus({ type: '', message: '' });
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      {!dashboards.length && <p>Geen dashboards beschikbaar voor dit team.</p>}

      {dashboards.length > 0 && (
        <>
          <DashboardSelector
            dashboards={dashboards}
            selectedDashboard={selectedDashboard}
            onChange={(event) => setSelectedDashboard(event.target.value)}
          />

          <DashboardInputFields
            isLTIDashboard={selectedDashboardConfig?.LTI}
            groupNames={groupNames}
            participants={participants}
            onGroupNamesChange={(event) => setGroupNames(event.target.value)}
            onParticipantsChange={(event) => setParticipants(event.target.value)}
          />

          <DashboardStatus status={status} />

          <DashboardActions
            isGenerating={isGenerating}
            onGenerate={handleGenerateUrls}
            onClear={clearForm}
            onShowManual={handleShowModal}
          />

          {combinedUrls.length > 0 && <DashboardLinkList combinedUrls={combinedUrls} />}
        </>
      )}

      <UserManualModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default DashboardForm;
