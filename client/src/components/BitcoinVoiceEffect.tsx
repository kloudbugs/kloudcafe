import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { playWelcomeMessage } from '../lib/audio';
import ElectricTendrils from './ElectricTendrils';
import StarNotification from './StarNotification';

interface BitcoinVoiceEffectProps {
  bitcoinPosition?: THREE.Vector3;
}

const BitcoinVoiceEffect: React.FC<BitcoinVoiceEffectProps> = ({
  bitcoinPosition = new THREE.Vector3(0, 0, 0)
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tendrilsActive, setTendrilsActive] = useState(false);
  const [showStarNotification, setShowStarNotification] = useState(false);
  const tendrilsRef = useRef<THREE.Group>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play the effect when audio starts
  const playEffect = () => {
    setIsPlaying(true);
    setTendrilsActive(true);
    setShowStarNotification(false);
    
    // Stop the effect after the audio is done (approx 10 seconds)
    if (effectTimeoutRef.current) {
      clearTimeout(effectTimeoutRef.current);
    }
    
    effectTimeoutRef.current = setTimeout(() => {
      setTendrilsActive(false);
      setTimeout(() => {
        setIsPlaying(false);
        // Show star notification when speech is done
        setShowStarNotification(true);
      }, 1000); // Allow tendrils to fade out gracefully
    }, 10000);
  };
  
  // Handle notification click
  const handleStarClick = () => {
    // Show features or tooltips when star is clicked
    console.log('Star clicked - showing feature highlights!');
    setShowStarNotification(false);
    
    // Here we highlight the bitcoin core
    // First we need to wait for the DOM to fully reflect the Three.js scene
    setTimeout(() => {
      // Apply the highlight to the bitcoin core
      const bitcoinCoreElements = document.querySelectorAll('canvas');
      
      // First add a highlight overlay to indicate where the core is
      const overlay = document.createElement('div');
      overlay.className = 'highlight-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '50%';
      overlay.style.left = '50%';
      overlay.style.width = '200px';
      overlay.style.height = '200px';
      overlay.style.marginLeft = '-100px';
      overlay.style.marginTop = '-100px';
      overlay.style.borderRadius = '50%';
      overlay.style.border = '4px dashed #ffcc00';
      overlay.style.boxShadow = '0 0 20px rgba(255, 204, 0, 0.8)';
      overlay.style.zIndex = '1000';
      overlay.style.pointerEvents = 'none';
      overlay.style.animation = 'highlight-pulse 2s infinite';
      
      document.body.appendChild(overlay);
      
      // Display a tooltip above it
      const tooltip = document.createElement('div');
      tooltip.className = 'feature-tooltip';
      tooltip.style.position = 'fixed';
      tooltip.style.top = 'calc(50% - 150px)';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.zIndex = '1001';
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'none';
      tooltip.innerHTML = `
        <h3 class="feature-tooltip-title">COSMIC CORE</h3>
        <p class="feature-tooltip-description">This glowing Bitcoin core is the central source of cosmic mining power.</p>
      `;
      
      document.body.appendChild(tooltip);
      
      // Remove the highlights after 5 seconds
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      }, 5000);
    }, 100);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, []);

  // Handle voice playback
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      // Press 'V' to play the welcome message
      if (e.code === 'KeyV' && !isPlaying) {
        playWelcomeMessage(playEffect);
      }
    };

    window.addEventListener('keydown', keyHandler);
    
    // Auto-play when the component mounts (after a delay to ensure audio is ready)
    const timer = setTimeout(() => {
      console.log("Auto-playing welcome message...");
      playWelcomeMessage(playEffect);
    }, 3000);
    
    return () => {
      window.removeEventListener('keydown', keyHandler);
      clearTimeout(timer);
    };
  }, [isPlaying]);

  return (
    <>
      <group position={bitcoinPosition} ref={tendrilsRef}>
        {tendrilsActive && (
          <ElectricTendrils 
            count={12}
            length={5}
            color="#00ffff"
            width={0.15}
          />
        )}
      </group>
      
      {/* Star notification that appears in the top left corner when speech ends */}
      <StarNotification 
        visible={showStarNotification}
        position="top-left"
        pulseColor="#ffcc00"
        size={80}
        message="DISCOVER FEATURES!"
        onClick={handleStarClick}
      />
    </>
  );
};

export default BitcoinVoiceEffect;