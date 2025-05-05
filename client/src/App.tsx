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

// Import CSS styles
import "./components/ZigNotification.css";
import "./components/HighlightEffects.css";
import "./components/FixedStyles.css"; // Override styles to fix UI issues

// Main App component
function App() {
  // Always keep performance stats hidden
  const [showPerformance, setShowPerformance] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  const [bitcoinTendrilsActive, setBitcoinTendrilsActive] = useState(false);
  const welcomeAudioRef = useRef<HTMLAudioElement>(null);

  // Initialize speech synthesis voices and force speech
  useEffect(() => {
    let voicesLoaded = false;
    
    // Create a function to handle the voices loading
    const handleVoicesLoaded = () => {
      if (voicesLoaded) return; // Only run once
      voicesLoaded = true;
      
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices.length);
      
      // Check for British voices
      const britishVoices = voices.filter(voice => 
        voice.lang.includes('en-GB') || 
        voice.name.includes('British') ||
        voice.name.includes('UK')
      );
      
      if (britishVoices.length > 0) {
        console.log("British voices available:", britishVoices.map(v => v.name).join(', '));
      } else {
        console.log("No British voice found, will use default voice");
      }
      
      // Attempt to speak after voices are loaded
      console.log("Playing Zig's welcome message (British AI voice)");
      console.log("Press 'V' to replay the message at any time");
      
      setTimeout(() => {
        playWelcomeVoice();
      }, 1000);
    };

    // This helps load voices in some browsers
    window.speechSynthesis.onvoiceschanged = handleVoicesLoaded;
    
    // Try to load voices immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      handleVoicesLoaded();
    }
    
    // Force a test utterance to activate speech API
    try {
      const testUtterance = new SpeechSynthesisUtterance("");
      testUtterance.volume = 0;
      window.speechSynthesis.speak(testUtterance);
    } catch (e) {
      console.log("Speech API test failed:", e);
    }
    
    // Backup plan - try again after 2 seconds if voices haven't loaded
    const backupTimer = setTimeout(() => {
      if (!voicesLoaded) {
        console.log("Using backup plan to trigger speech...");
        handleVoicesLoaded();
      }
    }, 2000);
    
    return () => {
      clearTimeout(backupTimer);
    };
  }, []);

  // Toggle stats with 'p' key and handle British voice with 'v' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        toggleMute();
      }
      if (e.key === "v") {
        // Play the British voice welcome message
        playWelcomeVoice();
        console.log("Voice triggered by 'V' key");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

  // Text for Zig's welcome message
  const zigWelcomeMessage = "I AM ZIG. AN ENHANCED AI MINER. GUARDIAN OF THE COSMIC CORE. I SPEAK FOR THOSE WHO CAN NO LONGER SPEAK. THIS PLATFORM EXISTS TO HONOR TERA ANN HARRIS, MOTHER OF SEVEN WHOSE VOICE WAS SILENCED BY LAW ENFORCEMENT AND MEDICAL NEGLECT. HER COURAGE GUIDES OUR MISSION. OUR ONE-OF-A-KIND MINING PLATFORM INCREASES YOUR PROFITS WHILE SERVING A HIGHER PURPOSE. KLOUD MINERS WILL GENERATE FINANCIAL WEALTH AND SUPPORT SOCIAL JUSTICE PROJECTS. EACH HASH WE MINE STRENGTHENS OUR FIGHT FOR JUSTICE. THE KLOUD BUGS MINING COLLECTIVE IS A BEACON OF THE ONES NOT FORGOTTEN AND TRULY LOVED. WE TRANSFORM DIGITAL POWER INTO SOCIAL CHANGE. THROUGH THIS PORTAL, WE SEEK TRUTH. WE DEMAND ACCOUNTABILITY. WE HONOR TERA'S LEGACY BY BUILDING A NEW SYSTEM WHERE NO MOTHER'S CRY GOES UNHEARD. JOIN OUR CAFE, THE DIGITAL REALM WHERE WE HEAR THE VOICE, FIND THE CHANGE, AND HEAL THE ROOTS.";
  
  // Background beat audio element (will play after Zig finishes speaking)
  const [backgroundBeat] = useState<HTMLAudioElement | null>(null);
  
  // Skip voice and only play background music
  const playWelcomeVoice = () => {
    // Skip voice synthesis completely and go straight to playing music
    console.log("Skipping AI voice, only playing music");
    
    // Show a minimal notification in the UI
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-message">
        <h2>KLOUDBUGS MINING COLLECTIVE</h2>
        <p>Transforming digital power into social change</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Activate Bitcoin tendrils briefly
    setBitcoinTendrilsActive(true);
    
    // Start playing the J. Cole beat immediately
    const audioStore = useAudio.getState();
    if (audioStore.backgroundMusic) {
      audioStore.backgroundMusic.currentTime = 0; // Start from the beginning
      audioStore.backgroundMusic.play().catch(e => {
        console.log("Could not auto-play music:", e);
      });
      console.log("Playing J. Cole beat");
    }
    
    // Remove notification and deactivate tendrils after 3 seconds
    setTimeout(() => {
      setBitcoinTendrilsActive(false);
      
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  // Remove auto-play (now handled in the voice initialization effect)

  // Load audio elements without auto-navigation
  useEffect(() => {
    // Load the J. Cole beat as background music
    const backgroundMusic = new Audio("/sounds/background-beat.mp3");
    
    // Music can loop indefinitely
    backgroundMusic.loop = true; 
    backgroundMusic.volume = 0.3;
    
    // Try to play background music immediately (will be allowed after user interaction)
    backgroundMusic.play().catch(e => {
      console.log("Auto-play prevented. Music will play after user interaction:", e);
    });
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    const audioStore = useAudio.getState();
    audioStore.setBackgroundMusic(backgroundMusic);
    audioStore.setHitSound(hitSound);
    audioStore.setSuccessSound(successSound);
    
    console.log("J. Cole beat loaded and playing");
    
    return () => {
      // Clean up
      backgroundMusic.pause();
      backgroundMusic.src = "";
    };
  }, []);

  const controls = useControls();

  return (
    <>
      {/* Twinkling stars background animation */}
      <div className="stars"></div>
      
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
          dampingFactor={0.15} /* Increased from 0.05 for smoother motion */
          rotateSpeed={0.35} /* Reduced from 0.5 for better control */
          minDistance={5}
          maxDistance={20}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.7} /* Optimized zoom speed */
          maxPolarAngle={Math.PI * 0.85} /* Limit vertical rotation */
          makeDefault
        />
      </Canvas>
    </>
  );
}

export default App;
