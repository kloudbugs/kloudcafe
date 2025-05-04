import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalacticTransformBlocksProps {
  position?: [number, number, number];
  count?: number;
  radius?: number;
  blockSize?: number;
  starSize?: number;
  blockColor?: string;
  starColor?: string;
  glowColor?: string;
}

// Animation states
enum AnimationState {
  BLOCKS,
  EXPLODING_TO_STARS,
  STARS,
  STARS_TO_NODES,
  NODES,
  REFORMING
}

// Star point type for animation
interface StarPoint {
  angle: number;
  length: number;
  speed: number;
}

// Block data type
interface BlockData {
  position: [number, number, number];
  initialOffset: [number, number, number];
  currentPosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  connections: number[];
  connectionCount: number;
  transitionProgress: number;
  transitionTarget: [number, number, number];
  rotationSpeed: [number, number, number];
  starPoints: StarPoint[];
  starRotation: number;
  starRotationSpeed: number;
  nodeSize: number;
  nodeColor: THREE.Color;
}

export default function GalacticTransformBlocks({
  position = [0, 0, 0],
  count = 12,
  radius = 4,
  blockSize = 0.5,
  starSize = 0.2,
  blockColor = '#7b2cbf',
  starColor = '#ffd700',
  glowColor = '#9d4edd'
}: GalacticTransformBlocksProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  // Animation state
  const [animationState, setAnimationState] = useState(AnimationState.BLOCKS);
  const [timer, setTimer] = useState(0);
  
  // Generate block positions
  const blocks = useMemo<BlockData[]>(() => {
    const items: BlockData[] = [];
    
    for (let i = 0; i < count; i++) {
      // Calculate positions in a sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      // Convert to Cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Random rotation
      const rx = Math.random() * Math.PI * 2;
      const ry = Math.random() * Math.PI * 2;
      const rz = Math.random() * Math.PI * 2;
      
      // Scale for block size slight variation
      const scale = 0.8 + Math.random() * 0.4;
      
      // Random offset for initial block position
      const offsetX = (Math.random() - 0.5) * 0.5;
      const offsetY = (Math.random() - 0.5) * 0.5;
      const offsetZ = (Math.random() - 0.5) * 0.5;
      
      // Node connection data - each block connects to 2-4 others
      const connections: number[] = [];
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      
      items.push({
        position: [x, y, z],
        initialOffset: [offsetX, offsetY, offsetZ],
        currentPosition: [x + offsetX, y + offsetY, z + offsetZ],
        rotation: [rx, ry, rz],
        scale,
        connections,
        connectionCount,
        // Transition parameters for smooth animations
        transitionProgress: 0,
        transitionTarget: [x, y, z],
        rotationSpeed: [(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01],
        // Star points for when blocks transform to stars
        starPoints: Array(8).fill(0).map(() => {
          const angle = Math.random() * Math.PI * 2;
          const length = 0.1 + Math.random() * 0.2;
          return {
            angle,
            length,
            speed: 0.5 + Math.random() * 1.5
          };
        }),
        starRotation: Math.random() * Math.PI * 2,
        starRotationSpeed: (Math.random() - 0.5) * 0.05,
        // Node parameters
        nodeSize: 0.1 + Math.random() * 0.1,
        nodeColor: new THREE.Color(starColor).offsetHSL(Math.random() * 0.1, 0, 0)
      });
    }
    
    // Setup node connections
    for (let i = 0; i < items.length; i++) {
      const blockA = items[i];
      
      // Create a list of potential connections based on distance
      const potentialConnections = items
        .filter((_, index) => index !== i) // Don't connect to self
        .map((blockB, index) => {
          const [xa, ya, za] = blockA.position;
          const [xb, yb, zb] = blockB.position;
          const distance = Math.sqrt(
            Math.pow(xa - xb, 2) + 
            Math.pow(ya - yb, 2) + 
            Math.pow(za - zb, 2)
          );
          return { index, distance };
        })
        .sort((a, b) => a.distance - b.distance);
      
      // Add the closest blocks as connections
      for (let j = 0; j < Math.min(blockA.connectionCount, potentialConnections.length); j++) {
        blockA.connections.push(potentialConnections[j].index);
      }
    }
    
    return items;
  }, [count, radius, starColor]);
  
  // Setup the animation cycle
  useEffect(() => {
    const stateTimings = {
      [AnimationState.BLOCKS]: 5000, // 5 seconds as blocks
      [AnimationState.EXPLODING_TO_STARS]: 2000, // 2 seconds transitioning to stars
      [AnimationState.STARS]: 3000, // 3 seconds as stars
      [AnimationState.STARS_TO_NODES]: 2000, // 2 seconds transitioning to nodes
      [AnimationState.NODES]: 4000, // 4 seconds as nodes
      [AnimationState.REFORMING]: 3000, // 3 seconds reforming to blocks
    };
    
    const advanceState = () => {
      setAnimationState(prevState => (prevState + 1) % Object.keys(AnimationState).length);
      setTimer(0);
    };
    
    const tick = setInterval(() => {
      setTimer(prev => {
        const newTime = prev + 100; // 100ms tick
        if (newTime >= stateTimings[animationState]) {
          advanceState();
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(tick);
  }, [animationState]);
  
  // Main animation frame
  useFrame((state, deltaTime) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    timeRef.current = time;
    
    // Global group rotation
    groupRef.current.rotation.y = time * 0.05;
    
    // Get ref to all the meshes
    const meshes = groupRef.current.children;
    
    // Progress percentage for current animation state
    const animationProgress = timer / 1000; // Convert to seconds
    
    // Update each mesh based on current animation state
    meshes.forEach((mesh, index) => {
      const block = blocks[index];
      if (!block || !mesh) return;
      
      // Get current materials
      const material = (mesh as THREE.Mesh).material as THREE.Material;
      
      switch(animationState) {
        case AnimationState.BLOCKS:
          // Gently floating blocks
          mesh.position.set(
            block.position[0] + Math.sin(time * 0.5 + index) * 0.1,
            block.position[1] + Math.sin(time * 0.4 + index * 0.7) * 0.1,
            block.position[2] + Math.sin(time * 0.6 + index * 0.3) * 0.1
          );
          
          // Gentle rotation
          mesh.rotation.x += block.rotationSpeed[0];
          mesh.rotation.y += block.rotationSpeed[1];
          mesh.rotation.z += block.rotationSpeed[2];
          
          // Set scale to block size
          mesh.scale.set(block.scale * blockSize, block.scale * blockSize, block.scale * blockSize);
          break;
          
        case AnimationState.EXPLODING_TO_STARS:
          // Explode in random directions
          const progress = animationProgress / 2; // 0 to 1 over 2 seconds
          const explodeDistance = progress * 1.5; // Max distance of 1.5 units
          
          // Move blocks outward
          mesh.position.set(
            block.position[0] * (1 + explodeDistance) + Math.sin(time * 0.5 + index) * 0.05,
            block.position[1] * (1 + explodeDistance) + Math.sin(time * 0.4 + index * 0.7) * 0.05,
            block.position[2] * (1 + explodeDistance) + Math.sin(time * 0.6 + index * 0.3) * 0.05
          );
          
          // Faster rotation during explosion
          mesh.rotation.x += block.rotationSpeed[0] * 3;
          mesh.rotation.y += block.rotationSpeed[1] * 3;
          mesh.rotation.z += block.rotationSpeed[2] * 3;
          
          // Transform from block to star shape
          const starTransform = Math.min(progress * 2, 1); // 0 to 1 over 1 second (first half)
          mesh.scale.set(
            block.scale * blockSize * (1 - starTransform) + starSize * starTransform,
            block.scale * blockSize * (1 - starTransform) + starSize * starTransform,
            block.scale * blockSize * (1 - starTransform) + starSize * starTransform
          );
          
          // Gradually change color
          if (material instanceof THREE.MeshStandardMaterial) {
            // Blend between block and star color
            const color = new THREE.Color(blockColor).lerp(new THREE.Color(starColor), starTransform);
            material.color = color;
            
            // Increase emissive as it becomes a star
            material.emissiveIntensity = 0.2 + starTransform * 0.4;
          }
          break;
          
        case AnimationState.STARS:
          // Star position with some floating motion
          mesh.position.set(
            block.position[0] * 2.5 + Math.sin(time * 0.8 + index) * 0.15,
            block.position[1] * 2.5 + Math.sin(time * 0.7 + index * 0.7) * 0.15,
            block.position[2] * 2.5 + Math.sin(time * 0.9 + index * 0.3) * 0.15
          );
          
          // Star rotation
          mesh.rotation.z = block.starRotation + time * block.starRotationSpeed;
          
          // Ensure star size
          mesh.scale.set(starSize, starSize, starSize);
          
          // Star-like pulsing
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissiveIntensity = 0.5 + Math.sin(time * 3 + index) * 0.2;
          }
          break;
          
        case AnimationState.STARS_TO_NODES:
          // Transition progress
          const nodeTransformProgress = animationProgress / 2; // 0 to 1 over 2 seconds
          
          // Move toward node positions (closer to origin)
          const nodePositionFactor = 1.5 - nodeTransformProgress * 0.5; // 1.5 to 1.0
          mesh.position.set(
            block.position[0] * nodePositionFactor * 2.5,
            block.position[1] * nodePositionFactor * 2.5,
            block.position[2] * nodePositionFactor * 2.5
          );
          
          // Shrink to node size
          const nodeScale = starSize * (1 - nodeTransformProgress) + block.nodeSize * nodeTransformProgress;
          mesh.scale.set(nodeScale, nodeScale, nodeScale);
          
          // Update material for node appearance
          if (material instanceof THREE.MeshStandardMaterial) {
            // Blend toward node color
            const nodeColorObj = new THREE.Color().copy(block.nodeColor);
            material.color.lerp(nodeColorObj, nodeTransformProgress);
            
            // Adjust emissiveness
            material.emissiveIntensity = 0.6 + nodeTransformProgress * 0.2;
          }
          break;
          
        case AnimationState.NODES:
          // Base node position
          const nodePos = [
            block.position[0] * 2.0,
            block.position[1] * 2.0,
            block.position[2] * 2.0
          ];
          
          // Small orbital motion
          mesh.position.set(
            nodePos[0] + Math.sin(time * 0.5 + index) * 0.05,
            nodePos[1] + Math.sin(time * 0.6 + index * 0.7) * 0.05,
            nodePos[2] + Math.sin(time * 0.4 + index * 0.3) * 0.05
          );
          
          // Keep node size
          mesh.scale.set(block.nodeSize, block.nodeSize, block.nodeSize);
          
          // Subtle pulse effect
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissiveIntensity = 0.7 + Math.sin(time * 2 + index) * 0.1;
          }
          
          // Draw node connections (handled outside this loop)
          break;
          
        case AnimationState.REFORMING:
          // Transition progress
          const reformProgress = animationProgress / 3; // 0 to 1 over 3 seconds
          
          // Move back toward original block positions
          const blockPositionFactor = 2.0 - reformProgress * 1.0; // 2.0 to 1.0
          
          mesh.position.set(
            block.position[0] * blockPositionFactor + (reformProgress * block.initialOffset[0]),
            block.position[1] * blockPositionFactor + (reformProgress * block.initialOffset[1]),
            block.position[2] * blockPositionFactor + (reformProgress * block.initialOffset[2])
          );
          
          // Grow back to block size
          const reformScale = block.nodeSize * (1 - reformProgress) + (block.scale * blockSize) * reformProgress;
          mesh.scale.set(reformScale, reformScale, reformScale);
          
          // Rotate back to block rotation
          const blockRotX = block.rotation[0] * reformProgress;
          const blockRotY = block.rotation[1] * reformProgress;
          const blockRotZ = block.rotation[2] * reformProgress;
          
          mesh.rotation.set(blockRotX, blockRotY, blockRotZ);
          
          // Transition color back to block color
          if (material instanceof THREE.MeshStandardMaterial) {
            const blockColorObj = new THREE.Color(blockColor);
            material.color.lerp(blockColorObj, reformProgress);
            material.emissiveIntensity = 0.8 - reformProgress * 0.6;
          }
          break;
      }
    });
    
    // Handle node connections in NODES state
    if (animationState === AnimationState.NODES) {
      // Remove any existing line meshes
      groupRef.current.children.forEach(child => {
        if (child.userData.isLine) {
          groupRef.current?.remove(child);
        }
      });
      
      // Draw connections between nodes
      blocks.forEach((block, i) => {
        const [x1, y1, z1] = [
          block.position[0] * 2.0,
          block.position[1] * 2.0,
          block.position[2] * 2.0
        ];
        
        block.connections.forEach(connectedIndex => {
          const connectedBlock = blocks[connectedIndex];
          const [x2, y2, z2] = [
            connectedBlock.position[0] * 2.0,
            connectedBlock.position[1] * 2.0,
            connectedBlock.position[2] * 2.0
          ];
          
          // Create line geometry
          const points = [];
          points.push(new THREE.Vector3(x1, y1, z1));
          points.push(new THREE.Vector3(x2, y2, z2));
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Glowing line material
          const material = new THREE.LineBasicMaterial({
            color: glowColor,
            transparent: true,
            opacity: 0.7 + Math.sin(time * 2 + i) * 0.2
          });
          
          // Create the line
          const line = new THREE.Line(geometry, material);
          line.userData.isLine = true;
          
          // Add to group
          groupRef.current?.add(line);
        });
      });
    }
  });
  
  return (
    <group position={[position[0], position[1], position[2]]} ref={groupRef}>
      {blocks.map((block, i) => (
        <mesh 
          key={i}
          position={[block.position[0], block.position[1], block.position[2]]}
          rotation={[block.rotation[0], block.rotation[1], block.rotation[2]]}
          scale={[block.scale * blockSize, block.scale * blockSize, block.scale * blockSize]}
        >
          {/* Use box geometry that will morph into star/node during animation */}
          <boxGeometry />
          <meshStandardMaterial 
            color={blockColor}
            emissive={blockColor}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}