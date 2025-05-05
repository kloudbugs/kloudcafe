import React, { useRef, useEffect } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from '../lib/stores/useControls';
import * as THREE from 'three';
import { Clock } from 'three';

interface MinerTitleProps {
  position?: [number, number, number];
  scale?: number;
}

const MinerTitle: React.FC<MinerTitleProps> = ({
  position = [0, 2.5, 0],
  scale = 1,
}) => {
  const controls = useControls();
  const titleRef = useRef<THREE.Group>(null);
  
  // Get color based on the color scheme
  const primaryColor = controls.getColorByScheme('core');
  const secondaryColor = controls.getColorByScheme('tendril');
  const pulseColor = controls.getColorByScheme('pulse');
  
  // Debug loading
  useEffect(() => {
    console.log('MinerTitle component mounted');
    console.log('Primary color:', primaryColor);
    console.log('Secondary color:', secondaryColor);
    return () => console.log('MinerTitle component unmounted');
  }, []);
  
  // Animation for the title
  useFrame(({ clock }: { clock: Clock }) => {
    if (titleRef.current) {
      // Subtle floating animation
      const t = clock.getElapsedTime();
      titleRef.current.position.y = Math.sin(t * 0.8) * 0.05;
      
      // Subtle rotation
      titleRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
      
      // Access and update text materials for pulsing glow effect
      titleRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Find the text meshes by checking if they have emissive property
          if (child.material.emissive) {
            // Pulsing effect by modulating emissive intensity
            // Different frequencies for each text element
            if (child.position.y > 0) { // Main title
              (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 
                0.6 + Math.sin(t * 2.5) * 0.4; // Range from 0.2 to 1.0
            } else { // Subtitle
              (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 
                0.5 + Math.sin(t * 3.5 + 1) * 0.3; // Range from 0.2 to 0.8 with phase offset
            }
          }
        }
      });
    }
  });
  
  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group scale={scale}>
        <group ref={titleRef}>
          {/* Main Title: KLOUDBUGS CAFE - Now bigger and flashier */}
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.55}
            font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXw.woff"
            color={primaryColor}
            outlineWidth={0.04}
            outlineColor="#000000"
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            userData={{ keepAlive: true }}
            // Add glow through emissive material properties
            material={
              new THREE.MeshStandardMaterial({
                color: primaryColor,
                emissive: primaryColor,
                emissiveIntensity: 0.8,
                metalness: 0.7,
                roughness: 0.2,
              })
            }
          >
            KLOUDBUGS CAFE
          </Text>
          
          {/* Subtitle: ZIG-MINER - Enhanced styling */}
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.35}
            font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXw.woff"
            color={secondaryColor}
            outlineWidth={0.03}
            outlineColor="#000000"
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            userData={{ keepAlive: true }}
            // Add glow through emissive material
            material={
              new THREE.MeshStandardMaterial({
                color: secondaryColor,
                emissive: secondaryColor,
                emissiveIntensity: 0.7,
                metalness: 0.6,
                roughness: 0.3,
              })
            }
          >
            ZIG-MINER
          </Text>
          
          {/* Enhanced decorative elements */}
          <group position={[0, -0.05, 0]}>
            {/* Left glowing orb */}
            <mesh position={[-1.8, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial 
                color={pulseColor} 
                emissive={pulseColor} 
                emissiveIntensity={0.8} 
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            
            {/* Right glowing orb */}
            <mesh position={[1.8, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial 
                color={pulseColor} 
                emissive={pulseColor} 
                emissiveIntensity={0.8}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            
            {/* Add a thin line connecting the orbs */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[3.6, 0.03, 0.03]} />
              <meshStandardMaterial 
                color={secondaryColor} 
                emissive={secondaryColor} 
                emissiveIntensity={0.5}
                transparent={true}
                opacity={0.7}
              />
            </mesh>
          </group>
        </group>
      </group>
    </Billboard>
  );
};

export default MinerTitle;