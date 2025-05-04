import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PulseWaveProps {
  frequency?: number;
  baseColor?: string;
  intensity?: number;
}

const PulseWave: React.FC<PulseWaveProps> = ({
  frequency = 1.5,
  baseColor = "#ff6600",
  intensity = 1.0
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Create a shader material for the pulse wave
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(baseColor) },
        intensity: { value: intensity },
      },
      vertexShader: `
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float intensity;
        
        varying vec3 vPosition;
        
        void main() {
          // Calculate distance from center
          float distance = length(vPosition);
          
          // Create multiple waves with different phases
          float wave1 = sin(distance * 3.0 - time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(distance * 5.0 - time * 3.0 + 1.0) * 0.5 + 0.5;
          float wave3 = sin(distance * 2.0 - time * 1.5 + 2.0) * 0.5 + 0.5;
          
          // Combine waves
          float waves = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3);
          
          // Fall off with distance from center
          float falloff = smoothstep(1.0, 0.0, distance);
          
          // Calculate final opacity
          float opacity = waves * falloff * intensity;
          
          // Output final color
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [baseColor, intensity]);
  
  // Update shader uniforms on each frame
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta * frequency;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <primitive object={shaderMaterial} ref={materialRef} />
    </mesh>
  );
};

export default PulseWave;