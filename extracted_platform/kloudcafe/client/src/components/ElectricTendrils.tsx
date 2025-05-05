import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElectricTendrilsProps {
  count?: number;
  length?: number;
  color?: string;
  width?: number;
  messageDisplayTime?: number;
}

const ElectricTendrils: React.FC<ElectricTendrilsProps> = ({
  count = 8,
  length = 3,
  color = '#00ffff',
  width = 0.1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create tendrils data
  const tendrilsData = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      
      // Number of segments in this tendril
      const segments = Math.floor(5 + Math.random() * 5);
      
      // Points along the tendril
      const points = Array.from({ length: segments }).map((_, i) => {
        const t = i / (segments - 1);
        return direction.clone().multiplyScalar(t * length);
      });
      
      // Store the original points for animation
      const originalPoints = points.map(p => p.clone());
      
      return {
        direction,
        segments,
        points,
        originalPoints,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        width: width * (0.8 + Math.random() * 0.4),
        color: new THREE.Color(color).offsetHSL(
          Math.random() * 0.1 - 0.05,
          Math.random() * 0.2,
          Math.random() * 0.2 - 0.1
        )
      };
    });
  }, [count, length, color, width]);
  
  // Animation for the tendrils
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    tendrilsData.forEach((tendril, i) => {
      for (let j = 0; j < tendril.segments; j++) {
        const t = j / (tendril.segments - 1);
        const originalPoint = tendril.originalPoints[j];
        const point = tendril.points[j];
        
        // Keep first point at origin
        if (j === 0) {
          point.set(0, 0, 0);
          continue;
        }
        
        // Apply a wave-like motion
        const noiseScale = 0.1 + t * 0.3; // More noise at the end
        const frequency = 1.5;
        const waveX = Math.sin(time * frequency + tendril.phase + j * 0.2) * noiseScale;
        const waveY = Math.cos(time * frequency * 0.7 + tendril.phase + j * 0.3) * noiseScale;
        const waveZ = Math.sin(time * frequency * 1.2 + tendril.phase + j * 0.5) * noiseScale;
        
        // Apply the noise to the original position
        point.copy(originalPoint);
        point.x += waveX * t * length;
        point.y += waveY * t * length;
        point.z += waveZ * t * length;
      }
    });
    
    // Rotate the entire group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
    }
  });

  // No need for custom shader material, we'll use meshBasicMaterial instead
  useFrame(({ clock }) => {
    // Rotate the entire group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {tendrilsData.map((tendril, i) => (
        <mesh key={i}>
          <tubeGeometry 
            args={[
              new THREE.CatmullRomCurve3(tendril.points),
              tendril.segments * 3, // tubular segments
              tendril.width * 0.2,  // radius
              8,                    // radial segments
              false                 // closed
            ]} 
          />
          <meshBasicMaterial
            color={tendril.color}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Add small glowing orbs at the end of each tendril */}
      {tendrilsData.map((tendril, i) => (
        <mesh key={`orb-${i}`} position={tendril.points[tendril.points.length - 1]}>
          <sphereGeometry args={[tendril.width * 0.5, 8, 8]} />
          <meshBasicMaterial 
            color={tendril.color} 
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ElectricTendrils;