import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import fragmentShader from "../lib/shaders/tendril/fragment.glsl";
import vertexShader from "../lib/shaders/tendril/vertex.glsl";

// Create a custom shader material for the tendrils
const TendrilMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xff4400),
    length: 1.0,
    thickness: 0.05,
    tipColor: new THREE.Color(0xff8800),
    noiseScale: 1.0,
    noiseSpeed: 0.2,
    pulseSpeed: 0.5,
    baseOpacity: 0.8,
  },
  vertexShader,
  fragmentShader
);

// Add the material to the THREE namespace for JSX usage
extend({ TendrilMaterial });

// TypeScript type for the extended material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      tendrilMaterial: any;
    }
  }
}

interface TendrilsProps {
  direction: THREE.Vector3;
  length: number;
  phaseOffset: number;
  speed: number;
  color?: string;
}

const Tendrils: React.FC<TendrilsProps> = ({
  direction,
  length,
  phaseOffset,
  speed,
  color = "#ff4400"
}) => {
  // Reference to the shader material
  const materialRef = useRef<any>();
  // Reference to the tube mesh
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a curved path for the tendril
  const curve = useMemo(() => {
    // Create a base direction
    const baseDir = direction.clone();
    
    // Create points along a curve
    const curvePoints = [];
    const segments = Math.max(5, Math.floor(length * 5)); // More segments for longer tendrils
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const position = new THREE.Vector3().copy(baseDir).multiplyScalar(t * length);
      
      // Add some curve variation to make it look organic
      if (i > 0 && i < segments) {
        // Curve increases toward the end of the tendril
        const curveFactor = t * 0.3; 
        
        // Create random perpendicular vectors for natural movement
        const perp1 = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        
        // Make sure it's perpendicular to the base direction
        perp1.crossVectors(perp1, baseDir).normalize();
        
        // Add curved offset
        position.add(
          perp1.multiplyScalar(Math.sin(t * Math.PI) * curveFactor)
        );
      }
      
      curvePoints.push(position);
    }
    
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [direction, length]);
  
  // Create the tube geometry from the curve
  const geometry = useMemo(() => {
    const segments = Math.max(12, Math.floor(length * 8));
    const radius = 0.05 * (1.0 - length * 0.1); // Thinner tendrils for longer ones
    const radiusSegments = 6;
    
    return new THREE.TubeGeometry(curve, segments, radius, radiusSegments, false);
  }, [curve, length]);
  
  // Apply color from props
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color = new THREE.Color(color);
      // Calculate a lighter color for the tip based on the provided color
      const tipColor = new THREE.Color(color);
      tipColor.multiplyScalar(1.5); // Make it brighter
      materialRef.current.tipColor = tipColor;
    }
  }, [color]);
  
  // Animation
  useFrame((_, delta) => {
    if (materialRef.current) {
      // Update time for shader animation
      materialRef.current.time += delta * speed;
      
      // Apply the phase offset for varied movement
      const time = materialRef.current.time + phaseOffset;
      
      // Calculate movement displacement
      const displacementX = Math.sin(time * 0.5) * 0.15;
      const displacementY = Math.cos(time * 0.3) * 0.15;
      const displacementZ = Math.sin(time * 0.7) * 0.15;
      
      // Apply movement to the tendril mesh
      if (meshRef.current) {
        const basePosition = direction.clone().multiplyScalar(0.1);
        meshRef.current.position.set(
          basePosition.x + displacementX,
          basePosition.y + displacementY,
          basePosition.z + displacementZ
        );
      }
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <tendrilMaterial 
        ref={materialRef}
        length={length}
        thickness={0.05 * (1.0 - length * 0.1)}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default Tendrils;
