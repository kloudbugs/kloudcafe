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
    
    // Try to find British voices and use a specific one
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.length);
    
    // Filter British voices
    const britishVoices = voices.filter(voice => 
      voice.lang.includes('en-GB') || 
      voice.name.includes('British') ||
      voice.name.includes('UK')
    );
    
    console.log("British voices available:", britishVoices.map(v => v.name).join(", "));
    
    // Try different British voices - prefer female voices as requested
    let selectedVoice = null;
    
    // Try to find female British voices first (Libby, Maisie, or Sonia)
    selectedVoice = britishVoices.find(voice => 
      voice.name.includes("Libby") || voice.name.includes("Maisie") || voice.name.includes("Sonia")
    );
    
    // If not found, try any British voice
    if (!selectedVoice && britishVoices.length > 0) {
      selectedVoice = britishVoices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using British voice:", selectedVoice.name);
    } else {
      console.log("No British voice found, using default voice");
    }
    
    // Set voice parameters
    utterance.pitch = 1.0; 
    utterance.rate = 1.1;  // Slightly faster as requested
    
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
      
      // Display a message to indicate song is now playing
      console.log("ZIG SPEECH COMPLETE - PLAYING J. COLE BEAT (WILL NAVIGATE TO C12 WHEN DONE)");
      
      // Add a visual indicator that speech is done and song is playing
      const songReadyMessage = document.createElement('div');
      songReadyMessage.className = 'song-ready-message';
      songReadyMessage.innerHTML = `
        <div class="song-message">
          <p>PLAYING SONG - WILL NAVIGATE TO C12 PLATFORM WHEN COMPLETE</p>
        </div>
      `;
      songReadyMessage.style.position = 'fixed';
      songReadyMessage.style.bottom = '80px';
      songReadyMessage.style.right = '20px';
      songReadyMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      songReadyMessage.style.color = '#00ffff';
      songReadyMessage.style.padding = '10px 15px';
      songReadyMessage.style.borderRadius = '5px';
      songReadyMessage.style.border = '1px solid #00ffff';
      songReadyMessage.style.zIndex = '1000';
      songReadyMessage.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
      songReadyMessage.style.fontFamily = 'Courier New, monospace';
      songReadyMessage.style.fontSize = '14px';
      songReadyMessage.style.textTransform = 'uppercase';
      document.body.appendChild(songReadyMessage);
      
      // Start playing the J. Cole beat
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic) {
        audioStore.backgroundMusic.currentTime = 0; // Start from the beginning
        audioStore.backgroundMusic.play().catch(e => {
          console.log("Could not auto-play music after speech:", e);
        });
        console.log("Started playing J. Cole beat after Zig's speech");
      }
      
      // Remove the message after 10 seconds
      setTimeout(() => {
        if (songReadyMessage.parentNode) {
          songReadyMessage.parentNode.removeChild(songReadyMessage);
        }
      }, 10000);
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

  // Load audio elements and set up auto-navigation
  useEffect(() => {
    // Load the J. Cole beat as background music
    const backgroundMusic = new Audio("/sounds/background-beat.mp3");
    
    // Music can loop since we'll navigate based on timer, not end of music
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
    
    console.log("J. Cole beat loaded. Will navigate to C12 Platform after 30 seconds");
    
    // Set up timer for auto-navigation after 30 seconds
    const navigationTimer = setTimeout(() => {
      console.log("30 seconds elapsed - navigating to C12 Platform");
      
      // Show a 3-second countdown notification before navigating
      const countdownNotification = document.createElement('div');
      countdownNotification.className = 'countdown-notification';
      countdownNotification.style.position = 'fixed';
      countdownNotification.style.top = '50%';
      countdownNotification.style.left = '50%';
      countdownNotification.style.transform = 'translate(-50%, -50%)';
      countdownNotification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      countdownNotification.style.color = '#00ffff';
      countdownNotification.style.padding = '20px 30px';
      countdownNotification.style.borderRadius = '5px';
      countdownNotification.style.border = '2px solid #00ffff';
      countdownNotification.style.zIndex = '1000';
      countdownNotification.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.7)';
      countdownNotification.style.fontFamily = 'Courier New, monospace';
      countdownNotification.style.fontSize = '24px';
      countdownNotification.style.textTransform = 'uppercase';
      countdownNotification.style.textAlign = 'center';
      countdownNotification.innerHTML = 'Navigating to C12 Platform in 3...';
      document.body.appendChild(countdownNotification);
      
      // Countdown from 3 to 1 before navigating
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          countdownNotification.innerHTML = `Navigating to C12 Platform in ${countdown}...`;
        } else {
          clearInterval(countdownInterval);
          // Navigate to the C12 Platform
          window.location.href = '/c12';
        }
      }, 1000);
    }, 30000); // 30 seconds timer
    
    return () => {
      // Clean up
      clearTimeout(navigationTimer);
      backgroundMusic.pause();
      backgroundMusic.src = "";
    };
  }, []);

  const controls = useControls();

  return (
    <>
      {/* Twinkling stars background animation */}
      <div className="stars"></div>
      
      {/* Enter C12 Platform button */}
      <div
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #00ffff',
          borderRadius: '5px',
          padding: '12px 25px',
          color: '#00ffff',
          fontSize: '16px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
          animation: 'pulse 2s infinite',
          fontFamily: 'Courier New, monospace',
          letterSpacing: '1px',
          textAlign: 'center',
        }}
        onClick={() => window.location.href = '/c12'}
      >
        Enter C12 Platform
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
