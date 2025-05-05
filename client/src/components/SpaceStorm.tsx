import React, { useRef, useMemo } from 'react';
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
  const stormGroupRef = useRef<THREE.Group>(null);
  const timeActive = useRef<number>(0);
  const active = useRef<boolean>(true);
  
  // Create center glow
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Create lightning arcs
  const arcs = useMemo(() => {
    const arcCount = 8;
    const arcsData = [];
    
    for (let i = 0; i < arcCount; i++) {
      // Random start and end positions
      const startRadius = radius * 0.1;
      const endRadius = radius * (0.5 + Math.random() * 0.3);
      
      // Random angles to place the start and end points
      const startAngle = Math.random() * Math.PI * 2;
      const startHeight = THREE.MathUtils.randFloatSpread(radius * 0.2);
      
      const startPoint = new THREE.Vector3(
        Math.cos(startAngle) * startRadius,
        startHeight,
        Math.sin(startAngle) * startRadius
      );
      
      // Create random end point
      const endAngle = startAngle + (Math.random() * Math.PI * 0.5 - Math.PI * 0.25);
      const endHeight = startHeight + THREE.MathUtils.randFloatSpread(radius * 0.5);
      
      const endPoint = new THREE.Vector3(
        Math.cos(endAngle) * endRadius,
        endHeight,
        Math.sin(endAngle) * endRadius
      );
      
      // Create points along the arc
      const arcPoints = [];
      const segmentCount = 8;
      
      for (let s = 0; s <= segmentCount; s++) {
        const t = s / segmentCount;
        
        // Interpolate between start and end, with some randomness
        const midPoint = startPoint.clone().lerp(endPoint, t);
        
        // Add some randomness to intermediate points (not start/end)
        if (s > 0 && s < segmentCount) {
          const jitterAmount = radius * 0.1 * Math.sin(t * Math.PI);
          midPoint.x += THREE.MathUtils.randFloatSpread(jitterAmount);
          midPoint.y += THREE.MathUtils.randFloatSpread(jitterAmount);
          midPoint.z += THREE.MathUtils.randFloatSpread(jitterAmount);
        }
        
        arcPoints.push(midPoint);
      }
      
      arcsData.push({
        points: arcPoints,
        thickness: radius * (0.05 + Math.random() * 0.05),
        phase: Math.random() * Math.PI * 2,
        speed: 3 + Math.random() * 2,
        color: color
      });
    }
    
    return arcsData;
  }, [radius, color]);
  
  // Create orbs - glowing spheres that move around the storm
  const orbs = useMemo(() => {
    const orbCount = 15;
    const orbsData = [];
    
    for (let i = 0; i < orbCount; i++) {
      const orbRadius = radius * (0.2 + Math.random() * 0.6);
      const angle = Math.random() * Math.PI * 2;
      const height = THREE.MathUtils.randFloatSpread(radius * 0.5);
      
      orbsData.push({
        position: new THREE.Vector3(
          Math.cos(angle) * orbRadius,
          height,
          Math.sin(angle) * orbRadius
        ),
        size: radius * (0.1 + Math.random() * 0.1),
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: orbRadius,
        orbitHeight: height,
        color: color
      });
    }
    
    return orbsData;
  }, [radius, color]);
  
  // Create central energy rings
  const rings = useMemo(() => {
    const ringCount = 3;
    const ringsData = [];
    
    for (let i = 0; i < ringCount; i++) {
      ringsData.push({
        radius: radius * (0.2 + i * 0.1),
        thickness: radius * 0.02,
        speed: 0.5 - i * 0.1,
        phase: Math.random() * Math.PI * 2,
        color: color
      });
    }
    
    return ringsData;
  }, [radius, color]);
  
  // Animation
  useFrame((_, delta) => {
    if (!active.current) return;
    
    timeActive.current += delta * speed;
    
    // Rotate the entire storm
    if (stormGroupRef.current) {
      stormGroupRef.current.rotation.y += delta * 0.2 * speed;
    }
    
    // Pulse the core
    if (coreRef.current) {
      const scale = 1 + 0.2 * Math.sin(timeActive.current * 2);
      coreRef.current.scale.set(scale, scale, scale);
      
      // Make the core opacity pulse too
      const material = coreRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + 0.3 * Math.sin(timeActive.current * 3);
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
      {/* Core glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius * 0.2, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Energy rings */}
      {rings.map((ring, index) => (
        <group key={`ring-${index}`} rotation={[Math.PI/2, 0, ring.phase]}>
          <mesh>
            <torusGeometry args={[ring.radius, ring.thickness, 16, 64]} />
            <meshBasicMaterial 
              color={ring.color} 
              transparent 
              opacity={0.7} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
      
      {/* Lightning arcs */}
      {arcs.map((arc, arcIndex) => (
        <group key={`arc-${arcIndex}`}>
          {arc.points.map((point, pointIndex) => {
            if (pointIndex < arc.points.length - 1) {
              // Draw a cylinder between each pair of points
              const nextPoint = arc.points[pointIndex + 1];
              const midpoint = new THREE.Vector3().addVectors(point, nextPoint).multiplyScalar(0.5);
              
              // Calculate the direction and length
              const direction = new THREE.Vector3().subVectors(nextPoint, point);
              const length = direction.length();
              
              // Create quaternion from direction
              const quaternion = new THREE.Quaternion();
              const up = new THREE.Vector3(0, 1, 0);
              quaternion.setFromUnitVectors(up, direction.normalize());
              
              return (
                <mesh 
                  key={`arc-segment-${arcIndex}-${pointIndex}`}
                  position={midpoint}
                  quaternion={quaternion}
                >
                  <cylinderGeometry 
                    args={[arc.thickness, arc.thickness, length, 8]} 
                  />
                  <meshBasicMaterial 
                    color={arc.color}
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              );
            }
            return null;
          })}
        </group>
      ))}
      
      {/* Energy orbs */}
      {orbs.map((orb, orbIndex) => (
        <mesh 
          key={`orb-${orbIndex}`}
          position={orb.position}
        >
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial 
            color={orb.color}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[radius * 0.8, 32, 32]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default SpaceStorm;