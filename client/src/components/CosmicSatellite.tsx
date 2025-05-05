import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSatelliteProps {
  position?: [number, number, number];
  scale?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  baseColor?: string;
  accentColor?: string;
  glowColor?: string;
}

export default function CosmicSatellite({
  position = [0, 0, 0],
  scale = 1,
  orbitRadius = 10,
  orbitSpeed = 0.1,
  rotationSpeed = 0.5,
  baseColor = '#5a189a',
  accentColor = '#7b2cbf',
  glowColor = '#ffd700'
}: CosmicSatelliteProps) {
  const satelliteRef = useRef<THREE.Group>(null);
  const panelsRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const timeRef = useRef<number>(0);
  
  // Set up the orbit path
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);
  
  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    timeRef.current = time;
    
    // Orbit animation
    if (orbitRef.current && satelliteRef.current) {
      orbitRef.current.rotation.y = time * orbitSpeed;
      
      // Self rotation
      satelliteRef.current.rotation.y += delta * rotationSpeed;
      
      // Wobble animation for the satellite
      satelliteRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      satelliteRef.current.rotation.z = Math.cos(time * 0.3) * 0.1;
    }
    
    // Solar panel animation
    if (panelsRef.current) {
      // Slight adjustment based on orbit position to simulate tracking the sun
      panelsRef.current.rotation.z = Math.sin(time * 0.2) * 0.2;
    }
    
    // Dish tracking animation
    if (dishRef.current) {
      // Dish follows a tracking pattern
      dishRef.current.rotation.y = Math.sin(time * 0.3) * 0.7;
      dishRef.current.rotation.x = Math.cos(time * 0.4) * 0.4;
    }
  });
  
  return (
    <group ref={orbitRef}>
      {/* Orbit path visualization (optional) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Satellite positioned at orbit distance */}
      <group ref={satelliteRef} position={[orbitRadius, 0, 0]} scale={scale}>
        {/* Main satellite body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <meshStandardMaterial 
            color={baseColor} 
            metalness={0.8} 
            roughness={0.2}
            emissive={baseColor}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Satellite details - antenna */}
        <mesh position={[0.8, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        
        <mesh position={[0.8, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color={glowColor} 
            emissive={glowColor} 
            emissiveIntensity={1}
            metalness={0.7} 
            roughness={0.3} 
          />
        </mesh>
        
        {/* Communication dish */}
        <group position={[-0.9, 0.2, 0]} ref={dishRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.5, 0.15, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial 
              color={accentColor} 
              side={THREE.DoubleSide} 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
          
          <group position={[0, 0, -0.1]} rotation={[Math.PI/2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
              <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>
        
        {/* Solar panels */}
        <group ref={panelsRef}>
          {/* Left panel */}
          <group position={[0, 0, 1]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.05, 1.0]} />
              <meshStandardMaterial 
                color={'#2c3e50'} 
                metalness={0.5} 
                roughness={0.2}
              />
            </mesh>
            
            {/* Solar cells */}
            <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.01, 0.8]} />
              <meshStandardMaterial 
                color={'#3366ff'} 
                metalness={0.8} 
                roughness={0.2}
                emissive={'#3366ff'}
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Panel arm */}
            <mesh position={[0, 0, -0.6]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.2]} />
              <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
          
          {/* Right panel */}
          <group position={[0, 0, -1]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.05, 1.0]} />
              <meshStandardMaterial 
                color={'#2c3e50'} 
                metalness={0.5} 
                roughness={0.2}
              />
            </mesh>
            
            {/* Solar cells */}
            <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.01, 0.8]} />
              <meshStandardMaterial 
                color={'#3366ff'} 
                metalness={0.8} 
                roughness={0.2}
                emissive={'#3366ff'}
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Panel arm */}
            <mesh position={[0, 0, 0.6]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.2]} />
              <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>
        
        {/* Thrusters */}
        <mesh position={[-0.8, -0.2, 0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.3, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        
        <mesh position={[-0.8, -0.2, -0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.3, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Thruster glow */}
        <pointLight position={[-1.0, -0.2, 0.3]} distance={2} intensity={0.5} color={glowColor} />
        <pointLight position={[-1.0, -0.2, -0.3]} distance={2} intensity={0.5} color={glowColor} />
        
        {/* Glowing parts */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial 
            color={glowColor} 
            emissive={glowColor} 
            emissiveIntensity={1}
            metalness={0.7} 
            roughness={0.3} 
          />
        </mesh>
        
        {/* Small details */}
        {[0.4, 0, -0.4].map((z, i) => (
          <mesh key={i} position={[0.5, 0.3, z]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? glowColor : accentColor} 
              emissive={i % 2 === 0 ? glowColor : accentColor}
              emissiveIntensity={i % 2 === 0 ? 0.5 : 0.2}
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}