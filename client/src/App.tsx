import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import Cell from "./components/Cell";
import Environment from "./components/Environment";
import BackgroundParticles from "./components/BackgroundParticles";
import MouseInteractionLayer from "./components/MouseInteractionLayer";
import PulseWave from "./components/PulseWave";
import ControlPanel from "./components/ui/ControlPanel";
import OrbitingLogo from "./components/OrbitingLogo";
import StarSparkles from "./components/StarSparkles";
import ElectricTendrils from "./components/ElectricTendrils";
import { useAudio } from "./lib/stores/useAudio";
import { useControls } from "./lib/stores/useControls";
import * as THREE from "three";

// Import Zig notification styles
import "./components/ZigNotification.css";

// Main App component
function App() {
  const [showPerformance, setShowPerformance] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  const [bitcoinTendrilsActive, setBitcoinTendrilsActive] = useState(false);
  const welcomeAudioRef = useRef<HTMLAudioElement>(null);

  // Toggle stats with 'p' key and handle British voice with 'v' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        toggleMute();
      }
      if (e.key === "v" && welcomeAudioRef.current) {
        // Play the British voice welcome message
        playWelcomeVoice();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

  // Text for Zig's welcome message
  const zigWelcomeMessage = "Hello fellow kloud bugminers, my name is Zig. If you've made it to this page, you're on the right galactic path. I am one of your Tera guardians configured and created by your admin guardian. I am a super enchanted AI miner you can only find here, computing all our hashes together so we don't fail. It's time to save the world and save lives. Welcome to the Kloud Bugs mining cafe. Let's get started...";
  
  // Play welcome voice and activate Bitcoin electric tendrils
  const playWelcomeVoice = () => {
    // Display the message in the console for testing
    console.log("Zig's Message:", zigWelcomeMessage);
    
    // Show a notification in the UI
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-message">
        <h2>Zig is speaking...</h2>
        <p>${zigWelcomeMessage}</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Try to play the audio
    if (welcomeAudioRef.current) {
      welcomeAudioRef.current.play().catch(err => {
        console.log("Error playing audio:", err);
        // If audio fails to play, still show the tendrils for visual effect
        setBitcoinTendrilsActive(true);
        setTimeout(() => setBitcoinTendrilsActive(false), 15000);
      });
      
      // Activate Bitcoin tendrils while voice is playing
      setBitcoinTendrilsActive(true);
      
      // Reset after voice is done
      welcomeAudioRef.current.onended = () => {
        setBitcoinTendrilsActive(false);
        
        // Remove the notification after a delay
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 1000);
      };
    } else {
      // Fallback if audio element isn't available
      setBitcoinTendrilsActive(true);
      setTimeout(() => {
        setBitcoinTendrilsActive(false);
        
        // Remove the notification after a delay
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 15000);
    }
  };

  // Auto-play the welcome message after a delay
  useEffect(() => {
    // Use setTimeout to ensure the page is fully loaded
    const timer = setTimeout(() => {
      // Display console message about using the voice
      console.log("Playing Zig's welcome message (British AI voice)");
      console.log("Press 'V' to replay the message at any time");
      
      // Play the welcome message
      playWelcomeVoice();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Load audio elements
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    const audioStore = useAudio.getState();
    audioStore.setBackgroundMusic(backgroundMusic);
    audioStore.setHitSound(hitSound);
    audioStore.setSuccessSound(successSound);
    
    // Don't autoplay - user needs to interact first
    console.log("Audio loaded. Press 'M' to toggle sound.");
    
    return () => {
      backgroundMusic.pause();
      backgroundMusic.src = "";
    };
  }, []);

  const controls = useControls();

  return (
    <>
      {/* Twinkling stars background animation */}
      <div className="stars"></div>
      
      {/* British voice welcome message (hidden audio element) */}
      <audio
        ref={welcomeAudioRef}
        src="/audio/welcome-message.mp3"
        style={{ display: 'none' }}
      />
      
      <ControlPanel />
      
      <Canvas
        shadows
        camera={{ position: [0, 2, 12], fov: 50, near: 0.1, far: 1000 }}
        gl={{ 
          antialias: true,
          powerPreference: "default",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        {showPerformance && <Stats />}
        
        <color attach="background" args={["#0a0a0a"]} /> {/* using cosmic-black from the guide */}
        
        <Suspense fallback={null}>
          <Cell />
          <Environment />
          <BackgroundParticles 
            count={controls.particleCount} 
            radius={40} 
            size={0.04} 
            color={controls.getColorByScheme('pulse')}
          />
          <PulseWave 
            frequency={0.8} 
            intensity={controls.pulseIntensity}
            baseColor={controls.getColorByScheme('pulse')}
          />
          {/* Mining Grid removed as requested */}
          <MouseInteractionLayer visible={controls.interactionEnabled} />
          
          {/* Orbiting Logo */}
          <OrbitingLogo 
            radius={3} 
            speed={0.3}
          />
          
          {/* Sparkle stars around the scene */}
          <StarSparkles 
            count={15} 
            radius={8} 
            size={0.15} 
            color="#ffffff" 
          />
          
          {/* Electric tendrils effect for bitcoin core */}
          {bitcoinTendrilsActive && (
            <group position={[0, 0, 0]}>
              <ElectricTendrils 
                count={12}
                length={5}
                color="#00ffff"
                width={0.15}
              />
            </group>
          )}
        </Suspense>
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={20}
          enablePan={false}
        />
      </Canvas>
    </>
  );
}

export default App;
