import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ElectricHandSimpleProps {
  position: THREE.Vector3;
  target?: THREE.Vector3;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

const ElectricHandSimple: React.FC<ElectricHandSimpleProps> = ({
  position,
  target = new THREE.Vector3(position.x, position.y + 2, position.z),
  color = '#00ffff',
  duration = 2.0,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const animationTime = useRef<number>(0);
  const completed = useRef<boolean>(false);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current || completed.current) return;
    
    // Update animation time
    animationTime.current += delta;
    const progress = Math.min(animationTime.current / duration, 1);
    
    // Update scale based on progress
    if (groupRef.current) {
      if (progress < 0.3) {
        // Grow phase
        groupRef.current.scale.setScalar(progress / 0.3);
      } else if (progress > 0.7) {
        // Fade out phase
        groupRef.current.scale.setScalar(1 - (progress - 0.7) / 0.3);
      } else {
        // Full intensity phase
        groupRef.current.scale.setScalar(1);
      }
    }
    
    // Check if animation is complete
    if (progress >= 1.0 && !completed.current) {
      completed.current = true;
      if (onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Simple spheres for now */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Second sphere at target position */}
      <mesh position={target.clone().sub(position)}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Line connecting the two */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute 
            attach="attributes-position" 
            args={[new Float32Array([
              0, 0, 0,
              target.x - position.x, 
              target.y - position.y, 
              target.z - position.z
            ]), 3]} 
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>
    </group>
  );
};

export default ElectricHandSimple;