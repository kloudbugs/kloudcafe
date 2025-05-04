import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarSparklesProps {
  count?: number;
  radius?: number;
  size?: number;
  color?: string;
}

const StarSparkles: React.FC<StarSparklesProps> = ({
  count = 10,
  radius = 5,
  size = 0.2,
  color = "#ffffff"
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate star positions
  const stars = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Random position on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Random size variation
      const scale = size * (0.5 + Math.random() * 0.5);
      
      // Random animation offset
      const offset = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      
      temp.push({ 
        position: new THREE.Vector3(x, y, z), 
        scale, 
        offset, 
        speed 
      });
    }
    return temp;
  }, [count, radius, size]);
  
  // Animation
  useFrame(() => {
    if (groupRef.current) {
      const time = Date.now() * 0.001;
      
      groupRef.current.children.forEach((child, i) => {
        const star = stars[i];
        // Pulsing scale animation
        const pulse = Math.sin(time * star.speed + star.offset) * 0.3 + 0.7;
        child.scale.set(star.scale * pulse, star.scale * pulse, star.scale * pulse);
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true}
            opacity={0.8}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default StarSparkles;