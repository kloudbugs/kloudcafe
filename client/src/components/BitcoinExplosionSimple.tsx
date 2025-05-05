import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface BitcoinExplosionSimpleProps {
  position: THREE.Vector3;
  color?: string;
  count?: number;
  onComplete?: () => void;
}

const BitcoinExplosionSimple: React.FC<BitcoinExplosionSimpleProps> = ({
  position,
  color = '#ffcc00',
  count = 20,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const completedRef = useRef(false);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current || completedRef.current) return;
    
    timeRef.current += delta;
    
    // Scale group up and down for simple explosion effect
    const progress = Math.min(timeRef.current / 2, 1); // 2 second duration
    
    if (progress < 0.5) {
      // Expanding phase
      const scale = progress * 2;
      groupRef.current.scale.set(scale, scale, scale);
    } else {
      // Contracting phase
      const scale = 1 - (progress - 0.5) * 2;
      groupRef.current.scale.set(scale, scale, scale);
    }
    
    // Rotate group
    groupRef.current.rotation.y += delta * 2;
    
    // Check if animation is complete
    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      if (onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Simple spheres for particles */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Bitcoin symbol */}
      <sprite scale={[1, 1, 1]}>
        <spriteMaterial
          map={new THREE.TextureLoader().load("/images/bitcoin_symbol.svg")}
          transparent
          opacity={0.8}
          color={color}
          toneMapped={false}
          depthTest={false}
        />
      </sprite>
    </group>
  );
};

export default BitcoinExplosionSimple;