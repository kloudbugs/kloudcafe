import React, { useRef, useMemo, useState, useEffect } from 'react';
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

// This component creates a 3D cube structure of mining blocks
const MiningGrid: React.FC<MiningGridProps> = ({
  width = 10,
  height = 10,
  depth = 10,
  cellSize = 0.2,
  maxBlockSize = 2, // Maximum block size in cells
}) => {
  const gridRef = useRef<THREE.Group>(null);
  const controls = useControls();
  
  const primaryColor = controls.getColorByScheme('core');
  const accentColor = controls.getColorByScheme('tendril');
  const highlightColor = controls.getColorByScheme('pulse');
  
  // Create materials
  const blockMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#23374d'), // Dark blue for blocks
      emissive: new THREE.Color(primaryColor),
      emissiveIntensity: 0.15,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    }), 
  [primaryColor]);
  
  const highlightMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#345277'), // Lighter blue for highlighted blocks
      emissive: new THREE.Color(highlightColor),
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.95,
    }), 
  [highlightColor]);
  
  const edgeMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: new THREE.Color(accentColor), // Purple/accent color for grid lines
      opacity: 0.9,
      transparent: true,
    }), 
  [accentColor]);
  
  const goldMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'), // Gold for special blocks
      emissive: new THREE.Color('#ffd700'),
      emissiveIntensity: 0.3,
      metalness: 1.0,
      roughness: 0.1,
      transparent: true,
      opacity: 0.95,
    }), 
  []);
  
  interface BlockData {
    position: THREE.Vector3;
    size: THREE.Vector3;
    type: 'normal' | 'highlight' | 'gold';
    rotationSpeed?: THREE.Vector3;
    pulseFrequency?: number;
    pulsePhase?: number;
  }
  
  // Generate 3D mining cube
  const gridBlocks = useMemo(() => {
    const blocks: BlockData[] = [];
    const grid = Array(width).fill(0).map(() => 
      Array(height).fill(0).map(() => 
        Array(depth).fill(false)
      )
    );
    
    // Create cube frame edges
    const halfWidth = width * cellSize / 2;
    const halfHeight = height * cellSize / 2;
    const halfDepth = depth * cellSize / 2;
    
    // Add frame corners (gold blocks)
    const cornerPositions = [
      [-halfWidth, -halfHeight, -halfDepth],
      [halfWidth, -halfHeight, -halfDepth],
      [-halfWidth, halfHeight, -halfDepth],
      [halfWidth, halfHeight, -halfDepth],
      [-halfWidth, -halfHeight, halfDepth],
      [halfWidth, -halfHeight, halfDepth],
      [-halfWidth, halfHeight, halfDepth],
      [halfWidth, halfHeight, halfDepth],
    ];
    
    cornerPositions.forEach(pos => {
      blocks.push({
        position: new THREE.Vector3(pos[0], pos[1], pos[2]),
        size: new THREE.Vector3(cellSize * 1.2, cellSize * 1.2, cellSize * 1.2),
        type: 'gold',
        pulseFrequency: 0.5 + Math.random() * 1.0,
        pulsePhase: Math.random() * Math.PI * 2
      });
    });
    
    // Fill interior with random blocks
    const totalCells = width * height * depth;
    const desiredFillPercentage = 0.05; // Only fill 5% of the volume with blocks
    const targetBlockCount = Math.floor(totalCells * desiredFillPercentage);
    
    for (let i = 0; i < targetBlockCount; i++) {
      // Find a random empty spot
      let attempts = 0;
      let placed = false;
      
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * (width - maxBlockSize));
        const y = Math.floor(Math.random() * (height - maxBlockSize));
        const z = Math.floor(Math.random() * (depth - maxBlockSize));
        
        // Check if space is available
        let isEmpty = true;
        let sizeX = 1 + Math.floor(Math.random() * (maxBlockSize - 1));
        let sizeY = 1 + Math.floor(Math.random() * (maxBlockSize - 1));
        let sizeZ = 1 + Math.floor(Math.random() * (maxBlockSize - 1));
        
        for (let dx = 0; dx < sizeX && isEmpty; dx++) {
          for (let dy = 0; dy < sizeY && isEmpty; dy++) {
            for (let dz = 0; dz < sizeZ && isEmpty; dz++) {
              if (x + dx >= width || y + dy >= height || z + dz >= depth || grid[x + dx][y + dy][z + dz]) {
                isEmpty = false;
              }
            }
          }
        }
        
        if (isEmpty) {
          // Mark as filled
          for (let dx = 0; dx < sizeX; dx++) {
            for (let dy = 0; dy < sizeY; dy++) {
              for (let dz = 0; dz < sizeZ; dz++) {
                grid[x + dx][y + dy][z + dz] = true;
              }
            }
          }
          
          // Add the block
          const blockWidth = sizeX * cellSize;
          const blockHeight = sizeY * cellSize;
          const blockDepth = sizeZ * cellSize;
          
          const posX = x * cellSize - halfWidth + (blockWidth / 2);
          const posY = y * cellSize - halfHeight + (blockHeight / 2);
          const posZ = z * cellSize - halfDepth + (blockDepth / 2);
          
          // Determine block type (most normal, some highlighted)
          const blockType = Math.random() < 0.2 ? 'highlight' : 'normal';
          
          blocks.push({
            position: new THREE.Vector3(posX, posY, posZ),
            size: new THREE.Vector3(
              blockWidth * 0.9, // Slightly smaller than cell for spacing
              blockHeight * 0.9,
              blockDepth * 0.9
            ),
            type: blockType,
            rotationSpeed: new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01
            ),
            pulseFrequency: 0.2 + Math.random() * 0.5,
            pulsePhase: Math.random() * Math.PI * 2
          });
          
          placed = true;
        }
        
        attempts++;
      }
    }
    
    return blocks;
  }, [width, height, depth, cellSize, maxBlockSize, goldMaterial]);
  
  // Create cube frame edges
  const cubeEdges = useMemo(() => {
    const halfWidth = width * cellSize / 2;
    const halfHeight = height * cellSize / 2;
    const halfDepth = depth * cellSize / 2;
    
    const vertices = [
      // Bottom face (z = -halfDepth)
      -halfWidth, -halfHeight, -halfDepth,
      halfWidth, -halfHeight, -halfDepth,
      halfWidth, halfHeight, -halfDepth,
      -halfWidth, halfHeight, -halfDepth,
      -halfWidth, -halfHeight, -halfDepth,
      
      // Top face (z = halfDepth)
      -halfWidth, -halfHeight, halfDepth,
      halfWidth, -halfHeight, halfDepth,
      halfWidth, halfHeight, halfDepth,
      -halfWidth, halfHeight, halfDepth,
      -halfWidth, -halfHeight, halfDepth,
      
      // Connect bottom to top
      -halfWidth, -halfHeight, -halfDepth,
      -halfWidth, -halfHeight, halfDepth,
      
      // Move to another corner
      halfWidth, -halfHeight, -halfDepth,
      halfWidth, -halfHeight, halfDepth,
      
      // Move to another corner
      halfWidth, halfHeight, -halfDepth,
      halfWidth, halfHeight, halfDepth,
      
      // Move to last corner
      -halfWidth, halfHeight, -halfDepth,
      -halfWidth, halfHeight, halfDepth,
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  }, [width, height, depth, cellSize]);
  
  // Handle animations
  const [time, setTime] = useState(0);
  
  useFrame((_, delta) => {
    if (!gridRef.current) return;
    
    // Update time
    setTime(prevTime => prevTime + delta);
    
    // Rotate the entire grid based on autoRotate setting
    if (controls.autoRotate) {
      gridRef.current.rotation.y += delta * controls.rotationSpeed * 0.05;
      gridRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }
    
    // Animate individual blocks
    gridRef.current.children.forEach((child, index) => {
      if (index > 0) { // Skip the cube edges which is the first child
        const block = gridBlocks[index - 1];
        
        // Apply rotation if this block has rotation speed
        if (block.rotationSpeed) {
          child.rotation.x += block.rotationSpeed.x;
          child.rotation.y += block.rotationSpeed.y;
          child.rotation.z += block.rotationSpeed.z;
        }
        
        // Apply pulsing effect if block has pulse frequency
        if (block.pulseFrequency && block.pulsePhase !== undefined) {
          const scale = 1 + 0.05 * Math.sin(time * block.pulseFrequency + block.pulsePhase);
          child.scale.set(scale, scale, scale);
        }
      }
    });
  });
  
  return (
    <group ref={gridRef} position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
      {/* Cube frame edges */}
      <primitive object={new THREE.LineSegments(cubeEdges, edgeMaterial)} />
      
      {/* Grid blocks */}
      {gridBlocks.map((block, index) => (
        <mesh 
          key={index}
          position={block.position}
          material={
            block.type === 'gold' 
              ? goldMaterial
              : block.type === 'highlight' 
                ? highlightMaterial 
                : blockMaterial
          }
        >
          <boxGeometry args={[block.size.x, block.size.y, block.size.z]} />
        </mesh>
      ))}
    </group>
  );
};

export default MiningGrid;