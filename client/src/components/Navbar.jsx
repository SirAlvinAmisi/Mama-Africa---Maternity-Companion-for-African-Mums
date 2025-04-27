import React from 'react';

const Navbar = () => {
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 2rem',
    backgroundColor: '#e6f7ff', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    color: '#000000',
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000000'
  };

  const navItemsStyle = {
    display: 'flex',
    gap: '1.5rem'
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>
        Mama Afrika
      </div>
      <div style={navItemsStyle}>
        {/* Placeholder links */}
        <a href="#" onClick={(e) => e.preventDefault()}>Home</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Specialist</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Communities</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Login | Signup</a>
      </div>
    </nav>
  );
};

export default Navbar;

