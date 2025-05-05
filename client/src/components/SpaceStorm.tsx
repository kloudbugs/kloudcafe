import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceStormProps {
  position?: THREE.Vector3;
  radius?: number;
  particleCount?: number;
  color?: string;
  duration?: number;
  speed?: number;
  intensity?: number;
  onComplete?: () => void;
}

const SpaceStorm: React.FC<SpaceStormProps> = ({
  position = new THREE.Vector3(0, 0, 0),
  radius = 5,
  particleCount = 1000,
  color = '#00ffff',
  duration = 10,
  speed = 1,
  intensity = 1,
  onComplete
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const stormGroupRef = useRef<THREE.Group>(null);
  const timeActive = useRef<number>(0);
  const active = useRef<boolean>(true);
  
  // Create storm particles
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position in a sphere
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = radius * Math.cbrt(Math.random()); // Cube root for uniform distribution

      positions[i3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i3 + 2] = r * Math.cos(theta);
      
      // Velocity spirals outward with random variations
      const vortexFactor = 5.0;
      const spiralDirection = new THREE.Vector3(
        -positions[i3 + 1] + (Math.random() - 0.5) * 0.3,
        positions[i3] + (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.5
      ).normalize();
      
      velocities[i3] = spiralDirection.x * vortexFactor * (0.5 + Math.random() * 0.5);
      velocities[i3 + 1] = spiralDirection.y * vortexFactor * (0.5 + Math.random() * 0.5);
      velocities[i3 + 2] = spiralDirection.z * vortexFactor * (0.5 + Math.random() * 0.5);
      
      // Random sizes
      sizes[i] = 0.2 + Math.random() * 0.8;
      
      // Staggered lifetimes for continuous particles
      lifetimes[i] = Math.random() * duration;
    }
    
    return { positions, velocities, sizes, lifetimes };
  }, [particleCount, radius, duration]);
  
  // Create lightning bolts
  const lightningBolts = useMemo(() => {
    const boltCount = 15;
    const bolts = [];
    
    for (let i = 0; i < boltCount; i++) {
      // Create a central point with spikes radiating outward
      const center = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(radius * 0.5),
        THREE.MathUtils.randFloatSpread(radius * 0.5),
        THREE.MathUtils.randFloatSpread(radius * 0.5)
      );
      
      const spikeCount = 3 + Math.floor(Math.random() * 5);
      
      // Create spikes from the center
      for (let j = 0; j < spikeCount; j++) {
        const endPoint = new THREE.Vector3(
          center.x + THREE.MathUtils.randFloatSpread(radius * 0.8),
          center.y + THREE.MathUtils.randFloatSpread(radius * 0.8),
          center.z + THREE.MathUtils.randFloatSpread(radius * 0.8)
        );
        
        // Create positions for the boxes that will form the lightning
        const distance = center.distanceTo(endPoint);
        const direction = endPoint.clone().sub(center).normalize();
        const segmentCount = 3 + Math.floor(Math.random() * 5);
        const segmentLength = distance / segmentCount;
        
        // Create lightning segments
        const segments = [];
        let currentPoint = center.clone();
        
        for (let k = 0; k < segmentCount; k++) {
          // Add some randomness to the path
          const jitter = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(0.3),
            THREE.MathUtils.randFloatSpread(0.3),
            THREE.MathUtils.randFloatSpread(0.3)
          );
          
          // Move along the direction with jitter
          const nextPoint = currentPoint.clone().add(
            direction.clone().multiplyScalar(segmentLength).add(jitter)
          );
          
          // Store segment data
          segments.push({
            position: currentPoint.clone().lerp(nextPoint, 0.5),
            scale: new THREE.Vector3(0.05, segmentLength, 0.05),
            rotation: new THREE.Euler().setFromQuaternion(
              new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                nextPoint.clone().sub(currentPoint).normalize()
              )
            )
          });
          
          currentPoint = nextPoint;
        }
        
        bolts.push({
          segments,
          life: Math.random() * 2,
          maxLife: 0.5 + Math.random() * 1.5,
          hue: Math.random() * 0.1
        });
      }
    }
    
    return bolts;
  }, [radius]);
  
  // Animate the storm
  useFrame((_, delta) => {
    if (!active.current) return;
    
    timeActive.current += delta * speed;
    
    // Update storm particles
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const sizeAttribute = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update particle position based on velocity
        positions[i3] += particles.velocities[i3] * delta * speed * intensity;
        positions[i3 + 1] += particles.velocities[i3 + 1] * delta * speed * intensity;
        positions[i3 + 2] += particles.velocities[i3 + 2] * delta * speed * intensity;
        
        // Reset particles that go too far
        const distSq = positions[i3] * positions[i3] +
                       positions[i3 + 1] * positions[i3 + 1] +
                       positions[i3 + 2] * positions[i3 + 2];
        
        // Update particle lifetime
        particles.lifetimes[i] -= delta * speed;
        
        if (distSq > radius * radius * 4 || particles.lifetimes[i] <= 0) {
          // Reset particle position to inside the core
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const r = radius * Math.random() * 0.3; // Closer to center
          
          positions[i3] = r * Math.sin(theta) * Math.cos(phi);
          positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
          positions[i3 + 2] = r * Math.cos(theta);
          
          // Reset lifetime
          particles.lifetimes[i] = Math.random() * duration * 0.5 + 0.5;
        }
        
        // Make particles pulse
        sizeAttribute.array[i] = particles.sizes[i] * 
          (0.5 + 0.5 * Math.sin(timeActive.current * 5 + i * 0.1));
      }
      
      positionAttribute.needsUpdate = true;
      sizeAttribute.needsUpdate = true;
    }
    
    // Rotate the entire storm
    if (stormGroupRef.current) {
      stormGroupRef.current.rotation.y += delta * 0.2 * speed;
      stormGroupRef.current.rotation.z += delta * 0.1 * speed;
    }
    
    // Check if the storm should end
    if (timeActive.current >= duration && active.current) {
      active.current = false;
      if (onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <group position={position} ref={stormGroupRef}>
      {/* Storm particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
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
          size={0.1}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={0.8}
          color={color}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Electric core - glowing sphere in the center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius * 0.15, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.7} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Lightning bolts */}
      {lightningBolts.map((bolt, boltIndex) => (
        <group key={boltIndex}>
          {bolt.segments.map((segment, segmentIndex) => (
            <mesh 
              key={segmentIndex} 
              position={segment.position} 
              rotation={segment.rotation}
              scale={segment.scale}
            >
              <boxGeometry />
              <meshBasicMaterial 
                color={new THREE.Color(color).offsetHSL(bolt.hue, 0, 0)} 
                transparent 
                opacity={0.7 * Math.random()} 
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

export default SpaceStorm;