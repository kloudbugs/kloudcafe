import React, { useRef, useState } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface MinerTitleProps {
  position?: [number, number, number];
  scale?: number;
}

const MinerTitle: React.FC<MinerTitleProps> = ({
  position = [0, 2.5, 0],
  scale = 1,
}) => {
  const controls = useControls();
  
  // Cosmic wallet theme colors
  const cosmicPurple = '#9900ff';
  const cosmicGold = '#ffcc00';
  
  // Refs for sphere animation
  const leftSphereRef = useRef<THREE.Mesh>(null);
  const rightSphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // State for animated text colors and properties
  const [mainTitleColor, setMainTitleColor] = useState(cosmicPurple);
  const [subTitleColor, setSubTitleColor] = useState(cosmicGold);
  const [glowIntensity, setGlowIntensity] = useState(1.0);
  const [textScale, setTextScale] = useState(1.0);
  const [leftSphereColor, setLeftSphereColor] = useState(cosmicGold);
  const [rightSphereColor, setRightSphereColor] = useState(cosmicGold);
  const [sphereEmissiveIntensity, setSphereEmissiveIntensity] = useState(1.0);
  
  // Animation values
  const pulseSpeed = 2; // Speed of the pulse animation
  
  // Use frame for animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Pulse animation for brightness and scale
    const pulseFactor = Math.sin(time * pulseSpeed) * 0.5 + 0.5; // 0 to 1 pulsing
    
    // Update group scale for a subtle pulse
    if (groupRef.current) {
      const newScale = 1 + pulseFactor * 0.05;
      groupRef.current.scale.set(scale * newScale, scale * newScale, scale * newScale);
    }
    
    // Update text colors
    const mainColorFactor = Math.sin(time * 1.5) * 0.5 + 0.5;
    const mainColor = new THREE.Color(cosmicPurple).lerp(
      new THREE.Color(cosmicGold), 
      mainColorFactor
    );
    setMainTitleColor('#' + mainColor.getHexString());
    
    const subColorFactor = Math.sin(time * 1.5 + Math.PI) * 0.5 + 0.5;
    const subColor = new THREE.Color(cosmicGold).lerp(
      new THREE.Color(cosmicPurple), 
      subColorFactor
    );
    setSubTitleColor('#' + subColor.getHexString());
    
    // Update glow intensity
    setGlowIntensity(1.0 + pulseFactor * 1.0);
    
    // Text scale animation
    setTextScale(1.0 + pulseFactor * 0.1);
    
    // Animate decorative spheres
    if (leftSphereRef.current && rightSphereRef.current) {
      // Set sphere emissive intensity
      setSphereEmissiveIntensity(1.0 + pulseFactor * 1.5);
      
      // Make spheres orbit slightly
      leftSphereRef.current.position.x = -1.5 + Math.sin(time * 1.2) * 0.1;
      leftSphereRef.current.position.y = Math.cos(time * 1.2) * 0.1;
      rightSphereRef.current.position.x = 1.5 + Math.sin(time * 1.2 + Math.PI) * 0.1;
      rightSphereRef.current.position.y = Math.cos(time * 1.2 + Math.PI) * 0.1;
      
      // Animate sphere colors
      const sphereColorFactor = Math.sin(time * 2) * 0.5 + 0.5;
      const sphereColor = new THREE.Color(cosmicGold).lerp(
        new THREE.Color(cosmicPurple), 
        sphereColorFactor
      );
      
      const material = leftSphereRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.color.set(sphereColor);
        material.emissive.set(sphereColor);
        material.emissiveIntensity = sphereEmissiveIntensity;
      }
      
      const rightMaterial = rightSphereRef.current.material as THREE.MeshStandardMaterial;
      if (rightMaterial) {
        rightMaterial.color.set(sphereColor);
        rightMaterial.emissive.set(sphereColor);
        rightMaterial.emissiveIntensity = sphereEmissiveIntensity;
      }
    }
  });
  
  // Text shadow effect to make it glow
  const textShadow = `0 0 ${glowIntensity * 5}px ${mainTitleColor}`;
  const subTextShadow = `0 0 ${glowIntensity * 5}px ${subTitleColor}`;
  
  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group ref={groupRef} scale={scale}>
        {/* Main Title: KLOUDBUGS CAFE */}
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.5} // Increased from 0.4
          color={mainTitleColor}
          fillOpacity={1}
          outlineWidth={0.03} // Increased from 0.02
          outlineColor="#000000"
          outlineOpacity={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
          scale={[textScale, textScale, textScale]}
        >
          KLOUDBUGS CAFE
        </Text>
        
        {/* Subtitle: ZIG-MINER */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.38} // Increased from 0.3
          color={subTitleColor}
          fillOpacity={1}
          outlineWidth={0.03} // Increased from 0.02
          outlineColor="#000000"
          outlineOpacity={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
          scale={[textScale, textScale, textScale]}
        >
          ZIG-MINER
        </Text>
        
        {/* Decorative elements */}
        <group position={[0, -0.05, 0]}>
          <mesh ref={leftSphereRef} position={[-1.5, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} /> {/* Increased size from 0.1 */}
            <meshStandardMaterial 
              color={cosmicGold} 
              emissive={cosmicGold} 
              emissiveIntensity={1.0} 
              toneMapped={false}
            />
          </mesh>
          <mesh ref={rightSphereRef} position={[1.5, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} /> {/* Increased size from 0.1 */}
            <meshStandardMaterial 
              color={cosmicGold} 
              emissive={cosmicGold} 
              emissiveIntensity={1.0} 
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </Billboard>
  );
};

export default MinerTitle;