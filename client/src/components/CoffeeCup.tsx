import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CoffeeCupProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  steamColor?: string;
}

export default function CoffeeCup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#5a189a',
  steamColor = '#a5b4fc'
}: CoffeeCupProps) {
  const cupRef = useRef<THREE.Group>(null);
  const steamRefs = Array(5).fill(0).map(() => useRef<THREE.Mesh>(null));
  
  // Animated steam
  useFrame((state) => {
    if (!cupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle cup hover animation
    cupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
    
    // Animate steam particles
    steamRefs.forEach((ref, i) => {
      if (ref.current) {
        const offset = i * 0.5;
        // Move up with some side-to-side motion
        ref.current.position.y += 0.003 + Math.sin(time * 0.8 + offset) * 0.001;
        ref.current.position.x = Math.sin(time * 0.5 + offset) * 0.1;
        
        // Reset position when it gets too high
        if (ref.current.position.y > 0.8) {
          ref.current.position.y = 0.2;
        }
        
        // Fade out as it rises
        const material = ref.current.material as THREE.MeshStandardMaterial;
        material.opacity = Math.max(0, 0.7 - ref.current.position.y * 0.8);
      }
    });
  });

  return (
    <group 
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={scale}
      ref={cupRef}
    >
      {/* Cup body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.22, 16]} />
        <MeshWobbleMaterial 
          color={color} 
          factor={0.1} 
          speed={1} 
          metalness={0.8}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Coffee inside cup */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.05, 16]} />
        <meshStandardMaterial 
          color="#4c1d95" 
          roughness={0.2}
          metalness={0.7}
          emissive="#4c1d95"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Handle */}
      <mesh position={[0.18, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Steam particles */}
      {Array(5).fill(0).map((_, i) => {
        const yPos = 0.2 + i * 0.1;
        const xOffset = Math.sin(i * 0.5) * 0.05;
        return (
          <mesh 
            key={i} 
            position={[xOffset, yPos, 0]} 
            ref={steamRefs[i]}
          >
            <sphereGeometry args={[0.02 - i * 0.003, 6, 6]} />
            <meshStandardMaterial 
              color={steamColor}
              transparent={true}
              opacity={0.7 - i * 0.1}
              emissive={steamColor}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Glow effect */}
      <pointLight 
        position={[0, 0.1, 0]} 
        distance={0.5} 
        intensity={1} 
        color={color} 
      />
    </group>
  );
}