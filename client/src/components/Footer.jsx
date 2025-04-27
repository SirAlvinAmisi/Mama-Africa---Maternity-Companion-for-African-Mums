import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#e6f7ff',
    padding: '2rem',
    width: '100%',
    bottom: 0,
    position: 'relative'
    
  };

  const footerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap'
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    minWidth: '200px',
    margin: '0 1rem 1rem 0'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '0.9rem'
  };

  const copyrightStyle = {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.8rem',
    color: '#666'
  };

  const socialIconsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={columnStyle}>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Home</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Specialist</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Communities</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>About Us</a>
        </div>
        <div style={columnStyle}>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Community Guidelines</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Data Privacy Policy</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Help Center</a>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Popular Topics</a>
        </div>
        <div style={columnStyle}>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
          <div style={linkStyle}>info@mamaafrika.com</div>
        </div>
      </div>
      <div style={socialIconsStyle}>
        {/* Placeholder for social media icons */}
        <div style={{width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%'}}></div>
        <div style={{width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%'}}></div>
        <div style={{width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%'}}></div>
      </div>
      <div style={copyrightStyle}>
        <p>Mama Afrika. All rights reserved.</p>
        <p>Mama Afrika is designed for educational purposes only. Consult with a medical professional if you have health concerns.</p>
      </div>
    </footer>
  );
};

export default Footer;