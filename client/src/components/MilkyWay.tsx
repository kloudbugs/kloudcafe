import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MilkyWayProps {
  radius?: number;
  particleCount?: number;
  coreColor?: string;
  outerColor?: string;
  opacity?: number;
}

const MilkyWay: React.FC<MilkyWayProps> = ({
  radius = 100,
  particleCount = 15000,
  coreColor = '#9900ff',
  outerColor = '#00ffff',
  opacity = 0.7
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const galaxyRef = useRef<THREE.Group>(null);
  
  // Generate galaxy particles in a spiral pattern
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const armCount = 5;
    const armWidth = 0.15;
    const coreSize = 0.6;
    const spiralFactor = 3;
    
    const coreColorVec = new THREE.Color(coreColor);
    const outerColorVec = new THREE.Color(outerColor);
    const tempColor = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Calculate galaxy position
      const armAngle = Math.random() * Math.PI * 2;
      const armRadius = Math.random();
      
      // Create a spiral pattern
      const radialDistance = armRadius * radius;
      
      // Random height based on distance
      const height = THREE.MathUtils.randFloatSpread(radius * 0.15) * 
        (armRadius < coreSize ? 0.2 : armRadius);
      
      // Add variance to create thickness
      const spinAngle = armAngle + armRadius * spiralFactor;
      
      // Randomize points to create a messy galaxy
      const offset = THREE.MathUtils.randFloatSpread(armWidth) * 
        radialDistance * (armRadius < coreSize ? 0.5 : 1);
      
      // Calculate final position
      positions[i3] = Math.cos(spinAngle) * radialDistance + 
        Math.cos(spinAngle + Math.PI/2) * offset;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(spinAngle) * radialDistance + 
        Math.sin(spinAngle + Math.PI/2) * offset;
      
      // Create colors (core to outer gradient)
      const colorMix = Math.min(1, (armRadius / 0.8) + 0.2);
      tempColor.copy(coreColorVec).lerp(outerColorVec, colorMix);
      
      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;
      
      // Random sizes
      sizes[i] = (armRadius < coreSize ? 3.0 : 1.5) * (Math.random() * 0.5 + 0.5);
    }
    
    return { positions, colors, sizes };
  }, [particleCount, radius, coreColor, outerColor]);
  
  // Animate the galaxy
  useFrame((_, delta) => {
    if (galaxyRef.current) {
      // Rotate slowly
      galaxyRef.current.rotation.y += delta * 0.03;
    }
    
    if (pointsRef.current) {
      // Make particles twinkle
      const sizes = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        // Apply a slow sine wave to make stars twinkle
        const sinOffset = Math.sin(Date.now() * 0.001 + i) * 0.1 + 0.9;
        sizes.array[i] = particles.sizes[i] * sinOffset;
      }
      sizes.needsUpdate = true;
    }
  });
  
  return (
    <group ref={galaxyRef} rotation={[Math.PI / 6, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={opacity}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default MilkyWay;