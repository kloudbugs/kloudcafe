import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Html } from "@react-three/drei";
import Cell from "./components/Cell";
import Environment from "./components/Environment";
import BackgroundParticles from "./components/BackgroundParticles";
import MouseInteractionLayer from "./components/MouseInteractionLayer";
import PulseWave from "./components/PulseWave";
import ControlPanel from "./components/ui/ControlPanel";
import OrbitingLogo from "./components/OrbitingLogo";
import StarSparkles from "./components/StarSparkles";
import MinerTitle from "./components/MinerTitle";
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

  // Debug
  useEffect(() => {
    console.log("App component mounted");
    console.log("Is audio muted:", isMuted);
    console.log("Color scheme:", controls.colorScheme);
  }, []);

  return (
    <>
      {/* Twinkling stars background animation */}
      <div className="stars"></div>
      
      {/* Fallback big flashy title outside of Three.js */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        textAlign: 'center',
        fontFamily: 'Orbitron, sans-serif',
        animation: 'pulse 2s infinite'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          padding: '20px 40px',
          borderRadius: '15px',
          border: '2px solid #9900ff',
          boxShadow: '0 0 30px rgba(153,0,255,0.6), 0 0 60px rgba(0,255,204,0.3)'
        }}>
          <h1 style={{
            fontSize: '4rem',
            background: 'linear-gradient(to right, #9900ff, #00ffcc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            letterSpacing: '3px',
            textShadow: '0 0 5px rgba(153,0,255,0.5)',
          }}>KLOUDBUGS CAFE</h1>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#ffcc00',
            margin: 0,
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,204,0,0.7), 0 0 20px rgba(255,100,0,0.5)',
            letterSpacing: '2px',
          }}>ZIG-MINER</h2>
        </div>
      </div>
      
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
        onCreated={state => {
          console.log("Canvas created, renderer:", state.gl);
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
          
          {/* KloudBugs Miner Title - 3D version */}
          <MinerTitle position={[0, 3.5, 0]} scale={1.5} />
          
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
