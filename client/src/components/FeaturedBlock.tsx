import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from '../lib/stores/useControls';

interface FeaturedBlockProps {
  position?: THREE.Vector3;
  targetPosition?: THREE.Vector3;
  size?: number;
  color?: string;
  active: boolean;
  onComplete?: () => void;
}

const FeaturedBlock: React.FC<FeaturedBlockProps> = ({
  position = new THREE.Vector3(0, 0, 0),
  targetPosition,
  size = 1,
  color,
  active,
  onComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startPosition] = useState(() => position.clone());
  const [endPosition] = useState(() => targetPosition || new THREE.Vector3(0, 0, 5));
  
  const { camera } = useThree();
  const controls = useControls();
  const actualColor = color || controls.getColorByScheme('core');
  const edgeColor = controls.getColorByScheme('tendril');
  
  // Geometry and materials
  const blockGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const edgesGeometry = new THREE.EdgesGeometry(blockGeometry);
  
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: actualColor,
    emissive: actualColor,
    emissiveIntensity: 0.8,
    metalness: 0.8,
    roughness: 0.2,
  });
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: edgeColor,
    transparent: true,
    opacity: 0.8,
    linewidth: 2,
  });
  
  // Start animation when active changes to true
  useEffect(() => {
    if (active && !isAnimating) {
      setIsAnimating(true);
      setAnimationProgress(0);
    }
  }, [active, isAnimating]);
  
  // Animation logic
  useFrame((_, delta) => {
    if (!meshRef.current || !isAnimating) return;
    
    // Update animation progress
    if (animationProgress < 1) {
      setAnimationProgress(prev => {
        // Ease-in-out animation
        const newProgress = prev + delta * 0.7; // Adjust speed here
        return Math.min(newProgress, 1);
      });
    } else if (animationProgress >= 1) {
      // Animation completed
      setIsAnimating(false);
      if (onComplete) onComplete();
    }
    
    // Interpolate position
    const t = easeInOutCubic(animationProgress);
    const newPos = new THREE.Vector3().lerpVectors(startPosition, endPosition, t);
    meshRef.current.position.copy(newPos);
    if (edgesRef.current) {
      edgesRef.current.position.copy(newPos);
    }
    
    // Scale based on animation progress - grow then shrink slightly
    const scale = 0.3 + Math.sin(Math.PI * t) * 0.2 + t * 1.2;
    meshRef.current.scale.set(scale, scale, scale);
    if (edgesRef.current) {
      edgesRef.current.scale.set(scale, scale, scale);
    }
    
    // Rotate for effect
    meshRef.current.rotation.x += delta * 2;
    meshRef.current.rotation.y += delta * 3;
    if (edgesRef.current) {
      edgesRef.current.rotation.copy(meshRef.current.rotation);
    }
  });
  
  // Easing function for smooth animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  
  return (
    <group visible={active || isAnimating}>
      <mesh ref={meshRef} geometry={blockGeometry} material={blockMaterial} />
      <lineSegments ref={edgesRef} geometry={edgesGeometry} material={lineMaterial} />
    </group>
  );
};

export default FeaturedBlock;