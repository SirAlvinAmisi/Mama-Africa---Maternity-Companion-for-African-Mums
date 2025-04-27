import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    lineHeight: '1.6'
  };

  const headingStyle = {
    color: '#4CAF50',
    marginBottom: '1rem'
  };

  const sectionStyle = {
    marginBottom: '2rem'
  };

  const teamSectionStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    marginTop: '2rem'
  };

  const teamMemberStyle = {
    width: '200px',
    textAlign: 'center'
  };

  const teamImagePlaceholderStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    margin: '0 auto 1rem'
  };

  const missionStyle = {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    margin: '2rem 0',
    padding: '1rem',
    borderLeft: '4px solid #4CAF50',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h1 style={headingStyle}>About Mama Afrika</h1>
        <p>
          Mama Afrika is a community-driven platform dedicated to supporting women during pregnancy and motherhood, 
          with a particular focus on African mothers and their unique needs.
        </p>
        
        <div style={missionStyle}>
          Our mission is to empower every mother with knowledge, support, and community throughout their 
          maternal journey, ensuring healthier outcomes for both mothers and babies.
        </div>
        
        <p>
          Founded in 2023, Mama Afrika bridges the gap in maternal healthcare access by connecting mothers 
          with specialists, resources, and fellow mothers who understand their experiences.
        </p>
      </div>
      
      <div style={sectionStyle}>
        <h2 style={headingStyle}>What We Offer</h2>
        <ul>
          <li>Expert advice from healthcare professionals specialized in maternal care</li>
          <li>Community forums for sharing experiences and seeking support</li>
          <li>Educational resources on pregnancy, childbirth, and early childcare</li>
          <li>Culturally relevant information centered on African mothers' needs</li>
          <li>Tracking tools for pregnancy milestones and baby development</li>
        </ul>
      </div>
      
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Our Team</h2>
        <p>
          Mama Afrika is brought to you by a dedicated team of healthcare professionals, 
          community advocates, and technology experts passionate about maternal health.
        </p>
        
        <div style={teamSectionStyle}>
          {/* Team member placeholders */}
          <div style={teamMemberStyle}>
            <div style={teamImagePlaceholderStyle}></div>
            <h3>Fadilatu Amana</h3>
            <p>Founder & CEO</p>
          </div>
          
          <div style={teamMemberStyle}>
            <div style={teamImagePlaceholderStyle}></div>
            <h3>Dr. Sarah Mensah</h3>
            <p>Medical Director</p>
          </div>
          
          <div style={teamMemberStyle}>
            <div style={teamImagePlaceholderStyle}></div>
            <h3>Kofi Adetokunbo</h3>
            <p>Community Lead</p>
          </div>
        </div>
      </div>
      
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Join Our Community</h2>
        <p>
          Whether you're expecting, a new mother, or an experienced parent willing to share your wisdom, 
          Mama Afrika welcomes you. Together, we can support each other through the beautiful and 
          challenging journey of motherhood.
        </p>
        <button 
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Sign Up Today
        </button>
      </div>
    </div>
  );
};

export default About;