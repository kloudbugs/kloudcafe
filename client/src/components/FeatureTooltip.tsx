import React, { useState, useEffect, useRef } from 'react';
import './FeatureTooltip.css';

export interface FeatureTooltipProps {
  title: string;
  description: string;
  hotkey?: string;
  position?: { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };
  arrowPosition?: 'top' | 'bottom' | 'none';
  arrowAlign?: 'left' | 'center' | 'right';
  highlightPosition?: { top: number; left: number; width: number; height: number };
  showDelay?: number;
  hideDelay?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  onClose?: () => void;
  visible?: boolean;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  title,
  description,
  hotkey,
  position = { bottom: '20px', right: '20px' },
  arrowPosition = 'bottom',
  arrowAlign = 'center',
  highlightPosition,
  showDelay = 500,
  hideDelay = 300,
  autoHide = true,
  autoHideDelay = 8000,
  onClose,
  visible = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

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
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, onClose]);

  // Handle arrow position classes
  const arrowClasses = [];
  if (arrowPosition === 'top') arrowClasses.push('arrow-top');
  if (arrowAlign === 'left') arrowClasses.push('arrow-left');
  if (arrowAlign === 'right') arrowClasses.push('arrow-right');

  return (
    <>
      {highlightPosition && (
        <div
          className="highlight-circle"
          style={{
            top: highlightPosition.top,
            left: highlightPosition.left,
            width: highlightPosition.width,
            height: highlightPosition.height
          }}
        />
      )}
      <div
        ref={tooltipRef}
        className={`feature-tooltip ${arrowClasses.join(' ')} ${isVisible ? 'visible' : ''}`}
        style={position}
      >
        <h3 className="feature-tooltip-title">{title}</h3>
        <p className="feature-tooltip-description">{description}</p>
        {hotkey && <div className="feature-tooltip-hotkey">{hotkey}</div>}
      </div>
    </>
  );
};

export default FeatureTooltip;