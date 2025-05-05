import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BackgroundParticlesProps {
  count?: number;
  radius?: number;
  size?: number;
  color?: string;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  count = 400,
  radius = 30,
  size = 0.05,
  color = "#ff6600"
}) => {
  // Reference to the points object
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create particles in a spherical distribution
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Parse the color to RGB
    const colorObj = new THREE.Color(color);
    const r = colorObj.r;
    const g = colorObj.g;
    const b = colorObj.b;
    
    for (let i = 0; i < count; i++) {
      // Random position in a spherical volume
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius * Math.cbrt(Math.random()); // Cube root for more even distribution
      
      // Convert to Cartesian coordinates
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      // Set position
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Set color with slight variations for more natural look
      const intensity = 0.2 + Math.random() * 0.5;
      colors[i * 3] = r * intensity;
      colors[i * 3 + 1] = g * intensity;
      colors[i * 3 + 2] = b * intensity;
    }
    
    return [positions, colors];
  }, [count, radius, color]);
  
  // Create the particles material
  const particleMaterial = useMemo(() => {
    // Create a circular texture for particles
    const texture = new THREE.CanvasTexture(createCircleTexture());
    
    const material = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: texture,
    });
    
    return material;
  }, [size]);
  
  // Helper function to create a circular particle texture
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d');
    if (!context) return canvas;
    
    // Draw a circular gradient
    const gradient = context.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    
    return canvas;
  }
  
  // Animate particles
  useFrame((_, delta) => {
    if (pointsRef.current) {
      // Slowly rotate the entire particle system
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
      
      // Optional: make particles twinkle or pulse
      const particles = pointsRef.current.geometry.attributes.position.array;
      const colors = pointsRef.current.geometry.attributes.color.array;
      
      for (let i = 0; i < count; i++) {
        // Subtle position fluctuation
        if (i % 5 === 0) { // Only move some particles for performance
          const idx = i * 3;
          particles[idx] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          particles[idx + 1] += Math.cos(Date.now() * 0.002 + i) * 0.01;
          
          // Subtle color pulsing
          const pulse = Math.sin(Date.now() * 0.001 + i) * 0.1 + 0.9;
          colors[idx] *= pulse;
          colors[idx + 1] *= pulse;
          colors[idx + 2] *= pulse;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={particleMaterial} />
    </points>
  );
};

export default BackgroundParticles;