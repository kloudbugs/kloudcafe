import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from '../App';
import ControlsTutorial from '../components/ControlsTutorial';

const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  
  const handleTutorialComplete = () => {
    // Mark tutorial as completed and hide it
    setTutorialCompleted(true);
    setShowTutorial(false);
  };
  
  return (
    <>
      <App />
      {showTutorial && !tutorialCompleted && (
        <ControlsTutorial onComplete={handleTutorialComplete} />
      )}
    </>
  );
};

export default Experience;
