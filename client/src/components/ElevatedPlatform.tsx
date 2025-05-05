import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ElevatedPlatformProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  baseColor?: string;
  accentColor?: string;
  glowColor?: string;
  animate?: boolean;
}

export default function ElevatedPlatform({
  position = [0, 0, 0],
  scale = [10, 1, 10],
  baseColor = "#3a0ca3",
  accentColor = "#7209b7",
  glowColor = "#ffd700",
  animate = true
}: ElevatedPlatformProps) {
  const platformRef = useRef<THREE.Group>(null);
  const pillarRefs = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef<number>(0);
  const glowLightRefs = useRef<THREE.PointLight[]>([]);
  
  // Create corner positions
  const cornerPositions = [
    [scale[0] * 0.45, 0, scale[2] * 0.45],
    [scale[0] * 0.45, 0, -scale[2] * 0.45],
    [-scale[0] * 0.45, 0, scale[2] * 0.45],
    [-scale[0] * 0.45, 0, -scale[2] * 0.45],
  ];
  
  // Create side connector positions
  const sidePositions = [
    [0, 0, scale[2] * 0.45], // front
    [scale[0] * 0.45, 0, 0], // right
    [0, 0, -scale[2] * 0.45], // back
    [-scale[0] * 0.45, 0, 0], // left
  ];
  
  // Animation
  useFrame((state) => {
    if (!animate || !platformRef.current) return;
    
    const time = state.clock.getElapsedTime();
    timeRef.current = time;
    
    // Slight breathing animation for the platform
    if (platformRef.current) {
      platformRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
    }
    
    // Pillar glow intensity animation
    pillarRefs.current.forEach((pillar, i) => {
      if (pillar) {
        const material = pillar.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * 0.8 + i * 0.5) * 0.2;
      }
    });
    
    // Light intensity animation
    glowLightRefs.current.forEach((light, i) => {
      if (light) {
        light.intensity = 1 + Math.sin(time * 0.8 + i * 0.7) * 0.5;
      }
    });
  });
  
  return (
    <group ref={platformRef} position={position}>
      {/* Main platform */}
      <mesh receiveShadow castShadow position={[0, scale[1] * 0.5, 0]}>
        <boxGeometry args={[scale[0], scale[1], scale[2]]} />
        <meshStandardMaterial 
          color={baseColor} 
          metalness={0.7} 
          roughness={0.2}
          emissive={baseColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Platform edges */}
      <mesh position={[0, scale[1] * 0.5, 0]}>
        <boxGeometry args={[scale[0] + 0.1, scale[1] - 0.1, scale[2] + 0.1]} />
        <meshStandardMaterial 
          color={accentColor} 
          metalness={0.7} 
          roughness={0.2}
          emissive={accentColor}
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Top surface details - grid lines */}
      <mesh position={[0, scale[1] + 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[scale[0] - 0.2, scale[2] - 0.2]} />
        <meshStandardMaterial 
          color={glowColor} 
          emissive={glowColor}
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.3}
          wireframe={true}
        />
      </mesh>
      
      {/* Corner Pillars */}
      {cornerPositions.map((cornerPos, i) => {
        const pillarHeight = 6 + i % 2;
        return (
          <group key={`corner-${i}`} position={[cornerPos[0], -pillarHeight / 2, cornerPos[2]]}>
            {/* Main pillar */}
            <mesh 
              ref={(el) => el && (pillarRefs.current[i] = el)} 
              castShadow
            >
              <boxGeometry args={[0.3, pillarHeight, 0.3]} />
              <meshStandardMaterial 
                color={accentColor} 
                metalness={0.8} 
                roughness={0.2}
                emissive={accentColor}
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Pillar accents - rings */}
            {[0.2, 0.4, 0.6, 0.8].map((heightFactor, j) => (
              <mesh 
                key={`ring-${i}-${j}`} 
                position={[0, -pillarHeight / 2 + pillarHeight * heightFactor, 0]} 
                castShadow
              >
                <torusGeometry args={[0.25, 0.05, 8, 16]} />
                <meshStandardMaterial 
                  color={glowColor} 
                  emissive={glowColor}
                  emissiveIntensity={0.7}
                />
              </mesh>
            ))}
            
            {/* Glow light at pillar top */}
            <pointLight 
              ref={(el) => el && (glowLightRefs.current[i] = el)}
              position={[0, pillarHeight / 2, 0]} 
              color={glowColor} 
              intensity={1} 
              distance={3} 
            />
          </group>
        );
      })}
      
      {/* Side Connectors */}
      {sidePositions.map((sidePos, i) => (
        <group key={`side-${i}`} position={[sidePos[0], scale[1] * 0.5, sidePos[2]]}>
          {/* Connector box */}
          <mesh castShadow>
            <boxGeometry args={[
              i % 2 === 0 ? scale[0] * 0.5 : 0.4, 
              0.4, 
              i % 2 === 0 ? 0.4 : scale[2] * 0.5
            ]} />
            <meshStandardMaterial 
              color={accentColor} 
              metalness={0.7} 
              roughness={0.3}
              emissive={accentColor}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Accent lights */}
          {i % 2 === 0 ? 
            // Horizontal connectors (front/back)
            [-0.3, -0.15, 0, 0.15, 0.3].map((offset, j) => (
              <mesh 
                key={`accent-${i}-${j}`} 
                position={[scale[0] * offset, 0.21, 0]} 
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
                <meshStandardMaterial 
                  color={glowColor} 
                  emissive={glowColor}
                  emissiveIntensity={0.8}
                />
              </mesh>
            )) : 
            // Vertical connectors (left/right)
            [-0.3, -0.15, 0, 0.15, 0.3].map((offset, j) => (
              <mesh 
                key={`accent-${i}-${j}`} 
                position={[0, 0.21, scale[2] * offset]} 
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
                <meshStandardMaterial 
                  color={glowColor} 
                  emissive={glowColor}
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))
          }
        </group>
      ))}
      
      {/* Energy beam from center */}
      <mesh position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 0.5, 6, 16, 1, true]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent={true} 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Central glow */}
      <pointLight position={[0, -3, 0]} color={glowColor} intensity={2} distance={8} />
      
      {/* Platform surface detail - central circle */}
      <mesh position={[0, scale[1] + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.5, 32]} />
        <meshStandardMaterial 
          color={glowColor} 
          emissive={glowColor}
          emissiveIntensity={0.7}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}