import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Html } from "@react-three/drei";
import * as THREE from "three";
import Environment from "./components/Environment";
import MiningGrid from "./components/MiningGrid";
import ControlPanel from "./components/ui/ControlPanel";
import { useAudio } from "./lib/stores/useAudio";
import { useControls } from "./lib/stores/useControls";

// Main App component
function App() {
  const [showPerformance, setShowPerformance] = useState(false);

  // Toggle stats with 'p' key and sound with 'm' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        // Get audio store and toggle mute
        const audioStore = useAudio.getState();
        audioStore.toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load audio elements
  useEffect(() => {
    // Function to preload an audio file and return a promise
    const preloadAudio = (src: string): Promise<HTMLAudioElement> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        
        audio.addEventListener('canplaythrough', () => {
          resolve(audio);
        }, { once: true });
        
        audio.addEventListener('error', (e) => {
          console.error(`Error loading audio ${src}:`, e);
          reject(new Error(`Failed to load audio: ${src}`));
        }, { once: true });
        
        audio.src = src;
        audio.load();
      });
    };
    
    async function setupAudio() {
      try {
        console.log("Loading audio files...");
        
        // Preload all audio files in parallel
        const [backgroundMusic, hitSound, successSound] = await Promise.all([
          preloadAudio("/sounds/background.mp3"),
          preloadAudio("/sounds/hit.mp3"),
          preloadAudio("/sounds/success.mp3")
        ]);
        
        // Configure audio properties
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.4;
        hitSound.volume = 0.5;
        successSound.volume = 0.5;
        
        // Store in Zustand
        const audioStore = useAudio.getState();
        audioStore.setBackgroundMusic(backgroundMusic);
        audioStore.setHitSound(hitSound);
        audioStore.setSuccessSound(successSound);
        
        console.log("Audio loaded successfully. Press 'M' to toggle sound.");
        
        // Add a test button click to help with audio autoplay restrictions
        const unlockAudio = () => {
          // Try to play and immediately pause to unlock audio
          backgroundMusic.play().then(() => {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            document.body.removeEventListener('click', unlockAudio);
            console.log("Audio unlocked by user interaction");
          }).catch(e => {
            console.warn("Couldn't unlock audio:", e);
          });
        };
        
        document.body.addEventListener('click', unlockAudio, { once: false });
        
      } catch (error) {
        console.error("Failed to load audio:", error);
      }
    }
    
    setupAudio();
    
    return () => {
      const { backgroundMusic } = useAudio.getState();
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.src = "";
      }
      document.body.removeEventListener('click', () => {});
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
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 1000 }}
        gl={{ 
          antialias: true,
          powerPreference: "default",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        {showPerformance && <Stats />}
        
        <color attach="background" args={["#0a0a0a"]} />
        
        <Suspense fallback={null}>
          <Environment />
          
          {/* Just the Mining Grid with nothing else */}
          <MiningGrid
            width={24}
            height={24} 
            depth={24}
            cellSize={0.12} 
            maxBlockSize={3}
          />
          
          {/* Title */}
          <group position={[0, 7, 0]}>
            <Html
              transform
              center
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px #00ffcc, 0 0 20px #4cccff',
                width: '300px',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <div>
                <h1 style={{ 
                  fontSize: '3rem', 
                  margin: '0',
                  background: 'linear-gradient(to bottom, #ffd700, #d4af37)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 10px rgba(157, 78, 221, 0.8), 0 0 20px rgba(157, 78, 221, 0.5)',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
                }}>ZIG-MINER</h1>
              </div>
            </Html>
          </group>
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
