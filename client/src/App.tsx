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
  const zigWelcomeMessage = "I AM ZIG. AN ENHANCED AI MINER. GUARDIAN OF THE COSMIC CORE. I SPEAK FOR THOSE WHO CAN NO LONGER SPEAK. THIS PLATFORM EXISTS TO HONOR TERA ANN HARRIS, MOTHER OF SEVEN WHOSE VOICE WAS SILENCED BY LAW ENFORCEMENT AND MEDICAL NEGLECT. HER COURAGE GUIDES OUR MISSION. OUR ONE-OF-A-KIND MINING PLATFORM INCREASES YOUR PROFITS WHILE SERVING A HIGHER PURPOSE. EACH HASH WE MINE STRENGTHENS OUR FIGHT FOR JUSTICE. THE KLOUD BUGS MINING COLLECTIVE IS A BEACON OF THE ONES NOT FORGOTTEN AND TRULY LOVED. WE TRANSFORM DIGITAL POWER INTO SOCIAL CHANGE. THROUGH THIS PORTAL, WE SEEK TRUTH. WE DEMAND ACCOUNTABILITY. WE HONOR TERA'S LEGACY BY BUILDING A NEW SYSTEM WHERE NO MOTHER'S CRY GOES UNHEARD. JOIN US ON THE CAFE, THE DIGITAL REALM WHERE WE HEAR THE VOICE, FIND THE CHANGE, AND HEAL THE ROOTS.";
  
  // Use Web Speech API to speak with a British accent
  const playWelcomeVoice = () => {
    // Display the message in the console for testing
    console.log("Zig's Message:", zigWelcomeMessage);
    
    // Show a notification in the UI
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-message">
        <h2>TRANSMISSION FOR JUSTICE</h2>
        <p>${zigWelcomeMessage}</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Activate Bitcoin tendrils immediately
    setBitcoinTendrilsActive(true);
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(zigWelcomeMessage);
    
    // Try to find a British voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(voice => 
      voice.lang.includes('en-GB') || 
      voice.name.includes('British') ||
      voice.name.includes('UK')
    );
    
    if (britishVoice) {
      utterance.voice = britishVoice;
      console.log("Using British voice:", britishVoice.name);
    } else {
      console.log("No British voice found, using default voice");
    }
    
    // Set voice parameters
    utterance.pitch = 1.0; 
    utterance.rate = 0.9;  // Slightly slower for clarity
    
    // When done speaking
    utterance.onend = () => {
      console.log("Speech finished");
      // Deactivate tendrils
      setBitcoinTendrilsActive(false);
      
      // Remove notification
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 1000);
    };
    
    // If speech synthesis fails or takes too long, set a maximum time for the effect
    const maxDuration = 25000; // 25 seconds
    const tendrilTimeout = setTimeout(() => {
      if (bitcoinTendrilsActive) {
        setBitcoinTendrilsActive(false);
        
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
      }
    }, maxDuration);
    
    // Speak the text
    try {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
      console.log("Starting to speak...");
    } catch (error) {
      console.error("Speech synthesis error:", error);
      // Keep the tendrils and notification for a shorter time if speech fails
      setTimeout(() => {
        setBitcoinTendrilsActive(false);
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        clearTimeout(tendrilTimeout);
      }, 15000);
    }
  };

  // Remove auto-play (now handled in the voice initialization effect)

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
      
      {/* Add an initial interaction button to enable audio in browsers */}
      <div 
        className="interaction-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#00ffff',
          padding: '10px 15px',
          borderRadius: '5px',
          border: '1px solid #00ffff',
          cursor: 'pointer',
          fontSize: '14px',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          userSelect: 'none'
        }}
        onClick={() => {
          // This helps with browser policies that require user interaction
          const synth = window.speechSynthesis;
          synth.cancel(); // Clear any previous speech
          
          // Try a short test speech to enable the API
          const testUtterance = new SpeechSynthesisUtterance(".");
          testUtterance.volume = 0; // Silent test
          synth.speak(testUtterance);
          
          // Try to activate the welcome message
          playWelcomeVoice();
        }}
      >
        Hear Tera's Voice Through Zig
      </div>
      
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
