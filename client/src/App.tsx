import { Suspense, useState, useEffect, useRef } from "react";
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
import MilkyWay from "./components/MilkyWay";
import SpaceStorm from "./components/SpaceStorm";
import { useAudio } from "./lib/stores/useAudio";
import { useControls } from "./lib/stores/useControls";
import * as THREE from "three";

// Main App component
function App() {
  const [showPerformance, setShowPerformance] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  const [spaceStorms, setSpaceStorms] = useState<{
    id: number;
    position: THREE.Vector3;
    color: string;
    radius: number;
  }[]>([]);
  const nextStormId = useRef(0);

  // Toggle stats with 'p' key, create space storm with 's'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        toggleMute();
      }
      if (e.key === "s") {
        // Add a random storm at a random position
        const position = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(10),
          THREE.MathUtils.randFloatSpread(20)
        );
        
        // Random color from cosmic palette
        const colors = ['#00ffff', '#9900ff', '#ffcc00', '#ff00cc'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const radius = 2 + Math.random() * 4;
        
        setSpaceStorms(prev => [
          ...prev, 
          { 
            id: nextStormId.current++, 
            position, 
            color, 
            radius 
          }
        ]);
        
        // Clean up old storms after some time to avoid performance issues
        if (spaceStorms.length > 5) {
          setSpaceStorms(prev => prev.slice(1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute, spaceStorms.length]);

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
      
      {/* Storm instruction */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#00ffff',
        borderRadius: '8px',
        fontFamily: 'monospace',
        zIndex: 1000,
        border: '1px solid #9900ff',
        boxShadow: '0 0 20px rgba(153, 0, 255, 0.3)'
      }}>
        Press 'S' to create cosmic storms
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
          {/* Milky Way background - large galaxy effect */}
          <MilkyWay 
            radius={150}
            particleCount={5000}
            coreColor="#9900ff"
            outerColor="#00ffcc"
            opacity={0.4}
          />
          
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
          
          {/* Dynamic space storms that can be spawned with 's' key */}
          {spaceStorms.map(storm => (
            <SpaceStorm 
              key={storm.id}
              position={storm.position}
              radius={storm.radius}
              color={storm.color}
              duration={15}
              speed={0.8}
              particleCount={300} // Reduced for better performance
              onComplete={() => {
                setSpaceStorms(prev => prev.filter(s => s.id !== storm.id));
              }}
            />
          ))}
          
          {/* Permanent space storm in a distant location */}
          <SpaceStorm 
            position={new THREE.Vector3(40, 20, -40)}
            radius={10}
            color="#ff00cc"
            duration={100000} // Effectively permanent
            speed={0.3}
            intensity={0.3}
            particleCount={200} // Reduced for better performance
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
