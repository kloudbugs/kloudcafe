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
  coreColor = '#ffffff',
  outerColor = '#ff1a75',
  opacity = 0.8
}) => {
  const galaxyRef = useRef<THREE.Group>(null);
  
  // Create galaxy using meshes for better visibility
  const galaxyObjects = useMemo(() => {
    const objects = [];
    
    // Create a central bright core
    objects.push({
      type: 'core',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(radius * 0.1, radius * 0.05, radius * 0.1),
      color: coreColor,
      intensity: 1.0
    });
    
    // Create spiral arms using discs
    const armCount = 4;
    
    for (let arm = 0; arm < armCount; arm++) {
      const baseAngle = (arm / armCount) * Math.PI * 2;
      const armLength = radius * 0.6;
      const segments = 30;
      
      for (let i = 0; i < segments; i++) {
        const distanceRatio = i / segments;
        const distance = radius * 0.12 + distanceRatio * armLength;
        const spiralFactor = 4;
        const angle = baseAngle + distanceRatio * spiralFactor;
        
        // Calculate position along spiral
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.sin(distanceRatio * Math.PI) * radius * 0.02;
        
        // Size decreases along the arm
        const scale = radius * (0.1 - distanceRatio * 0.05);
        
        // Color transitions from core to outer
        const colorMix = distanceRatio;
        
        objects.push({
          type: 'arm',
          position: new THREE.Vector3(x, y, z),
          scale: new THREE.Vector3(scale, scale * 0.1, scale),
          rotation: new THREE.Euler(0, angle, 0),
          color: colorMix < 0.5 ? coreColor : outerColor,
          intensity: 1 - distanceRatio * 0.7
        });
      }
    }
    
    // Add random stars for texture
    for (let i = 0; i < 200; i++) {
      const distance = radius * (0.1 + Math.random() * 0.6);
      const angle = Math.random() * Math.PI * 2;
      
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = THREE.MathUtils.randFloatSpread(radius * 0.1);
      
      const scale = radius * 0.01 * (0.5 + Math.random() * 1.5);
      
      objects.push({
        type: 'star',
        position: new THREE.Vector3(x, y, z),
        scale: new THREE.Vector3(scale, scale, scale),
        color: Math.random() > 0.7 ? coreColor : outerColor,
        intensity: 0.7 + Math.random() * 0.3
      });
    }
    
    return objects;
  }, [radius, coreColor, outerColor]);
  
  // Animate the galaxy
  useFrame((_, delta) => {
    if (galaxyRef.current) {
      // Rotate slowly
      galaxyRef.current.rotation.y += delta * 0.03;
    }
  });
  
  return (
    <group ref={galaxyRef} rotation={[Math.PI / 5, 0, 0]}>
      {/* Background haze */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial 
          color="#9900ff" 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Central intense glow */}
      <mesh>
        <sphereGeometry args={[radius * 0.2, 32, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Galaxy objects */}
      {galaxyObjects.map((obj, index) => {
        if (obj.type === 'core') {
          return (
            <mesh 
              key={`core-${index}`} 
              position={obj.position}
              scale={obj.scale}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial 
                color={obj.color}
                transparent 
                opacity={obj.intensity * opacity}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        } else if (obj.type === 'arm') {
          return (
            <mesh 
              key={`arm-${index}`} 
              position={obj.position}
              scale={obj.scale}
              rotation={obj.rotation}
            >
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshBasicMaterial 
                color={obj.color}
                transparent 
                opacity={obj.intensity * opacity}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        } else {
          return (
            <mesh 
              key={`star-${index}`} 
              position={obj.position}
              scale={obj.scale}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial 
                color={obj.color}
                transparent 
                opacity={obj.intensity * opacity}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        }
      })}
    </group>
  );
};

export default MilkyWay;