import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ConvexGeometry } from '../lib/ConvexGeometry';

interface ExplodingCubeProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  glowColor?: string;
}

export function ExplodingCube({
  position = [0, 0, 0],
  size = 1.5,
  color = '#5a189a',
  glowColor = '#ffd700',
}: ExplodingCubeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  
  // State for animation
  const [exploded, setExploded] = useState(false);
  const [reforming, setReforming] = useState(false);
  
  // Generate fragment geometries
  const fragments = useMemo(() => {
    // Helper to generate random polyhedron vertices
    const generateRandomVerts = (count: number, radius: number) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = radius * (0.7 + Math.random() * 0.3); // Randomize radius a bit
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      return points;
    };
    
    // Create fragment data
    const fragmentCount = 20;
    const fragmentData = [];
    
    for (let i = 0; i < fragmentCount; i++) {
      // Generate random shape for each fragment
      const vertexCount = 6 + Math.floor(Math.random() * 4);
      const radius = size * (0.2 + Math.random() * 0.2);
      const points = generateRandomVerts(vertexCount, radius);
      
      // Create convex hull geometry
      const geometry = new THREE.ConvexGeometry(points);
      
      // Calculate random explosion trajectory
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      // Random position within the original cube
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * size * 0.8,
        (Math.random() - 0.5) * size * 0.8,
        (Math.random() - 0.5) * size * 0.8
      );
      
      // Target position when exploded
      const distance = size * (2 + Math.random() * 3);
      const targetPos = startPos.clone().add(direction.clone().multiplyScalar(distance));
      
      // Random rotation rates
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      const rotationSpeed = [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ];
      
      fragmentData.push({
        geometry,
        startPos: [startPos.x, startPos.y, startPos.z],
        targetPos: [targetPos.x, targetPos.y, targetPos.z],
        rotation,
        rotationSpeed,
        scale: 0.8 + Math.random() * 0.4
      });
    }
    
    return fragmentData;
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

export default ExplodingCube;