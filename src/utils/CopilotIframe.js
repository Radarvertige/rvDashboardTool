// utils/CopilotIframe.js
import React, { useEffect } from 'react';

const CopilotIframe = () => {
  useEffect(() => {
    // Simuleer het verzenden van data vanuit het iframe
    const handleLoad = () => {
      const iframeWindow = document.getElementById("copilot-iframe")?.contentWindow;

      if (iframeWindow) {
        // Bijvoorbeeld het resultaat uit de iframe sturen na het laden
        iframeWindow.postMessage({ type: 'RESULT_DATA', data: 'Naam1, Naam2, Naam3' }, '*');
      }
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <iframe
      id="copilot-iframe"
      src="https://copilotstudio.microsoft.com/environments/Default-213c2616-dad0-4501-a344-3152a06f10e9/bots/cr9cb_namenFilterenUitTabel/webchat?__version__=2"
      title="Copilot Bot"
      style={{
        width: '100%',
        height: '500px',
        border: 'none'
      }}
    ></iframe>
  );
};

export default CopilotIframe;
