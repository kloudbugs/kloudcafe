import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';

interface TwistingCubeProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  glowColor?: string;
  breakApart?: boolean;
}

export function TwistingCube({
  position = [0, 0, 0],
  size = 2,
  color = '#9d4edd',
  glowColor = '#ffd700',
  breakApart = true,
}: TwistingCubeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  
  // State for animation control
  const [timeOffset] = useState(() => Math.random() * 10);
  const [breakingPhase, setBreakingPhase] = useState(false);
  const [reassemblingPhase, setReassemblingPhase] = useState(false);
  
  // Create sub-cubes for the breaking apart effect
  const smallCubes = useMemo(() => {
    const cubes = [];
    const divisions = 3;
    const smallSize = size / divisions;
    
    for (let x = 0; x < divisions; x++) {
      for (let y = 0; y < divisions; y++) {
        for (let z = 0; z < divisions; z++) {
          // Only create cubes for outer shell
          if (x === 0 || x === divisions - 1 || 
              y === 0 || y === divisions - 1 || 
              z === 0 || z === divisions - 1) {
            
            // Calculate position offset from center
            const posX = (x - (divisions - 1) / 2) * smallSize;
            const posY = (y - (divisions - 1) / 2) * smallSize;
            const posZ = (z - (divisions - 1) / 2) * smallSize;
            
            // Original position data (for reassembly)
            const originalPos = [posX, posY, posZ];
            
            // Add some randomization to make it interesting
            const randomOffset = () => (Math.random() - 0.5) * 2;
            
            cubes.push({
              position: [posX, posY, posZ],
              originalPosition: [...originalPos],
              randomPosition: [
                posX * (3 + randomOffset()), 
                posY * (3 + randomOffset()), 
                posZ * (3 + randomOffset())
              ],
              size: smallSize * 0.9, // Slightly smaller to see separation
              rotation: [
                randomOffset() * Math.PI * 2, 
                randomOffset() * Math.PI * 2, 
                randomOffset() * Math.PI * 2
              ],
              randomRotation: [
                randomOffset() * Math.PI * 4, 
                randomOffset() * Math.PI * 4, 
                randomOffset() * Math.PI * 4
              ],
            });
          }
        }
      }
    }
    
    return cubes;
  }, [size]);
  
  // Animation cycle
  useEffect(() => {
    if (breakApart) {
      // Start breaking apart after a random delay
      const breakInterval = setInterval(() => {
        setBreakingPhase(true);
        
        // After breakApart animation completes, start reassembling
        setTimeout(() => {
          setBreakingPhase(false);
          setReassemblingPhase(true);
          
          // After reassembly, reset to normal state
          setTimeout(() => {
            setReassemblingPhase(false);
            
            // Wait for next cycle
            setTimeout(() => {
              setBreakingPhase(true);
            }, 5000 + Math.random() * 5000);
          }, 2000);
        }, 2000);
      }, 15000 + Math.random() * 10000); // Random timing for natural feel
      
      return () => clearInterval(breakInterval);
    }
  }, [breakApart]);
  
  // Animation using useFrame
  useFrame((state, delta) => {
    if (!groupRef.current || !particlesRef.current) return;
    
    // Main cube rotation
    const time = state.clock.getElapsedTime() + timeOffset;
    
    // Compute a smooth oscillation for the twist effect
    const twistFrequency = 0.2;
    const twistAmplitude = 0.3;
    const twist = Math.sin(time * twistFrequency) * twistAmplitude;
    
    // Apply twisting to main cube
    groupRef.current.rotation.x = time * 0.1;
    groupRef.current.rotation.y = time * 0.15;
    
    // Particles animation (the small cubes)
    const particles = particlesRef.current.children;
    
    particles.forEach((particle, i) => {
      const cube = smallCubes[i];
      
      if (breakingPhase) {
        // Move to random positions
        particle.position.x = MathUtils.lerp(
          particle.position.x, 
          cube.randomPosition[0], 
          delta * 3
        );
        particle.position.y = MathUtils.lerp(
          particle.position.y, 
          cube.randomPosition[1], 
          delta * 3
        );
        particle.position.z = MathUtils.lerp(
          particle.position.z, 
          cube.randomPosition[2], 
          delta * 3
        );
        
        // Random rotation
        particle.rotation.x += delta * cube.randomRotation[0] * 0.5;
        particle.rotation.y += delta * cube.randomRotation[1] * 0.5;
        particle.rotation.z += delta * cube.randomRotation[2] * 0.5;
      } 
      else if (reassemblingPhase) {
        // Move back to original positions
        particle.position.x = MathUtils.lerp(
          particle.position.x, 
          cube.originalPosition[0], 
          delta * 4
        );
        particle.position.y = MathUtils.lerp(
          particle.position.y, 
          cube.originalPosition[1], 
          delta * 4
        );
        particle.position.z = MathUtils.lerp(
          particle.position.z, 
          cube.originalPosition[2], 
          delta * 4
        );
        
        // Reset rotation
        particle.rotation.x = MathUtils.lerp(
          particle.rotation.x, 
          cube.rotation[0], 
          delta * 4
        );
        particle.rotation.y = MathUtils.lerp(
          particle.rotation.y, 
          cube.rotation[1], 
          delta * 4
        );
        particle.rotation.z = MathUtils.lerp(
          particle.rotation.z, 
          cube.rotation[2], 
          delta * 4
        );
      } 
      else {
        // Normal state: subtle oscillation for each small cube
        const i3 = i * 3;
        particle.position.x = cube.originalPosition[0] + Math.sin(time * 0.5 + i3) * 0.02;
        particle.position.y = cube.originalPosition[1] + Math.sin(time * 0.6 + i3 + 0.5) * 0.02;
        particle.position.z = cube.originalPosition[2] + Math.sin(time * 0.7 + i3 + 1) * 0.02;
        
        // Apply twist effect to rotation
        particle.rotation.x = cube.rotation[0] + twist * 0.3;
        particle.rotation.y = cube.rotation[1] + twist * 0.4;
        particle.rotation.z = cube.rotation[2] + twist * 0.2;
      }
      
      // Pulse effect for glow
      const baseMat = (particle as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (baseMat && baseMat.emissive) {
        const pulseIntensity = (Math.sin(time * 2 + i) * 0.5 + 0.5) * 0.3;
        baseMat.emissiveIntensity = pulseIntensity;
      }
    });
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      <group ref={groupRef}>
        <group ref={particlesRef}>
          {smallCubes.map((cube, i) => (
            <mesh 
              key={i} 
              position={[cube.position[0], cube.position[1], cube.position[2]]}
              rotation={[cube.rotation[0], cube.rotation[1], cube.rotation[2]]}
            >
              <boxGeometry args={[cube.size, cube.size, cube.size]} />
              <meshStandardMaterial 
                color={color}
                emissive={glowColor}
                emissiveIntensity={0.2}
                roughness={0.3}
                metalness={0.8}
                transparent
                opacity={0.9}
                wireframe={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

export default TwistingCube;