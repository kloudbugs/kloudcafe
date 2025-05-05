import React, { useState, useEffect } from 'react';
import FeatureTooltip, { FeatureTooltipProps } from './FeatureTooltip';

export interface TourStep extends FeatureTooltipProps {
  id: string;
}

interface FeatureTourProps {
  steps: TourStep[];
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  onComplete?: () => void;
  startAtStep?: number;
  visible?: boolean;
}

const FeatureTour: React.FC<FeatureTourProps> = ({
  steps,
  autoAdvance = true,
  autoAdvanceDelay = 8000,
  onComplete,
  startAtStep = 0,
  visible = true
}) => {
  const [currentStep, setCurrentStep] = useState(startAtStep);
  const [isVisible, setIsVisible] = useState(visible);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  // Auto-advance to next step if enabled
  useEffect(() => {
    if (autoAdvance && isVisible) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, autoAdvanceDelay);

      return () => clearTimeout(timer);
    }
  }, [currentStep, autoAdvance, autoAdvanceDelay, isVisible]);

  if (!isVisible || steps.length === 0) return null;

  const currentTooltip = steps[currentStep];

  return (
    <FeatureTooltip
      {...currentTooltip}
      autoHideDelay={autoAdvanceDelay}
      onClose={handleNextStep}
      visible={isVisible}
    />
  );
};

export default FeatureTour;
