import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitingLogoProps {
  radius?: number;
  speed?: number;
}

const OrbitingLogo: React.FC<OrbitingLogoProps> = ({ 
  radius = 2.5, 
  speed = 0.3 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      time.current += delta;
      
      // Rotate the orbit
      orbitRef.current.rotation.y += delta * speed;
      
      // Add a bobbing motion
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(time.current * 1.5) * 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 6, 0]}>
      <group ref={orbitRef}>
        {/* Orbit path visualization (optional, set visible to true to show) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
          <meshBasicMaterial color="#9900ff" transparent opacity={0.3} />
        </mesh>
        
        {/* Orbiting logo */}
        <group position={[radius, 0, 0]}>
          <Html
            transform
            distanceFactor={8}
            position={[0, 0, 0]}
            style={{
              width: '100px',
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #00ffcc, #9900ff)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '30px',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: '0 0 15px rgba(153, 0, 255, 0.7), 0 0 30px rgba(0, 255, 204, 0.4)',
                transform: 'rotate(-30deg)',
                textShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
              }}
            >
              KB
            </div>
          </Html>
          
          {/* Glowing circle around logo */}
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default OrbitingLogo;