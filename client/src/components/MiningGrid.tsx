import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface MiningGridProps {
  width?: number;
  height?: number;
  depth?: number;
  cellSize?: number;
  maxBlockSize?: number;
}

// This component creates a grid-like structure of mining blocks
// Similar to the mempool visualization in the reference image
const MiningGrid: React.FC<MiningGridProps> = ({
  width = 10,
  height = 10,
  depth = 0.1,
  cellSize = 0.2,
  maxBlockSize = 4, // Maximum block size in cells
}) => {
  const gridRef = useRef<THREE.Group>(null);
  const controls = useControls();
  
  const coreColor = controls.getColorByScheme('core');
  const tendrilColor = controls.getColorByScheme('tendril');
  
  // Create materials
  const blockMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4b8b3b'), // Green for blocks
      emissive: new THREE.Color('#447a33'),
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.95,
    }), 
  []);
  
  const highlightMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#68a859'), // Lighter green for highlighted blocks
      emissive: new THREE.Color('#68a859'),
      emissiveIntensity: 0.25,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95,
    }), 
  []);
  
  const edgeMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: new THREE.Color('#1e2a3d'), // Dark blue for grid lines
      opacity: 0.7,
      transparent: true,
    }), 
  []);
  
  // Generate grid data using a space-filling algorithm
  const gridBlocks = useMemo(() => {
    const blocks = [];
    const grid = Array(width).fill(0).map(() => Array(height).fill(false));
    
    // Fill grid with blocks of different sizes
    const fillGrid = (remainingCells: number, depth = 0) => {
      if (remainingCells <= 0 || depth > 100) return;
      
      // Find an empty spot
      let startX = -1, startY = -1;
      outerLoop: 
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (!grid[x][y]) {
            startX = x;
            startY = y;
            break outerLoop;
          }
        }
      }
      
      if (startX === -1) return; // Grid is full
      
      // Determine maximum possible block size at this position
      let blockSize = 1;
      let canExpand = true;
      
      while (canExpand && blockSize < maxBlockSize) {
        // Try to expand in both directions
        const newSize = blockSize + 1;
        
        // Check if we can expand
        if (startX + newSize > width || startY + newSize > height) {
          canExpand = false;
          continue;
        }
        
        // Check if all cells in expanded area are empty
        for (let x = startX; x < startX + newSize; x++) {
          for (let y = startY; y < startY + newSize; y++) {
            if (grid[x][y]) {
              canExpand = false;
              break;
            }
          }
          if (!canExpand) break;
        }
        
        if (canExpand) blockSize = newSize;
      }
      
      // Mark cells as filled
      for (let x = startX; x < startX + blockSize; x++) {
        for (let y = startY; y < startY + blockSize; y++) {
          grid[x][y] = true;
        }
      }
      
      // Calculate block position and dimensions
      const blockWidth = blockSize * cellSize;
      const blockHeight = blockSize * cellSize;
      const posX = startX * cellSize - (width * cellSize / 2) + (blockWidth / 2);
      const posY = startY * cellSize - (height * cellSize / 2) + (blockHeight / 2);
      
      // Add some randomization to the blocks
      const isHighlighted = Math.random() < 0.2; // 20% chance to be highlighted
      const blockDepth = depth * (0.8 + Math.random() * 0.4); // Randomize depth a bit
      
      blocks.push({
        position: new THREE.Vector3(posX, posY, 0),
        size: new THREE.Vector3(blockWidth - 0.02, blockHeight - 0.02, blockDepth),
        isHighlighted,
      });
      
      // Continue filling remaining cells
      fillGrid(remainingCells - blockSize * blockSize, depth + 1);
    };
    
    // Start filling grid
    fillGrid(width * height);
    
    return blocks;
  }, [width, height, cellSize, maxBlockSize, depth]);
  
  // Animation
  useFrame((_, delta) => {
    if (!gridRef.current) return;
    
    // Rotate the entire grid slightly based on autoRotate setting
    if (controls.autoRotate) {
      gridRef.current.rotation.y += delta * controls.rotationSpeed * 0.05;
      gridRef.current.rotation.x += delta * controls.rotationSpeed * 0.02;
    }
  });
  
  // Create the edges of the entire grid
  const gridEdges = useMemo(() => {
    const gridWidth = width * cellSize;
    const gridHeight = height * cellSize;
    
    const vertices = [
      // Bottom face
      -gridWidth/2, -gridHeight/2, 0,
      gridWidth/2, -gridHeight/2, 0,
      gridWidth/2, gridHeight/2, 0,
      -gridWidth/2, gridHeight/2, 0,
      -gridWidth/2, -gridHeight/2, 0,
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  }, [width, height, cellSize]);
  
  return (
    <group ref={gridRef} position={[0, 0, -5]}>
      {/* Grid outline */}
      <line geometry={gridEdges} material={edgeMaterial} />
      
      {/* Grid blocks */}
      {gridBlocks.map((block, index) => (
        <mesh 
          key={index}
          position={block.position}
          material={block.isHighlighted ? highlightMaterial : blockMaterial}
        >
          <boxGeometry args={[block.size.x, block.size.y, block.size.z]} />
        </mesh>
      ))}
    </group>
  );
};

export default MiningGrid;