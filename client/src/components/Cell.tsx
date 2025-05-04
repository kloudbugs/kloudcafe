import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CellCore from "./CellCore";
import Tendrils from "./Tendrils";
import MiningBlocks from "./MiningBlocks";
import { useControls } from "../lib/stores/useControls";

// Main Cell component combining core and tendrils
const Cell: React.FC = () => {
  const controls = useControls();
  
  // Pre-calculate positions for each tendril
  const tendrilData = useMemo(() => {
    const data = [];
    
    // Create a spherical distribution for tendril origins
    for (let i = 0; i < controls.tendrilCount; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(-1 + (2 * i) / controls.tendrilCount);
      const theta = Math.sqrt(controls.tendrilCount * Math.PI) * phi;
      
      // Calculate position on sphere
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      
      // Create a unique direction vector for this tendril
      const direction = new THREE.Vector3(x, y, z).normalize();
      
      // Random length variation
      const length = 1.5 + Math.random() * 1.5;
      
      // Random phase offset for animation
      const phaseOffset = Math.random() * Math.PI * 2;
      
      // Random animation speed variation
      const speed = 0.5 + Math.random() * 1.0;
      
      data.push({
        direction,
        length,
        phaseOffset,
        speed,
      });
    }
    
    return data;
  }, [controls.tendrilCount]);
  
  // Central group for the entire cell
  const cellGroup = useMemo(() => new THREE.Group(), []);
  
  // Slowly rotate the entire cell for added dynamism
  useFrame((_, delta) => {
    if (controls.autoRotate) {
      cellGroup.rotation.y += delta * controls.rotationSpeed;
      cellGroup.rotation.x += delta * controls.rotationSpeed * 0.4;
    }
  });
  
  return (
    <group ref={(ref) => ref && (cellGroup.copy(ref), ref.clear(), ref.add(cellGroup))}>
      {/* The glowing core */}
      <CellCore 
        intensity={controls.coreIntensity} 
        color={controls.getColorByScheme('core')}
      />
      
      {/* Mining blocks orbiting around core */}
      <MiningBlocks 
        count={controls.blockCount} 
        orbitRadius={4.5} 
        minDistance={3.5}
        maxDistance={5.5}
      />
      
      {/* Multiple tendrils radiating from the core */}
      {tendrilData.map((data, index) => (
        <Tendrils 
          key={index}
          direction={data.direction}
          length={data.length}
          phaseOffset={data.phaseOffset}
          speed={data.speed}
          color={controls.getColorByScheme('tendril')}
        />
      ))}
    </group>
  );
};

export default Cell;
