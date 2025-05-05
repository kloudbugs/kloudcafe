import React, { useState, useEffect } from 'react';
import ControlsTutorial from './ControlsTutorial';
import SimpleFeatureTooltip from './SimpleFeatureTooltip';

interface FeatureManagerProps {
  onComplete?: () => void;
}

// Define tooltips data
const tooltips = [
  {
    title: 'COSMIC CORE',
    description: 'This glowing Bitcoin core is the central source of cosmic mining power.',
    position: { top: '20%', left: '50%' }
  },
  {
    title: 'BLOCKCHAIN ORBITS',
    description: 'Watch as crypto tokens orbit around the core, collecting mining energy.',
    position: { top: '30%', right: '20px' }
  },
  {
    title: 'QUANTUM TENDRILS',
    description: 'Electric tendrils represent the connections to the neural network.',
    position: { bottom: '100px', left: '50px' }
  },
  {
    title: 'ZIG AI VOICE',
    description: 'Press V key to hear ZIG speak again at any time.',
    position: { top: '100px', left: '50px' }
  },
  {
    title: 'MUSIC CONTROL',
    description: 'Toggle the J. Cole beat soundtrack on/off with the M key.',
    position: { bottom: '150px', right: '50px' }
  },
  {
    title: 'MINING CONTROLS',
    description: 'Adjust cosmic parameters in the control panel to customize your mining experience.',
    position: { bottom: '200px', right: '100px' }
  }
];

const FeatureManager: React.FC<FeatureManagerProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'tutorial' | 'tour' | 'completed'>('tutorial');
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // When tutorial is completed, start tooltips
  const handleTutorialComplete = () => {
    setStage('tour');
    setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };

  // Move to next tooltip or complete the tour
  const handleTooltipClose = () => {
    if (currentTooltipIndex < tooltips.length - 1) {
      setCurrentTooltipIndex(prevIndex => prevIndex + 1);
    } else {
      setStage('completed');
      if (onComplete) onComplete();
    }
  };

  return (
    <>
      {stage === 'tutorial' && (
        <ControlsTutorial onComplete={handleTutorialComplete} />
      )}
      
      {stage === 'tour' && showTooltip && (
        <SimpleFeatureTooltip
          title={tooltips[currentTooltipIndex].title}
          description={tooltips[currentTooltipIndex].description}
          position={tooltips[currentTooltipIndex].position}
          onClose={handleTooltipClose}
          autoHideDelay={6000}
          visible={showTooltip}
        />
      )}
    </>
  );
};

export default FeatureManager;