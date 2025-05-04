import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import fragmentShader from "../lib/shaders/glow/fragment.glsl";
import vertexShader from "../lib/shaders/glow/vertex.glsl";

// Create a custom shader material for the glowing core
const GlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xf5733e), // Orange-red color
    pulseSpeed: 0.5,
    glowIntensity: 1.2,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  vertexShader,
  fragmentShader
);

// Add the material to the THREE namespace so it can be used with useRef
extend({ GlowMaterial });

// TypeScript type for the extended material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      glowMaterial: any;
    }
  }
}

interface CellCoreProps {
  radius?: number;
  detail?: number;
  intensity?: number;
  color?: string;
}

const CellCore: React.FC<CellCoreProps> = ({ 
  radius = 1.5, 
  detail = 32,
  intensity = 1.0,
  color = "#ff3300"
}) => {
  // Reference to the custom shader material
  const materialRef = useRef<any>();
  
  // Create noise texture for the core
  const noiseTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    
    for (let i = 0; i < size * size; i++) {
      const stride = i * 4;
      const noise = Math.random() * 255;
      
      data[stride] = noise;
      data[stride + 1] = noise;
      data[stride + 2] = noise;
      data[stride + 3] = 255;
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Reference for the group
  const groupRef = useRef<THREE.Group>(null);
  
  // Update the shader uniforms on each frame
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
      
      // Pulsing size effect
      if (groupRef.current) {
        const pulseScale = 1 + Math.sin(materialRef.current.time * 0.5) * 0.05;
        groupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main core sphere with glow effect */}
      <mesh>
        <sphereGeometry args={[radius, detail, detail]} />
        <glowMaterial ref={materialRef} />
      </mesh>
      
      {/* Inner sphere for additional depth */}
      <mesh>
        <sphereGeometry args={[radius * 0.85, detail, detail]} />
        <meshStandardMaterial 
          color="#ff3300"
          emissive="#ff5500"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.6}
          map={noiseTexture}
        />
      </mesh>
      
      {/* Add point light inside the core for glow effect */}
      <pointLight 
        color="#ff6600" 
        intensity={5} 
        distance={10} 
        decay={2} 
      />
    </group>
  );
};

export default CellCore;
