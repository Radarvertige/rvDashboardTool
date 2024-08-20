import React from 'react';
import headerImage from '../assets/rvlogo.png'; // Adjust the path to your actual image file
import '../styles/Header.css'; // Import the CSS file

const Header = ({ team }) => {
  return (
    <div className="header-container mb-5">
      <img src={headerImage} alt="Header" className="header-image" />
      <h1 className="header-title">
        Dashboard link generator
        {team && (
          <span > - {team.replace(/-/g, ' ')}</span>
        )}
      </h1>
    </div>
  );
};

export default Header;
