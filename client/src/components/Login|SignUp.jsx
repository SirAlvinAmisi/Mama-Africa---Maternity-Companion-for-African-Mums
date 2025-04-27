import React, { useState } from 'react';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const containerStyle = {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
  };

  const buttonStyle = {
    padding: '0.8rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const toggleStyle = {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem'
  };

  const linkStyle = {
    color: '#4CAF50',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <p>Welcome to Mama Afrika</p>
      </div>
      
      <form style={formStyle}>
        {!isLogin && (
          <>
            <input 
              type="text" 
              placeholder="Full Name" 
              style={inputStyle} 
            />
          </>
        )}
        
        <input 
          type="email" 
          placeholder="Email Address" 
          style={inputStyle} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          style={inputStyle} 
        />
        
        {!isLogin && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            style={inputStyle} 
          />
        )}
        
        <button type="button" style={buttonStyle}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <div style={toggleStyle}>
        {isLogin ? (
          <p>Don't have an account? <span style={linkStyle} onClick={() => setIsLogin(false)}>Sign Up</span></p>
        ) : (
          <p>Already have an account? <span style={linkStyle} onClick={() => setIsLogin(true)}>Login</span></p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;