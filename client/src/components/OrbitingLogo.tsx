import React, { useRef, useEffect, useState } from 'react';
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [pngUrls, setPngUrls] = useState<Record<string, string | null>>({});
  
  // Load PNG images when component mounts
  useEffect(() => {
    // Try to access the global image loader
    if (typeof window !== 'undefined' && (window as any).loadOrbitingLogos) {
      const urls = (window as any).loadOrbitingLogos();
      setPngUrls(urls);
      setImagesLoaded(true);
      console.log('Loaded orbiting logo images');
    } else {
      console.log('PNG loader not available, falling back to SVGs');
      setImagesLoaded(true);
    }
  }, []);
  
  // Use only the specific PNG logo files you uploaded
  // Added back all logos, including the blue bean logo with pickaxe
  const logos = [
    { 
      image: '/attached_assets/146DFB52-35C2-46E6-966A-ABDA69B3A96A.png', 
      size: 0.85, 
      offset: 0, 
      height: 0 
    },
    { 
      image: '/attached_assets/4D8F4D50-6BB4-4CA8-B4FF-07639180B7CD.png', 
      size: 0.8, 
      offset: Math.PI * 0.67, 
      height: 0.2 
    },
    { 
      image: '/attached_assets/DE2097B5-8651-4353-A8B0-58F7193A6A35.png', 
      size: 0.75, 
      offset: Math.PI * 1.33, 
      height: -0.1 
    },
    { 
      image: '/attached_assets/F67167C2-A805-40EF-A76C-93BA70792E11.png', 
      size: 0.8, 
      offset: Math.PI * 2, 
      height: 0.15 
    }
  ];

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the entire group slightly
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Always render - don't wait for images as the user might not see anything otherwise
  
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
          emissiveIntensity={0.5}
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
      {/* HTML Logo wrapper - Just your original images */}
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
            alt="KloudBugs Logo"
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