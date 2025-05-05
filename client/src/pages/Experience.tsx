import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from '../App';
import FeatureManager from '../components/FeatureManager';

const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    // Could navigate elsewhere or just allow free exploration
  };
  
  return (
    <>
      <App />
      {!onboardingComplete && (
        <FeatureManager onComplete={handleOnboardingComplete} />
      )}
    </>
  );
};

export default Experience;
