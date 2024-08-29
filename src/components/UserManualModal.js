import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const UserManualModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title>Gebruikershandleiding</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Inleiding</h4>
        <p>
          Welkom bij de Dashboard Link Generator! Deze tool is speciaal ontwikkeld voor het genereren van korte en unieke URL's voor de dashboards. Hiermee kun je snel en gemakkelijk toegang krijgen tot de dashboards die je nodig hebt.
        </p>
        <h4>Stap 1: Dashboard Selecteren</h4>
        <p>
          Gebruik het keuzemenu om een dashboard uit de lijst te selecteren. Dit is het dashboard waarvoor je een link wilt genereren.
        </p>
        <h4>Stap 2: Groepsnamen Invoeren (optioneel)</h4>
        <p>
          In het veld "Groepsnamen (komma gescheiden)" kun je de namen van de groepen invoeren waarvoor je de link wilt genereren. Scheid meerdere groepen door een komma. <u>Is er geen groep, of wil je een totaal overzicht hebben?</u>. Laat dit veld leeg je krijgt dan zelfde dashboard maar dan niet gefilterd op groep.
        </p>
        <h4>Stap 3: Link Genereren</h4>
        <p>
          Klik op de knop "Genereer link". De tool zal nu de URL's genereren op basis van je invoer.
        </p>
        <h4>Stap 4: Kopiëren naar Klembord</h4>
        <p>
          De gegenereerde URL's worden automatisch gekopieerd naar je klembord. Je kunt ze nu direct plakken in een e-mail, document of waar je ze ook nodig hebt.
        </p>
        <h4>Stap 5: Nieuw Link Maken</h4>
        <p>
          Wil je opnieuw beginnen? Klik op de knop "Nieuw link maken". Dit zal het formulier leegmaken zodat je nieuwe links kunt genereren.
        </p>

        <h4>Vragen?</h4>
        <p>Loop,mail, teams dan <a href="mailto:d.vanderstam@radarvertige.nl?subject=Vraag over dashboards">Daniel</a> </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Sluiten
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserManualModal;
