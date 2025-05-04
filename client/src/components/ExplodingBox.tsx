import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplodingBoxProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  glowColor?: string;
}

export function ExplodingBox({
  position = [0, 0, 0],
  size = 1.5,
  color = '#5a189a',
  glowColor = '#ffd700',
}: ExplodingBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  
  // State for animation
  const [exploded, setExploded] = useState(false);
  const [reforming, setReforming] = useState(false);
  
  // Generate fragments
  const fragments = useMemo(() => {
    const fragmentCount = 30;
    const fragments = [];
    
    for (let i = 0; i < fragmentCount; i++) {
      // Create a variety of small geometric shapes
      const geometryType = Math.floor(Math.random() * 5);
      let geometry;
      
      const smallSize = size * (0.1 + Math.random() * 0.2);
      
      switch (geometryType) {
        case 0: // Box
          geometry = new THREE.BoxGeometry(smallSize, smallSize, smallSize);
          break;
        case 1: // Tetrahedron
          geometry = new THREE.TetrahedronGeometry(smallSize, 0);
          break;
        case 2: // Octahedron
          geometry = new THREE.OctahedronGeometry(smallSize, 0);
          break;
        case 3: // Dodecahedron
          geometry = new THREE.DodecahedronGeometry(smallSize, 0);
          break;
        case 4: // Icosahedron
          geometry = new THREE.IcosahedronGeometry(smallSize, 0);
          break;
      }
      
      // Random initial position within the cube
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * size * 0.8,
        (Math.random() - 0.5) * size * 0.8,
        (Math.random() - 0.5) * size * 0.8
      );
      
      // Random direction for explosion
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      // Target position when exploded
      const distance = size * (2 + Math.random() * 3);
      const targetPos = startPos.clone().add(direction.clone().multiplyScalar(distance));
      
      // Random rotation values
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      const rotationSpeed = [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ];
      
      fragments.push({
        geometry,
        startPos: [startPos.x, startPos.y, startPos.z],
        targetPos: [targetPos.x, targetPos.y, targetPos.z],
        rotation,
        rotationSpeed,
        scale: 0.8 + Math.random() * 0.4
      });
    }
    
    return fragments;
  }, [size]);
  
  // Animation cycle
  useEffect(() => {
    const startExploding = () => {
      setExploded(true);
      setReforming(false);
      
      // Schedule reformation
      setTimeout(() => {
        setReforming(true);
        setExploded(false);
        
        // Schedule next explosion
        setTimeout(() => {
          setReforming(false);
          
          // Wait a bit before restarting cycle
          setTimeout(startExploding, 5000 + Math.random() * 5000);
        }, 2000);
      }, 3000 + Math.random() * 1000);
    };
    
    // Initial delay
    const timer = setTimeout(startExploding, 3000 + Math.random() * 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current || !fragmentsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate main group
    groupRef.current.rotation.y = time * 0.2;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    
    // Animate fragments
    fragmentsRef.current.children.forEach((fragment, i) => {
      const data = fragments[i];
      
      // Update position based on animation state
      if (exploded) {
        // Move towards target position
        fragment.position.x += (data.targetPos[0] - fragment.position.x) * delta * 2;
        fragment.position.y += (data.targetPos[1] - fragment.position.y) * delta * 2;
        fragment.position.z += (data.targetPos[2] - fragment.position.z) * delta * 2;
      } else if (reforming) {
        // Move back to original position
        fragment.position.x += (data.startPos[0] - fragment.position.x) * delta * 3;
        fragment.position.y += (data.startPos[1] - fragment.position.y) * delta * 3;
        fragment.position.z += (data.startPos[2] - fragment.position.z) * delta * 3;
      } else {
        // Slight hovering effect when idle
        const offset = i * 0.1;
        fragment.position.x = data.startPos[0] + Math.sin(time * 0.5 + offset) * 0.05;
        fragment.position.y = data.startPos[1] + Math.sin(time * 0.6 + offset) * 0.05;
        fragment.position.z = data.startPos[2] + Math.sin(time * 0.7 + offset) * 0.05;
      }
      
      // Always rotate fragments
      fragment.rotation.x += delta * data.rotationSpeed[0] * (exploded ? 5 : 0.5);
      fragment.rotation.y += delta * data.rotationSpeed[1] * (exploded ? 5 : 0.5);
      fragment.rotation.z += delta * data.rotationSpeed[2] * (exploded ? 5 : 0.5);
      
      // Pulse glow effect
      const material = (fragment as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (material && material.emissive) {
        const baseIntensity = exploded ? 0.6 : 0.3;
        const pulseIntensity = Math.sin(time * 2 + i) * 0.2;
        material.emissiveIntensity = baseIntensity + pulseIntensity;
      }
    });
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      <group ref={groupRef}>
        {/* Original cube (visible only when not exploded) */}
        <mesh visible={!exploded && !reforming}>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial 
            color={color}
            emissive={glowColor}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        {/* Fragments */}
        <group ref={fragmentsRef}>
          {fragments.map((fragment, i) => (
            <mesh 
              key={i}
              geometry={fragment.geometry}
              position={[fragment.startPos[0], fragment.startPos[1], fragment.startPos[2]]}
              rotation={[fragment.rotation[0], fragment.rotation[1], fragment.rotation[2]]}
              scale={fragment.scale}
            >
              <meshStandardMaterial
                color={color}
                emissive={glowColor}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.8}
                transparent
                opacity={0.95}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

export default ExplodingBox;