import React, { useState, useEffect } from 'react';
import ControlsTutorial from './ControlsTutorial';
import FeatureTour from './FeatureTour';
import { TourStep } from './FeatureTour';

interface FeatureManagerProps {
  onComplete?: () => void;
}

// Define all the feature tour steps for the experience
const featureTourSteps: TourStep[] = [
  {
    id: 'bitcoin-core',
    title: 'COSMIC CORE',
    description: 'This glowing Bitcoin core is the central source of ZIG\'s cosmic mining power.',
    position: { top: '20%', left: '50%' },
    arrowPosition: 'bottom',
    highlightPosition: { top: 100, left: 300, width: 100, height: 100 }
  },
  {
    id: 'orbiting-bitcoins',
    title: 'BLOCKCHAIN ORBITS',
    description: 'Watch as crypto tokens orbit around the core, collecting mining energy.',
    position: { top: '30%', right: '20px' },
    arrowPosition: 'bottom',
    arrowAlign: 'right'
  },
  {
    id: 'tendrils',
    title: 'QUANTUM TENDRILS',
    description: 'Electric tendrils represent the connections to ZIG\'s powerful neural network.',
    position: { bottom: '100px', left: '50px' },
    arrowPosition: 'top',
    arrowAlign: 'left'
  },
  {
    id: 'voice-control',
    title: 'ZIG AI VOICE',
    description: 'Press V key to hear ZIG speak again at any time.',
    hotkey: 'V',
    position: { top: '100px', left: '50px' },
    arrowPosition: 'bottom',
    arrowAlign: 'left'
  },
  {
    id: 'audio-toggle',
    title: 'MUSIC CONTROL',
    description: 'Toggle the J. Cole beat soundtrack on/off with the M key.',
    hotkey: 'M',
    position: { bottom: '150px', right: '50px' },
    arrowPosition: 'top',
    arrowAlign: 'right'
  },
  {
    id: 'control-panel',
    title: 'MINING CONTROLS',
    description: 'Adjust cosmic parameters in the control panel to customize your mining experience.',
    position: { bottom: '200px', right: '100px' },
    arrowPosition: 'top',
    arrowAlign: 'right'
  }
];

const FeatureManager: React.FC<FeatureManagerProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'tutorial' | 'tour' | 'completed'>('tutorial');
  const [tourVisible, setTourVisible] = useState(false);

  // When tutorial is completed, start the feature tour after a delay
  const handleTutorialComplete = () => {
    setStage('tour');
    setTimeout(() => {
      setTourVisible(true);
    }, 1000);
  };

  // When tour is completed, mark everything as done
  const handleTourComplete = () => {
    setStage('completed');
    if (onComplete) onComplete();
  };

  return (
    <>
      {stage === 'tutorial' && (
        <ControlsTutorial onComplete={handleTutorialComplete} />
      )}
      
      {stage === 'tour' && (
        <FeatureTour 
          steps={featureTourSteps} 
          onComplete={handleTourComplete}
          visible={tourVisible}
          autoAdvance={true}
          autoAdvanceDelay={6000}
        />
      )}
    </>
  );
};

export default FeatureManager;