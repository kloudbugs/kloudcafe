import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CellCore from "./CellCore";
import MiningBlocks from "./MiningBlocks";
import ElectricGrid from "./ElectricGrid";
import ElectricTendrils from "./ElectricTendrils";
import { useControls } from "../lib/stores/useControls";

// Main Cell component with electric grid core and mining blocks
const Cell: React.FC = () => {
  const controls = useControls();
  
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
      {/* The bitcoin core with electric grid - add className for DOM access */}
      <group className="bitcoin-core">
        <ElectricGrid 
          size={3} 
          gridDivisions={4}
          nodeSize={0.15}
        />
        
        {/* Electric tendrils inside the core */}
        <ElectricTendrils 
          count={12} 
          length={1.5} 
          width={0.03}
        />
      </group>
      
      {/* Mining blocks orbiting around core */}
      <MiningBlocks 
        count={controls.blockCount} 
        orbitRadius={4.5} 
        minDistance={3.5}
        maxDistance={5.5}
      />
    </group>
  );
};

export default Cell;
