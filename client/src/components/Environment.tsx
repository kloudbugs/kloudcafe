import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Environment setup for the mining visualization
const Environment: React.FC = () => {
  const { scene } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // Set up the scene environment once on component mount
  useEffect(() => {
    // Save original scene background if needed later
    const originalBackground = scene.background;
    
    // Configure the scene with subtle fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    // Add starfield particles in the background
    createStarfieldParticles();
    
    // Cleanup function
    return () => {
      scene.background = originalBackground;
      scene.fog = null;
    };
  }, [scene]);
  
  // Create a cosmic starfield for background depth
  const createStarfieldParticles = () => {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create randomly positioned particles in a sphere around the mining grid
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random star colors - mostly white/blue with occasional gold/purple
      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        // Gold stars (10%)
        colors[i3] = 1.0;  // R
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;  // G
        colors[i3 + 2] = 0.3;  // B
      } else if (colorChoice > 0.8) {
        // Purple stars (10%)
        colors[i3] = 0.5 + Math.random() * 0.3;  // R
        colors[i3 + 1] = 0.2;  // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2;  // B
      } else {
        // White/blue stars (80%)
        colors[i3] = 0.8 + Math.random() * 0.2;  // R
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;  // G
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;  // B
      }
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create material for particles
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      sizeAttenuation: true,
    });
    
    // Create the particle system and add to scene
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
  };
  
  return (
    <>
      {/* Base ambient light for overall illumination */}
      <ambientLight ref={ambientLightRef} intensity={0.3} color="#9d4edd" />
      
      {/* Main directional light (gold-tinted) */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#ffd700" 
        castShadow
      />
      
      {/* Purple accent light */}
      <directionalLight 
        position={[-8, 5, 8]} 
        intensity={0.5} 
        color="#9d4edd" 
      />
      
      {/* Backlight for depth */}
      <directionalLight 
        position={[0, -10, -10]} 
        intensity={0.3} 
        color="#3a0ca3" 
      />
      
      {/* Subtle point lights around the grid */}
      <pointLight position={[5, -5, 5]} intensity={0.4} color="#ffd700" distance={15} />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#9d4edd" distance={15} />
      
      {/* Spotlight to focus on the mining grid */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.0}
        color="#ffffff"
        distance={25}
        castShadow
      />
    </>
  );
};

export default Environment;
