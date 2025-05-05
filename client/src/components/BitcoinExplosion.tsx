import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';
import { Text } from '@react-three/drei';

interface BitcoinParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface BitcoinExplosionProps {
  position: THREE.Vector3;
  count?: number;
  color?: string;
  onComplete?: () => void;
}

const BitcoinExplosion: React.FC<BitcoinExplosionProps> = ({
  position,
  count = 15,
  color = '#ffcc00',
  onComplete
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Group[]>([]);
  const controls = useControls();
  
  // Generate particles with random velocities
  const particles = useMemo<BitcoinParticle[]>(() => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      // Random direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Random velocity
      const speed = 0.05 + Math.random() * 0.15;
      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * speed;
      
      // Random rotation speed
      const rotX = (Math.random() - 0.5) * 0.1;
      const rotY = (Math.random() - 0.5) * 0.1;
      const rotZ = (Math.random() - 0.5) * 0.1;
      
      // Random life duration
      const life = 1.0;
      const maxLife = 1.0;
      
      particles.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(vx, vy, vz),
        scale: 0.3 + Math.random() * 0.3,
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(rotX, rotY, rotZ),
        life,
        maxLife
      });
    }
    return particles;
  }, [count]);
  
  // Setup refs on component mount
  useEffect(() => {
    particleRefs.current = particleRefs.current.slice(0, count);
  }, [count]);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    
    let allExpired = true;
    
    particles.forEach((particle, i) => {
      const particleGroup = particleRefs.current[i];
      if (!particleGroup) return;
      
      // Update life
      particle.life -= delta;
      
      // If still alive, update position and rotation
      if (particle.life > 0) {
        allExpired = false;
        
        // Move particle
        particle.position.add(particle.velocity);
        
        // Apply gravity
        particle.velocity.y -= 0.002;
        
        // Rotate particle
        particleGroup.rotation.x += particle.rotationSpeed.x;
        particleGroup.rotation.y += particle.rotationSpeed.y;
        particleGroup.rotation.z += particle.rotationSpeed.z;
        
        // Set position
        particleGroup.position.copy(particle.position);
        
        // Fade out
        const opacity = particle.life / particle.maxLife;
        const scale = particle.scale * (0.7 + 0.3 * opacity);
        particleGroup.scale.set(scale, scale, scale);
      } else {
        // Hide expired particles
        particleGroup.visible = false;
      }
    });
    
    // Call onComplete when all particles have expired
    if (allExpired && onComplete) {
      onComplete();
    }
  });
  
  return (
    <group ref={particlesRef} position={position}>
      {particles.map((particle, i) => (
        <group 
          key={i} 
          ref={el => el && (particleRefs.current[i] = el)}
          position={particle.position}
          rotation={particle.rotation}
          scale={particle.scale}
        >
          <mesh>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.2}
            />
            <Text
              fontSize={0.35}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              userData={{ keepAlive: true }} // Prevents Text from being culled
            >
              ₿
            </Text>
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default BitcoinExplosion;