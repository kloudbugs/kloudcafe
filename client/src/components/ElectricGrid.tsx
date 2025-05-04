import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface ElectricGridProps {
  size?: number;
  gridDivisions?: number;
  nodeSize?: number;
  coreColor?: string;
}

const ElectricGrid: React.FC<ElectricGridProps> = ({
  size = 3,
  gridDivisions = 3,
  nodeSize = 0.15,
  coreColor
}) => {
  const gridRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const edgesRef = useRef<THREE.Line[]>([]);
  
  const controls = useControls();
  const color = coreColor || controls.getColorByScheme('core');
  const accentColor = controls.getColorByScheme('tendril');

  // Create materials
  const nodeMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    }), 
  [color]);
  
  const edgeMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.8,
    }), 
  [accentColor]);
  
  const cubeMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.2,
      wireframe: false,
      side: THREE.DoubleSide,
    }), 
  [color]);
  
  // Create grid nodes and edges
  const { nodes, edges, cubes } = useMemo(() => {
    const nodes: {position: THREE.Vector3, scale: number}[] = [];
    const edges: {start: THREE.Vector3, end: THREE.Vector3}[] = [];
    const cubes: {position: THREE.Vector3, scale: number}[] = [];
    
    // Calculate grid step based on size and divisions
    const step = size / (gridDivisions - 1);
    const halfSize = size / 2;
    
    // Generate nodes at grid points
    for (let x = 0; x < gridDivisions; x++) {
      for (let y = 0; y < gridDivisions; y++) {
        for (let z = 0; z < gridDivisions; z++) {
          // Skip some inner points for more interesting look
          if (x > 0 && x < gridDivisions - 1 && 
              y > 0 && y < gridDivisions - 1 && 
              z > 0 && z < gridDivisions - 1 && 
              Math.random() > 0.3) {
            continue;
          }
          
          // Calculate position
          const posX = (x * step) - halfSize;
          const posY = (y * step) - halfSize;
          const posZ = (z * step) - halfSize;
          
          // Only place nodes on the outer shell or randomly in the interior
          const isEdgeNode = x === 0 || x === gridDivisions - 1 || 
                            y === 0 || y === gridDivisions - 1 || 
                            z === 0 || z === gridDivisions - 1;
          
          if (isEdgeNode || Math.random() < 0.4) {
            // Random size variation for nodes
            const scaleFactor = 0.8 + Math.random() * 0.4;
            
            nodes.push({
              position: new THREE.Vector3(posX, posY, posZ),
              scale: nodeSize * scaleFactor
            });
            
            // Add some cubes for a more mechanical look
            if (Math.random() < 0.3 && (isEdgeNode || Math.random() < 0.2)) {
              cubes.push({
                position: new THREE.Vector3(posX, posY, posZ),
                scale: nodeSize * 2.5 * (0.8 + Math.random() * 0.4)
              });
            }
          }
        }
      }
    }
    
    // Connect nodes with edges
    // We don't want to connect all nodes - just enough to create a network effect
    const maxDistance = step * 1.8; // Only connect reasonably close nodes
    
    for (let i = 0; i < nodes.length; i++) {
      // Connect to grid-aligned neighbors first 
      // (nodes that share 2 of 3 coordinates - like up, down, left, right)
      const found = { x: false, y: false, z: false, diag: false };
      
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        const dx = Math.abs(node1.position.x - node2.position.x);
        const dy = Math.abs(node1.position.y - node2.position.y);
        const dz = Math.abs(node1.position.z - node2.position.z);
        
        const isGridAligned = (dx < 0.01 && dy < 0.01) || 
                              (dx < 0.01 && dz < 0.01) || 
                              (dy < 0.01 && dz < 0.01);
        
        const distance = node1.position.distanceTo(node2.position);
        
        if (distance <= maxDistance) {
          // Add all grid-aligned connections and some random ones for more structure
          if (isGridAligned || (!found.diag && Math.random() < 0.15)) {
            edges.push({
              start: node1.position.clone(),
              end: node2.position.clone()
            });
            
            // Mark that we found a connection in this direction
            if (isGridAligned) {
              if (dx < 0.01 && dy < 0.01) found.z = true;
              else if (dx < 0.01 && dz < 0.01) found.y = true;
              else if (dy < 0.01 && dz < 0.01) found.x = true;
            } else {
              found.diag = true;
            }
          }
        }
      }
    }
    
    return { nodes, edges, cubes };
  }, [size, gridDivisions, nodeSize]);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!gridRef.current) return;
    
    // Pulse the nodes slightly
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const time = Date.now() * 0.001;
      const scale = nodes[i].scale * (0.9 + Math.sin(time * 2 + i) * 0.1);
      node.scale.set(scale, scale, scale);
    });
    
    // Rotate the entire grid based on auto rotation settings
    if (controls.autoRotate) {
      gridRef.current.rotation.y += delta * controls.rotationSpeed * 0.3;
      gridRef.current.rotation.x += delta * controls.rotationSpeed * 0.1;
    }
  });
  
  return (
    <group ref={gridRef}>
      {/* Grid nodes (spheres at intersection points) */}
      {nodes.map((node, i) => (
        <mesh 
          key={`node-${i}`}
          position={node.position}
          ref={el => el && (nodesRef.current[i] = el)}
          material={nodeMaterial}
        >
          <sphereGeometry args={[node.scale, 16, 16]} />
        </mesh>
      ))}
      
      {/* Grid edges (lines connecting nodes) */}
      {edges.map((edge, i) => {
        const points = [edge.start, edge.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive 
            key={`edge-${i}`}
            object={new THREE.Line(geometry, edgeMaterial)}
            ref={el => el && (edgesRef.current[i] = el)}
          />
        );
      })}
      
      {/* Cube blocks */}
      {cubes.map((cube, i) => (
        <mesh
          key={`cube-${i}`}
          position={cube.position}
          material={cubeMaterial}
        >
          <boxGeometry args={[cube.scale, cube.scale, cube.scale]} />
        </mesh>
      ))}
      
      {/* Central transparent cube outline */}
      <mesh material={cubeMaterial}>
        <boxGeometry args={[size, size, size]} />
      </mesh>
    </group>
  );
};

export default ElectricGrid;