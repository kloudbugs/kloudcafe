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
  color: string; // Added color property for individual particle colors
}

interface BitcoinExplosionProps {
  position: THREE.Vector3;
  count?: number;
  color?: string;
  onComplete?: () => void;
}

const BitcoinExplosion: React.FC<BitcoinExplosionProps> = ({
  position,
  count = 25, // Increased number of particles
  color = '#ffcc00',
  onComplete
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Group[]>([]);
  const controls = useControls();
  
  // Generate particles with random velocities
  const particles = useMemo<BitcoinParticle[]>(() => {
    // Define cosmic colors for particles
    const colors = [
      '#ffcc00', // Gold
      '#9900ff', // Purple
      '#00ffee', // Cyan
      '#ff00cc', // Pink
    ];
    
    const particles = [];
    for (let i = 0; i < count; i++) {
      // Random direction with more upward bias for dramatic effect
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Enhanced random velocity with more variance
      const speed = 0.07 + Math.random() * 0.2;
      const upwardBias = 0.05; // Add upward bias
      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed + upwardBias;
      const vz = Math.cos(phi) * speed;
      
      // Faster and more varied rotation for dramatic effect
      const rotX = (Math.random() - 0.5) * 0.2;
      const rotY = (Math.random() - 0.5) * 0.2;
      const rotZ = (Math.random() - 0.5) * 0.2;
      
      // Longer, varied life duration for more interesting explosion
      const lifeVariance = 0.5 + Math.random() * 1.0;
      const life = lifeVariance;
      const maxLife = lifeVariance;
      
      // Random particle color
      const particleColor = colors[Math.floor(Math.random() * colors.length)];
      
      particles.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(vx, vy, vz),
        scale: 0.25 + Math.random() * 0.4, // More varied scales
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(rotX, rotY, rotZ),
        life,
        maxLife,
        color: particleColor // Store color for each particle
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
              color={particle.color} 
              emissive={particle.color}
              emissiveIntensity={1.2} // Increased emissive intensity for brighter effect
              metalness={0.8}
              roughness={0.2}
              toneMapped={false} // Makes colors more vibrant
            />
            <Text
              fontSize={0.35}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              userData={{ keepAlive: true }} // Prevents Text from being culled
              outlineWidth={0.02} // Add outline for better visibility
              outlineColor="#000000"
              font="https://fonts.gstatic.com/s/audiowide/v16/l7gdbjpo0cum0ckerWCtkQ.woff" // Use Audiowide font
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