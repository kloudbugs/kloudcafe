import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import App from '../App';
import FeatureManager from '../components/FeatureManager';
import StarNotification from '../components/StarNotification';
import MoonNotification from '../components/MoonNotification';

const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showFeatureTour, setShowFeatureTour] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Handle the onboarding completion
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };
  
  // Handle moon click - start tutorial and AI voice
  const handleMoonClick = () => {
    console.log('Starting interactive tutorial and AI voice!');
    setTutorialStarted(true);
    setShowNotifications(false);
    
    // Trigger AI voice by dispatching a custom event
    const event = new CustomEvent('startAiVoice', { detail: { activated: true } });
    window.dispatchEvent(event);
  };
  
  // Handle star click event - start feature tour
  const handleStarClick = () => {
    console.log('Starting feature discovery!');
    setShowFeatureTour(true);
    setShowNotifications(false);
  };
  
  // Listen for the custom event from StarNotification
  useEffect(() => {
    const handleFeatureTourEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.activated) {
        console.log('Feature tour activated!');
        setShowFeatureTour(true);
        setShowNotifications(false);
      }
    };
    
    window.addEventListener('showFeatureTour', handleFeatureTourEvent);
    
    return () => {
      window.removeEventListener('showFeatureTour', handleFeatureTourEvent);
    };
  }, []);
  
  return (
    <>
      <App />
      
      {/* Moon and Star notifications, visible until one is clicked */}
      {showNotifications && (
        <>
          <MoonNotification 
            visible={true} 
            position="top-left" 
            message="START TUTORIAL" 
            onClick={handleMoonClick}
            size={70}
          />
          
          <StarNotification 
            visible={true} 
            position="top-right" 
            message="DISCOVER FEATURES" 
            onClick={handleStarClick}
            size={70}
          />
        </>
      )}
      
      {/* Show tutorial when moon is clicked */}
      {tutorialStarted && !onboardingComplete && !showFeatureTour && (
        <FeatureManager onComplete={handleOnboardingComplete} />
      )}
      
      {/* Show feature tour when star is clicked (even if tutorial was already completed) */}
      {showFeatureTour && (
        <FeatureManager 
          onComplete={() => {
            setShowFeatureTour(false);
            setShowNotifications(true);
          }} 
          startWithTour={true}
        />
      )}
    </>
  );
};

export default Experience;
