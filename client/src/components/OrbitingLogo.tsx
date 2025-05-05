import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitingLogoProps {
  radius?: number;
  speed?: number;
}

const OrbitingLogo: React.FC<OrbitingLogoProps> = ({ 
  radius = 3,
  speed = 0.3
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create an array of logos with their own properties
  const logos = [
    { 
      image: '/images/kloudbugs_logo.png', 
      size: 0.8, 
      offset: 0, 
      height: 0 
    },
    { 
      image: '/images/bitcoin_miner.png', 
      size: 0.7, 
      offset: Math.PI * 0.5, 
      height: 0.2 
    },
    { 
      image: '/images/bitcoin_coin.png', 
      size: 0.6, 
      offset: Math.PI, 
      height: -0.3 
    },
    { 
      image: '/images/cosmic_bean.png', 
      size: 0.65, 
      offset: Math.PI * 1.5, 
      height: 0.1 
    }
  ];

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the entire group slightly
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {logos.map((logo, index) => (
        <OrbitingItem 
          key={index}
          image={logo.image}
          size={logo.size}
          radius={radius}
          speed={speed}
          offset={logo.offset}
          height={logo.height}
        />
      ))}
      
      {/* Bitcoin Symbol for center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.8}
          roughness={0.2}
          emissive="#ff9900"
          emissiveIntensity={0.2}
        />
        <Html position={[0, 0, 0.5]} transform center>
          <div style={{ 
            fontSize: '2rem', 
            color: '#ffffff',
            textShadow: '0 0 5px #ffcc00, 0 0 10px #ffcc00',
            fontWeight: 'bold'
          }}>
            ₿
          </div>
        </Html>
      </mesh>
    </group>
  );
};

interface OrbitingItemProps {
  image: string;
  size: number;
  radius: number;
  speed: number;
  offset: number;
  height: number;
}

const OrbitingItem: React.FC<OrbitingItemProps> = ({ 
  image, 
  size, 
  radius, 
  speed, 
  offset = 0,
  height = 0
}) => {
  const itemRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (itemRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      
      // Calculate position on orbit circle
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      
      // Set position with y offset for height
      itemRef.current.position.set(x, height, z);
      
      // Make the item always face the center
      itemRef.current.lookAt(0, height, 0);
    }
  });
  
  return (
    <group ref={itemRef}>
      <Html transform center>
        <div style={{
          width: `${size * 150}px`,
          height: `${size * 150}px`,
          overflow: 'hidden',
          borderRadius: '50%', 
          boxShadow: '0 0 15px rgba(153, 0, 255, 0.6), 0 0 30px rgba(0, 255, 204, 0.3)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          backdropFilter: 'blur(5px)',
          border: '2px solid rgba(255, 204, 0, 0.7)',
          transform: 'scale(1)',
          transition: 'transform 0.3s',
        }}
        className="logo-container">
          <img
            src={image}
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '50%',
              padding: '2px',
            }}
          />
        </div>
      </Html>
    </group>
  );
};

export default OrbitingLogo;