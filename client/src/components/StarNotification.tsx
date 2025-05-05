import React, { useState, useEffect, useRef } from 'react';
import './StarNotification.css';

interface StarNotificationProps {
  visible: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pulseColor?: string;
  size?: number;
  message?: string;
  onClick?: () => void;
}

const StarNotification: React.FC<StarNotificationProps> = ({
  visible,
  position = 'top-right',
  pulseColor = '#ffcc00',
  size = 50,
  message = 'New Feature!',
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const starRef = useRef<HTMLDivElement>(null);

  // Start animation when component becomes visible
  useEffect(() => {
    if (visible && !isAnimating) {
      setIsAnimating(true);
    } else if (!visible && isAnimating) {
      setIsAnimating(false);
    }
  }, [visible, isAnimating]);

  // Handle click on star
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`star-notification ${position} ${isAnimating ? 'visible' : ''}`}
      style={{ 
        '--pulse-color': pulseColor,
        '--star-size': `${size}px`
      } as React.CSSProperties}
      onClick={handleClick}
      ref={starRef}
    >
      <div className="star-shape">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 0 L31.5 17.5 L50 17.5 L35 28.5 L40 45 L25 35 L10 45 L15 28.5 L0 17.5 L18.5 17.5 Z" />
        </svg>
      </div>
      <div className="notification-message">{message}</div>
    </div>
  );
};

export default StarNotification;