import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Html } from "@react-three/drei";
import Cell from "./components/Cell";
import Environment from "./components/Environment";
import BackgroundParticles from "./components/BackgroundParticles";
import MouseInteractionLayer from "./components/MouseInteractionLayer";
import PulseWave from "./components/PulseWave";
import MiningGrid from "./components/MiningGrid";
import ControlPanel from "./components/ui/ControlPanel";
import Crown from "./components/Crown";
import StarSparkles from "./components/StarSparkles";
import { useAudio } from "./lib/stores/useAudio";
import { useControls } from "./lib/stores/useControls";

// Main App component
function App() {
  const [showPerformance, setShowPerformance] = useState(false);
  const { toggleMute, isMuted } = useAudio();

  // Toggle stats with 'p' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

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
      
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        <button
          onClick={toggleMute}
          className={`control-btn ${isMuted ? 'muted' : 'unmuted'}`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <span className="mr-1">{isMuted ? "🔇" : "🔊"}</span>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
      
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
          <MiningGrid
            width={24}
            height={18}
            cellSize={0.15}
            maxBlockSize={5}
          />
          <MouseInteractionLayer visible={controls.interactionEnabled} />
          
          {/* KloudBugs Title */}
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
                }}>KLOUDBUGS</h1>
                <p className="miner-text" style={{ 
                  fontSize: '2.5rem', 
                  margin: '0.5rem 0 0',
                  color: 'white',
                  background: 'linear-gradient(45deg, #ffd700, #ffb700, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6)',
                  fontWeight: 'bold',
                  letterSpacing: '5px',
                  transform: 'scale(1.05)'
                }}>ZIG-MINER</p>
              </div>
            </Html>
          </group>
          
          {/* Crown at the top */}
          <Crown 
            size={1.2} 
            pointCount={7} 
            color="#ffd700" 
            gemColor="#9d4edd"
            position={[0, 5, 0]}
          />
          
          {/* Sparkle stars around the scene */}
          <StarSparkles 
            count={15} 
            radius={8} 
            size={0.15} 
            color="#ffffff" 
          />
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
