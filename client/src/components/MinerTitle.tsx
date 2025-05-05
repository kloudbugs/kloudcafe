import React, { useRef, useState, useEffect } from 'react';
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
  
  // Enhanced cosmic wallet theme colors
  const cosmicPurple = '#9900ff';
  const cosmicGold = '#ffcc00';
  const cosmicCyan = '#00ffee';
  const cosmicPink = '#ff00cc';
  
  // Refs for sphere animation
  const leftSphereRef = useRef<THREE.Mesh>(null);
  const rightSphereRef = useRef<THREE.Mesh>(null);
  const middleSphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mainTitleRef = useRef<THREE.Mesh>(null);
  const subTitleRef = useRef<THREE.Mesh>(null);
  
  // State for animated text colors and properties
  const [mainTitleColor, setMainTitleColor] = useState(cosmicPurple);
  const [subTitleColor, setSubTitleColor] = useState(cosmicGold);
  const [glowIntensity, setGlowIntensity] = useState(1.0);
  const [textScale, setTextScale] = useState(1.0);
  const [sphereEmissiveIntensity, setSphereEmissiveIntensity] = useState(1.0);
  const [mainTitleRotation, setMainTitleRotation] = useState(0);
  const [subTitleRotation, setSubTitleRotation] = useState(0);
  
  // State for entrance animation
  const [entranceAnimation, setEntranceAnimation] = useState(true);
  const [entranceProgress, setEntranceProgress] = useState(0);
  
  // More advanced sphere structure
  const [spherePositions, setSpherePositions] = useState<THREE.Vector3[]>([]);
  const sphereCount = 8; // More decorative spheres
  
  // Initialize sphere positions
  useEffect(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < sphereCount; i++) {
      const angle = (i / sphereCount) * Math.PI * 2;
      const radius = 1.8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.4; // Elliptical orbit
      positions.push(new THREE.Vector3(x, y, 0));
    }
    setSpherePositions(positions);
    
    // Start entrance animation
    setTimeout(() => {
      setEntranceAnimation(false);
    }, 2500); // Animation lasts for 2.5 seconds
  }, []);
  
  // Animation values
  const pulseSpeed = 2.5; // Increased speed of the pulse animation
  
  // Use frame for animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Entrance animation
    if (entranceAnimation) {
      // Calculate progress (0 to 1 over 2.5 seconds)
      const progress = Math.min(time / 2.5, 1);
      setEntranceProgress(progress);
      
      // Dramatic zoom from distance
      if (groupRef.current) {
        const entranceScale = THREE.MathUtils.lerp(0.1, 1, progress);
        groupRef.current.scale.set(
          scale * entranceScale, 
          scale * entranceScale, 
          scale * entranceScale
        );
        
        // Move from behind the camera to final position
        const startZ = -10;
        const endZ = 0;
        const easedProgress = easeOutElastic(progress);
        groupRef.current.position.z = THREE.MathUtils.lerp(startZ, endZ, easedProgress);
        
        // Add some dramatic wobble
        if (progress > 0.2) {
          const wobbleAmount = (1 - progress) * 0.2;
          groupRef.current.rotation.x = Math.sin(time * 10) * wobbleAmount;
          groupRef.current.rotation.y = Math.cos(time * 8) * wobbleAmount;
        }
      }
    } else {
      // Reset entrance effects when animation is complete
      if (groupRef.current) {
        groupRef.current.position.z = 0;
      }
      
      // More dynamic pulse animation for brightness and scale
      const pulseFactor = Math.sin(time * pulseSpeed) * 0.5 + 0.5; // 0 to 1 pulsing
      const fastPulse = Math.sin(time * pulseSpeed * 2) * 0.5 + 0.5;
      const slowPulse = Math.sin(time * pulseSpeed * 0.5) * 0.5 + 0.5;
      
      // Update group scale for a subtle pulse
      if (groupRef.current) {
        const newScale = 1 + pulseFactor * 0.08; // Increased scale effect
        groupRef.current.scale.set(scale * newScale, scale * newScale, scale * newScale);
      }
      
      // Update text colors with more cosmic colors
      const mainColorFactor = Math.sin(time * 1.5) * 0.5 + 0.5;
      const mainColor = new THREE.Color(cosmicPurple).lerp(
        new THREE.Color(cosmicGold), 
        mainColorFactor
      );
      // Add a touch of cyan for more vibrancy
      const enhancedMainColor = mainColor.lerp(
        new THREE.Color(cosmicCyan),
        Math.sin(time * 2.3) * 0.2 + 0.1 // Subtle cyan influence
      );
      setMainTitleColor('#' + enhancedMainColor.getHexString());
      
      // More complex color transition for subtitle
      const subColorFactor = Math.sin(time * 1.8 + Math.PI) * 0.5 + 0.5;
      const subColor = new THREE.Color(cosmicGold).lerp(
        new THREE.Color(cosmicPurple), 
        subColorFactor
      );
      // Add a touch of pink for extra pop
      const enhancedSubColor = subColor.lerp(
        new THREE.Color(cosmicPink),
        Math.sin(time * 2.7) * 0.2 + 0.1 // Subtle pink influence
      );
      setSubTitleColor('#' + enhancedSubColor.getHexString());
      
      // Enhanced glow intensity with faster pulsing
      setGlowIntensity(1.0 + fastPulse * 1.5);
      
      // Enhanced text scale animation
      setTextScale(1.0 + pulseFactor * 0.15);
      
      // Add subtle rotation to titles for extra dynamic feel
      setMainTitleRotation(Math.sin(time * 0.5) * 0.03);
      setSubTitleRotation(Math.sin(time * 0.5 + Math.PI) * 0.05);
      
      // Make text slightly bulge toward camera for 3D effect
      if (mainTitleRef.current && subTitleRef.current) {
        const bulgeAmount = pulseFactor * 0.2;
        mainTitleRef.current.position.z = bulgeAmount;
        subTitleRef.current.position.z = bulgeAmount * 0.8;
      }
    }
    
    // Animate decorative spheres
    if (leftSphereRef.current && rightSphereRef.current) {
      // Enhanced sphere intensity
      setSphereEmissiveIntensity(1.5 + Math.sin(time * pulseSpeed * 2) * 0.5 + 0.5 * 2.0);
      
      // Enhanced orbit movement
      leftSphereRef.current.position.x = -1.8 + Math.sin(time * 1.2) * 0.2;
      leftSphereRef.current.position.y = Math.cos(time * 1.2) * 0.15;
      leftSphereRef.current.position.z = Math.sin(time * 1.8) * 0.1;
      rightSphereRef.current.position.x = 1.8 + Math.sin(time * 1.2 + Math.PI) * 0.2;
      rightSphereRef.current.position.y = Math.cos(time * 1.2 + Math.PI) * 0.15;
      rightSphereRef.current.position.z = Math.sin(time * 1.8 + Math.PI) * 0.1;
      
      if (middleSphereRef.current) {
        // Animate middle sphere in a figure-8 pattern
        middleSphereRef.current.position.x = Math.sin(time * 1.5) * 0.3;
        middleSphereRef.current.position.y = Math.sin(time * 3) * 0.15;
        middleSphereRef.current.position.z = Math.cos(time * 1.5) * 0.1;
      }
      
      // Animate sphere colors with more variety
      const sphereColorFactor = Math.sin(time * 2) * 0.5 + 0.5;
      const sphereColor = new THREE.Color(cosmicGold).lerp(
        new THREE.Color(cosmicPurple), 
        sphereColorFactor
      );
      
      // Add cyan influence to sphere colors
      const enhancedSphereColor = sphereColor.lerp(
        new THREE.Color(cosmicCyan),
        Math.sin(time * 3.1) * 0.3 + 0.1
      );
      
      const material = leftSphereRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.color.set(enhancedSphereColor);
        material.emissive.set(enhancedSphereColor);
        material.emissiveIntensity = sphereEmissiveIntensity;
      }
      
      const rightMaterial = rightSphereRef.current.material as THREE.MeshStandardMaterial;
      if (rightMaterial) {
        // Give right sphere a slightly different color
        const rightColor = enhancedSphereColor.clone().lerp(
          new THREE.Color(cosmicPink),
          0.2
        );
        rightMaterial.color.set(rightColor);
        rightMaterial.emissive.set(rightColor);
        rightMaterial.emissiveIntensity = sphereEmissiveIntensity;
      }
      
      const middleMaterial = middleSphereRef.current?.material as THREE.MeshStandardMaterial;
      if (middleMaterial) {
        // Give middle sphere a unique color
        const middleColor = new THREE.Color(cosmicCyan).lerp(
          new THREE.Color(cosmicGold),
          Math.sin(time * pulseSpeed * 2) * 0.5 + 0.5
        );
        middleMaterial.color.set(middleColor);
        middleMaterial.emissive.set(middleColor);
        middleMaterial.emissiveIntensity = sphereEmissiveIntensity * 1.5; // Extra bright
      }
      
      // Update orbital spheres
      spherePositions.forEach((pos, i) => {
        const angle = (i / sphereCount) * Math.PI * 2 + time * 0.8;
        const radius = 1.8 + Math.sin(time * 2 + i) * 0.2;
        pos.x = Math.cos(angle) * radius;
        pos.y = Math.sin(angle) * radius * 0.4;
        pos.z = Math.sin(time * 1.5 + i * 0.5) * 0.15;
      });
    }
  });
  
  // Elastic easing function for bounce effect
  const easeOutElastic = (x: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  };
  
  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group ref={groupRef} scale={scale}>
        {/* Main Title: KLOUDBUGS CAFE */}
        <Text
          ref={mainTitleRef}
          position={[0, 0.25, 0]}
          fontSize={0.6} // Increased size more
          color={mainTitleColor}
          fillOpacity={1}
          outlineWidth={0.065} // Much thicker outline
          outlineColor="#000000"
          outlineOpacity={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
          scale={[textScale, textScale, textScale]}
          rotation={[0, 0, mainTitleRotation]} // Subtle rotation animation
        >
          KLOUDBUGS CAFE
        </Text>
        
        {/* Subtitle: iNDX0-ZIGMINZER */}
        <Text
          ref={subTitleRef}
          position={[0, -0.25, 0]}
          fontSize={0.48} // Increased size more
          color={subTitleColor}
          fillOpacity={1}
          outlineWidth={0.055} // Much thicker outline
          outlineColor="#000000"
          outlineOpacity={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
          scale={[textScale, textScale, textScale]}
          rotation={[0, 0, subTitleRotation]} // Subtle rotation animation
        >
          iNDX0-ZIGMINZER
        </Text>
        
        {/* Enhanced decorative elements */}
        <group position={[0, -0.05, 0]}>
          {/* Main spheres */}
          <mesh ref={leftSphereRef} position={[-1.8, 0, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} /> {/* Even larger, higher detail */}
            <meshStandardMaterial 
              color={cosmicGold} 
              emissive={cosmicGold} 
              emissiveIntensity={1.5} 
              toneMapped={false}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          <mesh ref={middleSphereRef} position={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} /> {/* Larger middle sphere */}
            <meshStandardMaterial 
              color={cosmicCyan} 
              emissive={cosmicCyan} 
              emissiveIntensity={1.8} 
              toneMapped={false}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          <mesh ref={rightSphereRef} position={[1.8, 0, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} /> {/* Even larger, higher detail */}
            <meshStandardMaterial 
              color={cosmicGold} 
              emissive={cosmicGold} 
              emissiveIntensity={1.5} 
              toneMapped={false}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Orbital spheres */}
          {spherePositions.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.07 + Math.random() * 0.05, 16, 16]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? cosmicGold : cosmicPurple} 
                emissive={i % 2 === 0 ? cosmicGold : cosmicPurple} 
                emissiveIntensity={1.3} 
                toneMapped={false}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Billboard>
  );
};

export default MinerTitle;