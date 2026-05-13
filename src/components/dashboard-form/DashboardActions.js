import React from 'react';
import { Button } from 'react-bootstrap';

const helpButtonStyle = {
  float: 'right',
  fontSize: '1.5rem',
  marginRight: '10px',
};

const DashboardActions = ({ isGenerating, onGenerate, onClear, onShowManual }) => (
  <>
    <button className="btn btn-primary mt-3" onClick={onGenerate} disabled={isGenerating}>
      {isGenerating ? 'Bezig...' : 'Genereer link'}
    </button>

    <button className="btn btn-clear mt-3" onClick={onClear} disabled={isGenerating}>
      Nieuw link maken
    </button>

    <Button variant="link" onClick={onShowManual} style={helpButtonStyle}>
      ?
    </Button>
  </>
);

export default DashboardActions;