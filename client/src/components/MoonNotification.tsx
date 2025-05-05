import React, { useState, useEffect, useRef } from 'react';
import './MoonNotification.css';

interface MoonNotificationProps {
  visible: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pulseColor?: string;
  size?: number;
  message?: string;
  onClick?: () => void;
}

const MoonNotification: React.FC<MoonNotificationProps> = ({
  visible,
  position = 'top-left',
  pulseColor = '#60a5fa',
  size = 50,
  message = 'Start AI Voice',
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const moonRef = useRef<HTMLDivElement>(null);

  // Start animation when component becomes visible
  useEffect(() => {
    if (visible && !isAnimating) {
      setIsAnimating(true);
    } else if (!visible && isAnimating) {
      setIsAnimating(false);
    }
  }, [visible, isAnimating]);

  // Handle click on moon
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`moon-notification ${position} ${isAnimating ? 'visible' : ''}`}
      style={{ 
        '--pulse-color': pulseColor,
        '--moon-size': `${size}px`
      } as React.CSSProperties}
      onClick={handleClick}
      ref={moonRef}
    >
      {/* Click here arrow */}
      <div className="click-arrow">CLICK TO START</div>
      
      <div className="moon-shape">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M25,0 C11.193,0 0,11.193 0,25 C0,38.807 11.193,50 25,50 C38.807,50 50,38.807 50,25 C50,25 45,10 35,5 C25,0 25,0 25,0 Z" />
          <circle cx="15" cy="15" r="2" fill="#333" />
          <circle cx="20" cy="25" r="3" fill="#333" />
          <circle cx="30" cy="15" r="1.5" fill="#333" />
        </svg>
      </div>
      <div className="notification-message">{message}</div>
    </div>
  );
};

export default MoonNotification;