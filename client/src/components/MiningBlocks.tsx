import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';
import { useAudio } from '../lib/stores/useAudio';
import BitcoinExplosion from './BitcoinExplosion';
import ElectricHandSimple from './ElectricHandSimple';

interface MiningBlocksProps {
  count?: number;
  orbitRadius?: number;
  minDistance?: number;
  maxDistance?: number;
}

interface BlockDataType {
  position: THREE.Vector3;
  rotationSpeed: number;
  rotationAxis: THREE.Vector3;
  orbitSpeed: number;
  orbitRadius: number;
  orbitPhase: number;
  orbitInclination: number;
  scale: number;
  pulsePhase: number;
  pulseSpeed: number;
  explodeCountdown: number;
  exploding: boolean;
  // Add voltage field to track electric charge
  voltage: number;
  // Track if this block has a hand effect active
  handEffectActive: boolean;
}

interface ExplosionData {
  position: THREE.Vector3;
  color: string;
  id: number;
}

interface ElectricHandData {
  position: THREE.Vector3;
  target: THREE.Vector3;
  color: string;
  id: number;
}

const MiningBlocks: React.FC<MiningBlocksProps> = ({
  count = 12,
  orbitRadius: baseOrbitRadius = 4,
  minDistance = 3.5,
  maxDistance = 6,
}) => {
  // Rename to avoid variable name collision
  const orbitRadius = baseOrbitRadius;
  const blocksRef = useRef<THREE.Group>(null);
  const blockRefs = useRef<THREE.Mesh[]>([]);
  const groupRefs = useRef<THREE.Group[]>([]);
  
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [electricHands, setElectricHands] = useState<ElectricHandData[]>([]);
  const [nextExplosionId, setNextExplosionId] = useState(0);
  const [nextHandId, setNextHandId] = useState(0);
  
  // Reference to camera for positioning electric hands
  const { camera } = useThree();
  
  const controls = useControls();
  const audio = useAudio();
  const coreColor = controls.getColorByScheme('core');
  const tendrilColor = controls.getColorByScheme('tendril');
  const electricBlue = '#00aaff'; // Electric effect color
  
  // Create inner block geometry and materials - using tunic cube style
  const blockGeometry = useMemo(() => new THREE.BoxGeometry(0.4, 0.4, 0.4), []);
  
  // Main block material
  const blockMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    }), 
  [coreColor]);
  
  // Edge line material
  const lineMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: tendrilColor,
      transparent: true,
      opacity: 0.8,
      linewidth: 1,
    }),
  [tendrilColor]);
  
  // Create edges geometry for the tunic cube effect
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(blockGeometry);
  }, [blockGeometry]);
  
  // Generate initial positions and properties for blocks
  const blockData = useMemo<BlockDataType[]>(() => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      // Random position in a sphere around the center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      // Random rotation speed and axis
      const rotationSpeed = 0.2 + Math.random() * 0.5;
      const rotationAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      
      // Random orbit
      const orbitSpeed = 0.1 + Math.random() * 0.3;
      const blockOrbitRadius = orbitRadius * (0.8 + Math.random() * 0.4);
      const orbitPhase = Math.random() * Math.PI * 2;
      const orbitInclination = Math.random() * Math.PI * 0.3;
      
      // Pulse animation properties (for tunic-like effect)
      const pulsePhase = Math.random() * Math.PI * 2;
      const pulseSpeed = 0.5 + Math.random() * 1.5;
      
      // Explosion timer - random time between 15-60 seconds
      const explodeCountdown = 10 + Math.random() * 45;
      
      data.push({
        position: new THREE.Vector3(x, y, z),
        rotationSpeed,
        rotationAxis,
        orbitSpeed,
        orbitRadius: blockOrbitRadius,
        orbitPhase,
        orbitInclination,
        scale: 0.7 + Math.random() * 0.6,
        pulsePhase,
        pulseSpeed,
        explodeCountdown,
        exploding: false,
        // Initialize voltage field (0 to 1 representing charge level)
        voltage: Math.random() * 0.5,
        // No hand effect initially
        handEffectActive: false,
      });
    }
    
    return data;
  }, [count, minDistance, maxDistance, orbitRadius]);
  
  // Setup refs when component mounts
  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, count);
    groupRefs.current = groupRefs.current.slice(0, count);
  }, [count]);
  
  // Create an electric hand effect from camera to block
  const createElectricHand = (targetPosition: THREE.Vector3) => {
    // Use camera position as starting point for the electric hand
    const cameraPosition = camera.position.clone();
    
    // Create a new electric hand effect
    const newHand: ElectricHandData = {
      position: cameraPosition,
      target: targetPosition.clone(),
      color: electricBlue,
      id: nextHandId,
    };
    
    setElectricHands(prev => [...prev, newHand]);
    setNextHandId(prev => prev + 1);
    
    // Play electricity sound
    if (audio.hitSound) {
      audio.playHit();
    }
    
    // Return the ID for cleanup later
    return nextHandId;
  };
  
  // Handle explosion of a block
  const explodeBlock = (index: number, position: THREE.Vector3) => {
    // Make block invisible - will reset visibility later
    if (groupRefs.current[index]) {
      groupRefs.current[index].visible = false;
    }
    
    // First trigger electric hand effect from camera to block
    if (!blockData[index].handEffectActive) {
      blockData[index].handEffectActive = true;
      createElectricHand(position);
      
      // Delay explosion to allow electric effect to finish
      setTimeout(() => {
        // Create explosion at this position
        const newExplosion = {
          position: position.clone(),
          color: Math.random() > 0.5 ? tendrilColor : coreColor,
          id: nextExplosionId,
        };
        
        setExplosions(prev => [...prev, newExplosion]);
        setNextExplosionId(prev => prev + 1);
        
        // Play explosion sound
        if (audio.hitSound) {
          audio.playHit();
        }
      }, 1500); // Delay explosion by 1.5 seconds
    }
    
    // Reset block state after explosion
    setTimeout(() => {
      // Make block visible again
      if (groupRefs.current[index]) {
        groupRefs.current[index].visible = true;
      }
      
      // Reset explosion timer and voltage for future
      blockData[index].explodeCountdown = 15 + Math.random() * 45;
      blockData[index].exploding = false;
      blockData[index].handEffectActive = false;
      blockData[index].voltage = Math.random() * 0.5;
    }, 3500); // Longer timeout to accommodate electric effect plus explosion
  };
  
  // Remove an explosion when it's complete
  const handleExplosionComplete = (id: number) => {
    setExplosions(prev => prev.filter(exp => exp.id !== id));
  };
  
  // Remove an electric hand effect when it's complete
  const handleElectricHandComplete = (id: number) => {
    setElectricHands(prev => prev.filter(hand => hand.id !== id));
  };
  
  // Animation loop
  useFrame((_, delta) => {
    if (!blocksRef.current) return;
    
    // Update each block's position, rotation, and pulse
    blockData.forEach((data, i) => {
      const blockMesh = blockRefs.current[i];
      const blockGroup = groupRefs.current[i];
      if (!blockMesh || !blockGroup) return;
      
      // Update pulsing animation phase
      data.pulsePhase += delta * data.pulseSpeed;
      
      // Calculate pulse factor (0.9 to 1.1)
      const pulseFactor = 0.92 + Math.sin(data.pulsePhase) * 0.08 + Math.cos(data.pulsePhase * 0.7) * 0.1;
      
      // Update orbit position
      data.orbitPhase += delta * data.orbitSpeed;
      
      // Calculate new position based on orbit
      const orbitX = Math.cos(data.orbitPhase) * data.orbitRadius;
      const orbitZ = Math.sin(data.orbitPhase) * data.orbitRadius;
      const orbitY = Math.sin(data.orbitPhase + data.orbitInclination) * data.orbitRadius * 0.3;
      
      // Calculate world position for the block
      const worldPos = new THREE.Vector3(
        data.position.x + orbitX * 0.2,
        data.position.y + orbitY * 0.2,
        data.position.z + orbitZ * 0.2
      );
      
      // Apply position to group
      blockGroup.position.copy(worldPos);
      
      // Apply pulse scale to block mesh
      blockMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Rotate block
      blockMesh.rotateOnAxis(data.rotationAxis, delta * data.rotationSpeed);
      
      // Update explosion countdown
      if (!data.exploding) {
        data.explodeCountdown -= delta;
        
        // Check if it's time to explode
        if (data.explodeCountdown <= 0) {
          data.exploding = true;
          explodeBlock(i, worldPos);
        }
      }
    });
    
    // Rotate the entire group slowly if auto-rotate is enabled
    if (controls.autoRotate) {
      blocksRef.current.rotation.y += delta * controls.rotationSpeed * 0.2;
    }
  });
  
  return (
    <>
      <group ref={blocksRef}>
        {blockData.map((data, i) => (
          <group 
            key={i} 
            position={data.position} 
            scale={data.scale}
            ref={el => el && (groupRefs.current[i] = el)}
          >
            {/* Main block mesh */}
            <mesh 
              ref={el => el && (blockRefs.current[i] = el)} 
              geometry={blockGeometry} 
              material={blockMaterial}
            />
            {/* Edge lines for tunic cube effect */}
            <lineSegments geometry={edgesGeometry} material={lineMaterial} />
            
            {/* Show Bitcoin logo for blocks with higher voltage */}
            {data.voltage > 0.7 && !data.exploding && (
              <sprite
                scale={[0.3, 0.3, 0.3]}
                position={[0, 0.3, 0]}
              >
                <spriteMaterial
                  map={new THREE.TextureLoader().load("/images/bitcoin_symbol.svg")}
                  transparent
                  opacity={0.8}
                  color="#ffcc00"
                  toneMapped={false}
                  depthTest={false}
                />
              </sprite>
            )}
          </group>
        ))}
      </group>
      
      {/* Render active explosions */}
      {explosions.map((explosion) => (
        <BitcoinExplosion
          key={explosion.id}
          position={explosion.position}
          color={explosion.color}
          onComplete={() => handleExplosionComplete(explosion.id)}
        />
      ))}
      
      {/* Render electric hand effects */}
      {electricHands.map((hand) => (
        <ElectricHandSimple
          key={hand.id}
          position={hand.position}
          target={hand.target}
          color={hand.color}
          duration={2.0}
          onComplete={() => handleElectricHandComplete(hand.id)}
        />
      ))}
    </>
  );
};

export default MiningBlocks;