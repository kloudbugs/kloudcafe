import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Environment setup for the cell visualization
const Environment: React.FC = () => {
  const { scene } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // Set up the scene environment once on component mount
  useEffect(() => {
    // Save original scene background if needed later
    const originalBackground = scene.background;
    
    // Configure the scene
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    // Add some subtle particles in the background
    createBackgroundParticles();
    
    // Cleanup function
    return () => {
      scene.background = originalBackground;
      scene.fog = null;
    };
  }, [scene]);
  
  // Create subtle background particles for depth
  const createBackgroundParticles = () => {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Create randomly positioned particles in a sphere around the main cell
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create material for particles
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x555555,
      size: 0.05,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    
    // Create the particle system and add to scene
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
  };
  
  return (
    <>
      {/* Basic ambient light for overall illumination */}
      <ambientLight ref={ambientLightRef} intensity={0.2} color="#aaaaff" />
      
      {/* Directional light for subtle highlights */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.5} 
        color="#ffaa88" 
      />
      
      {/* Backlight for depth */}
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={0.2} 
        color="#8888ff" 
      />
    </>
  );
};

export default Environment;
