import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { playWelcomeMessage } from '../lib/audio';
import ElectricTendrils from './ElectricTendrils';

interface BitcoinVoiceEffectProps {
  bitcoinPosition?: THREE.Vector3;
}

const BitcoinVoiceEffect: React.FC<BitcoinVoiceEffectProps> = ({
  bitcoinPosition = new THREE.Vector3(0, 0, 0)
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tendrilsActive, setTendrilsActive] = useState(false);
  const tendrilsRef = useRef<THREE.Group>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play the effect when audio starts
  const playEffect = () => {
    setIsPlaying(true);
    setTendrilsActive(true);
    
    // Stop the effect after the audio is done (approx 10 seconds)
    if (effectTimeoutRef.current) {
      clearTimeout(effectTimeoutRef.current);
    }
    
    effectTimeoutRef.current = setTimeout(() => {
      setTendrilsActive(false);
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000); // Allow tendrils to fade out gracefully
    }, 10000);
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
    <group position={bitcoinPosition} ref={tendrilsRef}>
      {/* Place HTML elements outside the Canvas in App.tsx, not here */}
      {tendrilsActive && (
        <ElectricTendrils 
          count={12}
          length={5}
          color="#00ffff"
          width={0.15}
        />
      )}
    </group>
  );
};

export default BitcoinVoiceEffect;