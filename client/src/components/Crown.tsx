import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CrownProps {
  size?: number;
  pointCount?: number;
  color?: string;
  gemColor?: string;
  position?: [number, number, number];
}

const Crown: React.FC<CrownProps> = ({
  size = 1,
  pointCount = 5,
  color = "#ffaa33",
  gemColor = "#4cccff"
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Crown points
  const crownPoints = useMemo(() => {
    const points = [];
    const radius = size;
    
    // Create crown points in a circle
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius * 0.7;
      const z = Math.sin(angle) * radius * 0.7;
      points.push({ x, y: 0, z });
    }
    
    return points;
  }, [size, pointCount]);
  
  // Animation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.children.forEach((child, i) => {
        // Float the gems slightly
        if (i > 0) { // Skip the base
          const mesh = child as THREE.Mesh;
          const time = Date.now() * 0.001;
          const offset = i * 0.5;
          mesh.position.y = Math.sin(time + offset) * 0.05 + 0.5;
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Crown base */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[size * 0.7, size * 0.1, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Crown points */}
      {crownPoints.map((point, index) => (
        <group key={index} position={[point.x, point.y, point.z]}>
          {/* Crown spike */}
          <mesh position={[0, 0.25, 0]}>
            <coneGeometry args={[size * 0.15, size * 0.5, 4]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Crown gem */}
          <mesh position={[0, 0.55, 0]}>
            <octahedronGeometry args={[size * 0.15, 0]} />
            <meshStandardMaterial 
              color={gemColor} 
              metalness={0.2} 
              roughness={0.2} 
              emissive={gemColor}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
      
      {/* Center gem */}
      <mesh position={[0, 0.35, 0]}>
        <octahedronGeometry args={[size * 0.25, 0]} />
        <meshStandardMaterial 
          color={gemColor} 
          metalness={0.2} 
          roughness={0.2} 
          emissive={gemColor}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default Crown;