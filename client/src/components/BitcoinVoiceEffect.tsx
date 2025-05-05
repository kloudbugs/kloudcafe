import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playWelcomeMessage } from '../lib/audio';
import VoiceGenerator from './VoiceGenerator';
import ElectricTendrils from './ElectricTendrils';

interface BitcoinVoiceEffectProps {
  bitcoinPosition?: THREE.Vector3;
}

const BitcoinVoiceEffect: React.FC<BitcoinVoiceEffectProps> = ({
  bitcoinPosition = new THREE.Vector3(0, 0, 0)
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [tendrilsActive, setTendrilsActive] = useState(false);
  const tendrilsRef = useRef<THREE.Group>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define the welcome message
  const welcomeMessage = "Welcome to the cosmic Bitcoin mining experience. Prepare for an extraordinary journey through digital constellations and blockchain galaxies.";

  // Handle audio generation
  const handleAudioGenerated = (audioUrl: string) => {
    setAudioGenerated(true);
    
    // Create a download link for the generated audio
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'welcome-message.mp3';
    link.click();
    
    console.log('British AI voice message generated. You can find it in your downloads folder.');
  };
  
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

  // Handle voice playback after audios are loaded
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
      playWelcomeMessage(playEffect);
    }, 3000);
    
    return () => {
      window.removeEventListener('keydown', keyHandler);
      clearTimeout(timer);
    };
  }, [isPlaying]);

  return (
    <>
      {/* Generate the welcome message audio file */}
      <VoiceGenerator 
        text={welcomeMessage}
        outputFileName="welcome-message.mp3"
        onGenerated={handleAudioGenerated}
        autoGenerate={!audioGenerated}
      />
      
      {/* Show tendrils when the voice is playing */}
      {tendrilsActive && (
        <group position={bitcoinPosition} ref={tendrilsRef}>
          <ElectricTendrils 
            count={12}
            length={5}
            color="#00ffff"
            width={0.15}
          />
        </group>
      )}
    </>
  );
};

export default BitcoinVoiceEffect;