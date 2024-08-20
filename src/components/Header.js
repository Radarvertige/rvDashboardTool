import React from 'react';
import headerImage from '../assets/rvlogo.png'; // Adjust the path as necessary

function Header() {
  return (
    <img src={headerImage} alt="Header" className="img-fluid mb-4" />
  );
}

export default Header;
