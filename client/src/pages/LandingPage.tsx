import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing-page.css';

const LandingPage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Add animation class after component mounts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`landing-page ${loaded ? 'loaded' : ''}`}>
      <div className="stars-background"></div>
      
      <div className="landing-content">
        <div className="logo-container">
          <img src="/images/kloudbugs-logo.svg" alt="KloudBugs Cafe" className="logo" />
        </div>
        
        <h1 className="title">KLOUDBUGS CAFE</h1>
        <h2 className="subtitle">CRYPTOCURRENCY MINING PLATFORM</h2>
        
        <div className="description">
          <p>KLOUD MINERS GENERATE FINANCIAL WEALTH AND SUPPORT SOCIAL JUSTICE PROJECTS</p>
          <p>EACH HASH WE MINE STRENGTHENS OUR FIGHT FOR JUSTICE</p>
        </div>
        
        <div className="dedication">
          <p>THIS PLATFORM EXISTS TO HONOR TERA ANN HARRIS</p>
          <p>MOTHER OF SEVEN WHOSE VOICE WAS SILENCED BY LAW ENFORCEMENT AND MEDICAL NEGLECT</p>
        </div>
        
        <div className="cta-buttons">
          <Link to="/experience" className="enter-button">
            <span className="button-glow"></span>
            ENTER ZIG MINING PORTAL
          </Link>
          
          <a 
            href="https://replit.com/t/kloudbugscafe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="learn-more-button"
          >
            JOIN THE CAFE
          </a>
        </div>
        
        <div className="footer">
          <p>WE TRANSFORM DIGITAL POWER INTO SOCIAL CHANGE</p>
          <p>&copy; 2025 KLOUDBUGS CAFE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
