import React from 'react';
import Logo from '../assets/icons/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={Logo} alt="Code Editor Logo" className="logo" />
        <h1>Code Editor</h1>
      </div>
    </header>
  );
};

export default Header;