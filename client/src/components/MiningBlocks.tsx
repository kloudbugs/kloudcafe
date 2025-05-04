import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface MiningBlocksProps {
  count?: number;
  orbitRadius?: number;
  minDistance?: number;
  maxDistance?: number;
}

const MiningBlocks: React.FC<MiningBlocksProps> = ({
  count = 12,
  orbitRadius: baseOrbitRadius = 4,
  minDistance = 3.5,
  maxDistance = 6,
}) => {
  // Rename to avoid variable name collision
  const orbitRadius = baseOrbitRadius;
  const blocksRef = useRef<THREE.Group>(null);
  const blockRefs = useRef<THREE.Mesh[]>([]);
  
  const controls = useControls();
  const coreColor = controls.getColorByScheme('core');
  const tendrilColor = controls.getColorByScheme('tendril');
  
  // Create block geometry and materials
  const blockGeometry = useMemo(() => new THREE.BoxGeometry(0.4, 0.4, 0.4), []);
  const blockMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: 0.2,
      metalness: 0.9,
      roughness: 0.2,
    }), 
  [coreColor]);
  
  const wireMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: tendrilColor,
      emissive: tendrilColor,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    }), 
  [tendrilColor]);
  
  // Generate initial positions for blocks
  const blockData = useMemo(() => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      // Random position in a sphere around the center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      // Random rotation speed and axis
      const rotationSpeed = 0.2 + Math.random() * 0.5;
      const rotationAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      
      // Random orbit
      const orbitSpeed = 0.1 + Math.random() * 0.3;
      const blockOrbitRadius = orbitRadius * (0.8 + Math.random() * 0.4);
      const orbitPhase = Math.random() * Math.PI * 2;
      const orbitInclination = Math.random() * Math.PI * 0.3;
      
      data.push({
        position: new THREE.Vector3(x, y, z),
        rotationSpeed,
        rotationAxis,
        orbitSpeed,
        orbitRadius: blockOrbitRadius,
        orbitPhase,
        orbitInclination,
        scale: 0.7 + Math.random() * 0.6,
      });
    }
    
    return data;
  }, [count, minDistance, maxDistance, orbitRadius]);
  
  // Setup refs when component mounts
  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, count);
  }, [count]);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!blocksRef.current) return;
    
    // Update each block's position and rotation
    blockData.forEach((data, i) => {
      const blockMesh = blockRefs.current[i];
      if (!blockMesh) return;
      
      // Update orbit position
      const time = Date.now() * 0.001;
      data.orbitPhase += delta * data.orbitSpeed;
      
      // Calculate new position based on orbit
      const orbitX = Math.cos(data.orbitPhase) * data.orbitRadius;
      const orbitZ = Math.sin(data.orbitPhase) * data.orbitRadius;
      const orbitY = Math.sin(data.orbitPhase + data.orbitInclination) * data.orbitRadius * 0.3;
      
      // Apply position
      blockMesh.position.set(
        data.position.x + orbitX * 0.2,
        data.position.y + orbitY * 0.2,
        data.position.z + orbitZ * 0.2
      );
      
      // Rotate block
      blockMesh.rotateOnAxis(data.rotationAxis, delta * data.rotationSpeed);
    });
    
    // Rotate the entire group slowly if auto-rotate is enabled
    if (controls.autoRotate) {
      blocksRef.current.rotation.y += delta * controls.rotationSpeed * 0.2;
    }
  });
  
  return (
    <group ref={blocksRef}>
      {blockData.map((data, i) => (
        <group key={i} position={data.position} scale={data.scale}>
          <mesh 
            ref={el => el && (blockRefs.current[i] = el)} 
            geometry={blockGeometry} 
            material={blockMaterial}
          />
          <mesh
            geometry={blockGeometry}
            material={wireMaterial}
            scale={1.2}
          />
        </group>
      ))}
    </group>
  );
};

export default MiningBlocks;