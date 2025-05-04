import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MouseInteractionLayerProps {
  radius?: number;
  strength?: number;
  visible?: boolean;
}

const MouseInteractionLayer: React.FC<MouseInteractionLayerProps> = ({
  radius = 4,
  strength = 0.3,
  visible = false,
}) => {
  const { viewport, camera } = useThree();
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0));
  const sphereRef = useRef<THREE.Mesh>(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  
  // Handle mouse move events
  useEffect(() => {
    const updateMousePosition = (event: MouseEvent) => {
      // Calculate normalized device coordinates
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(pointer, camera);
      
      // Create a plane at z=0 
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const target = new THREE.Vector3();
      
      // Calculate intersection point
      raycaster.ray.intersectPlane(plane, target);
      
      // Update state
      setMousePosition(target);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [camera]);
  
  // Update sphere position to follow mouse
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.copy(mousePosition);
      
      // Add a subtle lag/smoothing effect
      sphereRef.current.position.lerp(mousePosition, 0.1);
    }
  });
  
  // Create a glowing effect for visualization
  const material = useRef(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff8844'),
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    })
  );
  
  return (
    <mesh ref={sphereRef} visible={visible}>
      <sphereGeometry args={[radius, 16, 16]} />
      <primitive object={material.current} />
    </mesh>
  );
};

export default MouseInteractionLayer;