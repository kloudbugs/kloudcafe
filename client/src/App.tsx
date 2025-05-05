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
          
          {/* KloudBugs Miner Title - 3D version (moved higher) */}
          <MinerTitle position={[0, 5.0, 0]} scale={1.5} />
          
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
