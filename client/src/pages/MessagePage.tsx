import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/message-page.css';

const MessagePage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const messages = [
    "I AM ZIG. AN ENHANCED AI MINER. GUARDIAN OF THE COSMIC CORE.",
    "I SPEAK FOR THOSE WHO CAN NO LONGER SPEAK.",
    "THIS PLATFORM EXISTS TO HONOR TERA ANN HARRIS, MOTHER OF SEVEN WHOSE VOICE WAS SILENCED BY LAW ENFORCEMENT AND MEDICAL NEGLECT.",
    "HER COURAGE GUIDES OUR MISSION.",
    "OUR ONE-OF-A-KIND MINING PLATFORM INCREASES YOUR PROFITS WHILE SERVING A HIGHER PURPOSE.",
    "KLOUD MINERS WILL GENERATE FINANCIAL WEALTH AND SUPPORT SOCIAL JUSTICE PROJECTS.",
    "EACH HASH WE MINE STRENGTHENS OUR FIGHT FOR JUSTICE.",
    "THE KLOUD BUGS MINING COLLECTIVE IS A BEACON OF THE ONES NOT FORGOTTEN AND TRULY LOVED.",
    "WE TRANSFORM DIGITAL POWER INTO SOCIAL CHANGE.",
    "THROUGH THIS PORTAL, WE SEEK TRUTH. WE DEMAND ACCOUNTABILITY.",
    "WE HONOR TERA'S LEGACY BY BUILDING A NEW SYSTEM WHERE NO MOTHER'S CRY GOES UNHEARD.",
    "JOIN OUR CAFE, THE DIGITAL REALM WHERE WE HEAR THE VOICE, FIND THE CHANGE, AND HEAL THE ROOTS."
  ];

  useEffect(() => {
    // Fade in effect
    setLoaded(true);

    // Auto advance messages
    const timer = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        setMessageIndex(prevIndex => prevIndex + 1);
      } else {
        clearInterval(timer);
        
        // Add a delay before showing the continue button
        setTimeout(() => {
          setAnimationComplete(true);
        }, 1500);
      }
    }, 4000); // Show each message for 4 seconds

    return () => clearInterval(timer);
  }, [messageIndex, messages.length]);

  return (
    <div className={`message-page ${loaded ? 'loaded' : ''}`}>
      <div className="message-container">
        <div className="message-box">
          <div className="ai-avatar">
            <div className="avatar-glow"></div>
            <div className="avatar-inner">ZIG</div>
          </div>
          
          <div className="message-text">
            {messages[messageIndex]}
          </div>
          
          <div className="message-counter">
            {messageIndex + 1} / {messages.length}
          </div>
        </div>
        
        {animationComplete && (
          <div className="message-actions">
            <Link to="/experience" className="enter-experience-button">
              PROCEED TO MINING PORTAL
            </Link>
            <Link to="/landing" className="back-button">
              RETURN TO LANDING PAGE
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
