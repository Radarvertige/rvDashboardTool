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
        <p><em> ! Als je het gewenste dashboard niet ziet, kan het zijn dat er nog geen dashboard bestaat of dat het nog in ontwikkeling is. Vraag Daniel hier gerust naar.</em>
        </p>
        <h4>Stap 2: Groepsnamen Invoeren (optioneel)</h4>
        <p>
        In het veld "Groepsnaam (of namen) kun je de naam van de groep invoeren waarvoor je de link wilt genereren.</p> 
        <p>Je kunt ook meerdere groepen tegelijk invoeren, scheid daarvoor de groepsnamen met een komma. 23-21321, 12-213213 etc.</p>
           <p><u>Is er geen groep, of wil je een totaal overzicht hebben?</u>. Laat dit veld leeg je krijgt dan hetzelfde dashboard maar dan niet gefilterd op groep.
        </p>
        <p><em>! Gebruik altijd de groepsnaam die je in radaronline, thor, hho gebruikt.</em></p>
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
        <p>Kom langs bij , stuur een mail of een teamsbericht naar <a href="mailto:d.vanderstam@radarvertige.nl?subject=Vraag over dashboards.">Daniel</a> </p>
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
