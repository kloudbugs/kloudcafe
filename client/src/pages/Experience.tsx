import React from 'react';
import { Link } from 'react-router-dom';
import App from '../App';

const Experience: React.FC = () => {
  return (
    <>
      {/* Back to home link - positioned in the bottom left */}
      <Link
        to="/"
        className="cosmic-main-btn"
        style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(204, 153, 0, 0.3)',
          padding: '10px 16px',
          borderRadius: '8px',
          border: '2px solid #cc9900',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 0 15px rgba(204, 153, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}
      >
        <span style={{ fontSize: '18px' }}>🏠</span>
        Back to Home
      </Link>
      <App />
    </>
  );
};

export default Experience;
