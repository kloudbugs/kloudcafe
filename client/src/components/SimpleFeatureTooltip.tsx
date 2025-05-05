import React, { useState, useEffect } from 'react';
import './FeatureTooltip.css';

interface SimpleFeatureTooltipProps {
  title: string;
  description: string;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  onClose?: () => void;
  showDelay?: number;
  autoHideDelay?: number;
  visible?: boolean;
}

const SimpleFeatureTooltip: React.FC<SimpleFeatureTooltipProps> = ({
  title,
  description,
  position = { bottom: '20px', right: '20px' },
  onClose,
  showDelay = 500,
  autoHideDelay = 8000,
  visible = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [visible, showDelay]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDelay, onClose]);

  return (
    <div
      className={`feature-tooltip ${isVisible ? 'visible' : ''}`}
      style={position}
    >
      <h3 className="feature-tooltip-title">{title}</h3>
      <p className="feature-tooltip-description">{description}</p>
    </div>
  );
};

export default SimpleFeatureTooltip;