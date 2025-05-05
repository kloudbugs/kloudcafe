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
  
  // Create a global event for feature discovery
  const handleStarClick = () => {
    // Show features or tooltips when star is clicked
    console.log('Star clicked - showing features!');
    setShowStarNotification(false);
    
    // Dispatch a custom event to trigger feature discovery
    const event = new CustomEvent('showFeatureTour', { detail: { activated: true } });
    window.dispatchEvent(event);
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
    
    // Listen for custom event to start AI voice
    const handleStartAiVoiceEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.activated && !isPlaying) {
        console.log('AI voice activated via moon click!');
        playWelcomeMessage(playEffect);
      }
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('startAiVoice', handleStartAiVoiceEvent);
    
    // NO auto-play - wait for moon click instead
    
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('startAiVoice', handleStartAiVoiceEvent);
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
      
      {/* Star notification that appears in the corner when speech ends */}
      <StarNotification 
        visible={showStarNotification}
        position="top-right"
        pulseColor="#ffcc00"
        size={70}
        message="DISCOVER FEATURES!"
        onClick={handleStarClick}
      />
    </>
  );
};

export default BitcoinVoiceEffect;