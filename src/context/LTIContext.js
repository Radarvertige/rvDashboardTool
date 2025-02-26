import React, { createContext, useState, useContext } from 'react';

const LTIContext = createContext();

export const LTIProvider = ({ children }) => {
  const [isLTIDashboard, setIsLTIDashboard] = useState(false);

  return (
    <LTIContext.Provider value={{ isLTIDashboard, setIsLTIDashboard }}>
      {children}
    </LTIContext.Provider>
  );
};

export const useLTI = () => useContext(LTIContext);
