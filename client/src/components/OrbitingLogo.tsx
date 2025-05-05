import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './OrbitingLogo.css';

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
  // Removed the blue bean mining token with helmet and Bitcoin badge as requested
  const logos = [
    { 
      image: '/attached_assets/146DFB52-35C2-46E6-966A-ABDA69B3A96A.png', 
      size: 0.85, 
      offset: 0, 
      height: 0 
    },
    { 
      image: '/attached_assets/DE2097B5-8651-4353-A8B0-58F7193A6A35.png', 
      size: 0.75, 
      offset: Math.PI * 0.67, 
      height: -0.1 
    },
    { 
      image: '/attached_assets/F67167C2-A805-40EF-A76C-93BA70792E11.png', 
      size: 0.8, 
      offset: Math.PI * 1.33, 
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
      
      {/* Enhanced Bitcoin Symbol for center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.9}
          roughness={0.1}
          emissive="#ff9900"
          emissiveIntensity={0.7}
        />
        <Html position={[0, 0, 0.5]} transform center>
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,204,0,0.7) 0%, rgba(255,153,0,0.4) 70%, rgba(255,153,0,0) 100%)',
            boxShadow: '0 0 20px rgba(255, 204, 0, 0.8)',
          }}>
            {/* Pulsing outer ring */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.7)',
              animation: 'bitcoin-pulse 2s infinite ease-in-out',
            }}></div>
            
            {/* Bitcoin symbol */}
            <div style={{ 
              fontSize: '2.5rem', 
              color: '#ffffff',
              textShadow: '0 0 5px #ffcc00, 0 0 10px #ffcc00, 0 0 15px #ffcc00',
              fontWeight: 'bold',
              zIndex: '2',
              transform: 'scale(1.2)',
            }}>
              ₿
            </div>
            
            <style>{`
              @keyframes bitcoin-pulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.15); opacity: 0.3; }
                100% { transform: scale(1); opacity: 0.7; }
              }
            `}</style>
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
      {/* HTML Logo wrapper with enhanced border effects */}
      <Html transform center>
        <div style={{
          position: 'relative',
          width: `${size * 160}px`,
          height: `${size * 160}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-in-out',
        }}
        className="logo-container">
          {/* Outer glow/energy border */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255, 204, 0, 0.3), rgba(0, 255, 204, 0.3), rgba(153, 0, 255, 0.3))',
            boxShadow: '0 0 25px rgba(0, 255, 204, 0.6), 0 0 40px rgba(153, 0, 255, 0.4)',
            filter: 'blur(3px)',
            animation: 'pulse 3s infinite alternate',
            zIndex: '-1',
          }}></div>
          
          {/* Electric zap effect (always visible) */}
          <div className="electric-zap"></div>
          
          {/* Middle border with electricity pattern */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '90%',
            height: '90%',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            boxShadow: 'inset 0 0 15px rgba(0, 255, 255, 0.7)',
            zIndex: '-1',
          }}></div>
          
          {/* Inner container for image */}
          <div style={{
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(5px)',
            border: '4px solid rgba(255, 204, 0, 0.8)',
            boxShadow: 'inset 0 0 10px rgba(255, 204, 0, 0.5), 0 0 20px rgba(255, 204, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px',
          }}>
            <img
              src={image}
              alt="KloudBugs Logo"
              style={{
                width: '92%',
                height: '92%',
                objectFit: 'contain', // Changed from 'cover' to 'contain' to prevent distortion
                borderRadius: '50%',
                padding: '4px', // Add padding to prevent image from touching the border
              }}
            />
          </div>
          
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.7; transform: scale(0.98); }
              100% { opacity: 1; transform: scale(1.02); }
            }
          `}</style>
        </div>
      </Html>
    </group>
  );
};

export default OrbitingLogo;