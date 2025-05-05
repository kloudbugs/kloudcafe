import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface ElectricHandProps {
  position: THREE.Vector3;
  target?: THREE.Vector3;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

interface LightningBolt {
  points: THREE.Vector3[];
  width: number;
  segments: number;
  displacement: number;
  life: number;
  maxLife: number;
  color: THREE.Color;
}

interface HandSegment {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  progress: number;
}

// Creates a procedural lightning bolt between two points
const createLightningBolt = (
  start: THREE.Vector3, 
  end: THREE.Vector3, 
  segmentsCount: number = 10, 
  maxDisplacement: number = 0.3,
  color: string = '#00ffff'
): LightningBolt => {
  const points: THREE.Vector3[] = [];
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const stepLength = length / segmentsCount;
  
  points.push(start.clone());
  
  let currentPoint = start.clone();
  const directionNormalized = direction.clone().normalize();
  
  // Create intermediate points with random displacement
  for (let i = 1; i < segmentsCount; i++) {
    // Move along the path
    const nextPoint = currentPoint.clone().add(
      directionNormalized.clone().multiplyScalar(stepLength)
    );
    
    // Add random displacement perpendicular to direction
    const perpendicular = new THREE.Vector3(
      Math.random() - 0.5, 
      Math.random() - 0.5, 
      Math.random() - 0.5
    ).normalize();
    
    // Make perpendicular vector truly perpendicular to direction
    perpendicular.sub(
      directionNormalized.clone().multiplyScalar(
        perpendicular.dot(directionNormalized)
      )
    ).normalize();
    
    // Scale displacement based on distance from ends and random factor
    const displacementScale = Math.min(i, segmentsCount - i) / segmentsCount;
    const displacement = maxDisplacement * displacementScale * (0.5 + Math.random());
    
    nextPoint.add(perpendicular.multiplyScalar(displacement));
    points.push(nextPoint);
    
    currentPoint = nextPoint;
  }
  
  // Add end point
  points.push(end.clone());
  
  return {
    points,
    width: 0.05 + Math.random() * 0.05,
    segments: segmentsCount,
    displacement: maxDisplacement,
    life: 1.0,
    maxLife: 1.0,
    color: new THREE.Color(color)
  };
};

// Create a Taurus constellation-like pattern with nodes and connecting starry electric lines
const createConstellationNodes = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  nodeCount: number = 12 // More nodes for a richer constellation
): HandSegment[] => {
  const segments: HandSegment[] = [];
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  
  // Create a central node - main star of the constellation
  const centerPosition = new THREE.Vector3().lerpVectors(start, end, 0.5);
  segments.push({
    position: centerPosition,
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.18, // Larger central star
    progress: 0
  });
  
  // Create outer nodes in a Taurus-like horned pattern
  // The Taurus constellation looks roughly like a V with extensions
  
  // Define a radius for the constellation spread
  const constellationRadius = 1.2;
  
  // Create the main V shape nodes (the face of Taurus)
  const taurusNode1 = centerPosition.clone().add(
    new THREE.Vector3(constellationRadius * 0.4, constellationRadius * 0.4, 0)
  );
  
  const taurusNode2 = centerPosition.clone().add(
    new THREE.Vector3(-constellationRadius * 0.4, constellationRadius * 0.4, 0)
  );
  
  // Central star (Aldebaran - the Eye of the Bull)
  segments.push({
    position: centerPosition.clone().add(new THREE.Vector3(0, constellationRadius * 0.2, 0)),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.15, // Prominent star
    progress: 0
  });
  
  // Create the V Shape (face) of Taurus
  segments.push({
    position: taurusNode1,
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.1,
    progress: 0
  });
  
  segments.push({
    position: taurusNode2,
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.1,
    progress: 0
  });
  
  // Create the horn extensions
  // Right horn
  segments.push({
    position: taurusNode1.clone().add(new THREE.Vector3(constellationRadius * 0.3, constellationRadius * 0.2, 0)),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.08,
    progress: 0
  });
  
  segments.push({
    position: taurusNode1.clone().add(new THREE.Vector3(constellationRadius * 0.6, constellationRadius * 0.3, 0)),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.06,
    progress: 0
  });
  
  // Left horn
  segments.push({
    position: taurusNode2.clone().add(new THREE.Vector3(-constellationRadius * 0.3, constellationRadius * 0.2, 0)),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.08,
    progress: 0
  });
  
  segments.push({
    position: taurusNode2.clone().add(new THREE.Vector3(-constellationRadius * 0.6, constellationRadius * 0.3, 0)),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 0.06,
    progress: 0
  });
  
  // Add the Pleiades star cluster (the Seven Sisters) as smaller nodes
  const pleiadesCenter = centerPosition.clone().add(new THREE.Vector3(0, constellationRadius * 0.7, 0));
  
  // Create a small cluster of 7 stars
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const radius = 0.2 + Math.random() * 0.1;
    
    segments.push({
      position: pleiadesCenter.clone().add(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        )
      ),
      rotation: new THREE.Euler(0, 0, 0),
      scale: 0.03 + Math.random() * 0.02, // Small stars in the cluster
      progress: 0
    });
  }
  
  // Add some random background stars to fill out the constellation
  for (let i = 0; i < 10; i++) {
    const randomPosition = centerPosition.clone().add(
      new THREE.Vector3(
        (Math.random() - 0.5) * constellationRadius * 2,
        (Math.random() - 0.5) * constellationRadius * 2,
        (Math.random() - 0.5) * constellationRadius * 0.5
      )
    );
    
    segments.push({
      position: randomPosition,
      rotation: new THREE.Euler(0, 0, 0),
      scale: 0.02 + Math.random() * 0.04, // Various sized background stars
      progress: 0
    });
  }
  
  return segments;
};

const ElectricHand: React.FC<ElectricHandProps> = ({
  position,
  target = new THREE.Vector3(0, 0, 0),
  color = '#00ffff',
  duration = 2.0,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const lineGroupRef = useRef<THREE.Group>(null);
  const handSegmentRefs = useRef<THREE.Mesh[]>([]);
  
  const controls = useControls();
  
  // Secondary color for variation
  const secondaryColor = useMemo(() => {
    // Use Bitcoin gold as secondary color
    return '#ffcc00';
  }, []);
  
  // Create lightning bolts
  const bolts = useMemo<LightningBolt[]>(() => {
    const boltsArray: LightningBolt[] = [];
    const mainBoltCount = 3;
    const branchBoltCount = 5;
    
    // Create main bolts from position to target
    for (let i = 0; i < mainBoltCount; i++) {
      boltsArray.push(createLightningBolt(
        position, 
        target, 
        10 + Math.floor(Math.random() * 5),
        0.3 + Math.random() * 0.2,
        i % 2 === 0 ? color : secondaryColor
      ));
      
      // Create branch bolts
      for (let j = 0; j < branchBoltCount; j++) {
        // Pick a random point along the main bolt to start branch
        const currentMainBolt = boltsArray[boltsArray.length - 1];
        const startIndex = 1 + Math.floor(Math.random() * (currentMainBolt.segments - 1));
        const branchStartPoint = currentMainBolt.points[startIndex].clone();
        
        // Create a random end point for branch
        const branchLength = 0.5 + Math.random() * 1.0;
        const branchDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
        
        const endPoint = branchStartPoint.clone().add(
          branchDirection.multiplyScalar(branchLength)
        );
        
        // Create and add branch bolt
        boltsArray.push(createLightningBolt(
          branchStartPoint,
          endPoint,
          3 + Math.floor(Math.random() * 3),
          0.1 + Math.random() * 0.2,
          j % 2 === 0 ? color : secondaryColor
        ));
      }
    }
    
    return boltsArray;
  }, [position, target, color, secondaryColor]);
  
  // Create constellation nodes for the Taurus pattern
  const handSegments = useMemo<HandSegment[]>(() => {
    return createConstellationNodes(position, target);
  }, [position, target]);
  
  // Create lines for each bolt
  const boltLines = useMemo(() => {
    return bolts.map(bolt => {
      const geometry = new THREE.BufferGeometry().setFromPoints(bolt.points);
      return {
        geometry,
        width: bolt.width,
        color: bolt.color.clone()
      };
    });
  }, [bolts]);
  
  // Initialize refs
  useEffect(() => {
    handSegmentRefs.current = handSegmentRefs.current.slice(0, handSegments.length);
  }, [handSegments.length]);
  
  // Track animation time
  const animationTime = useRef<number>(0);
  const completed = useRef<boolean>(false);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current || completed.current) return;
    
    // Update animation time
    animationTime.current += delta;
    const progress = Math.min(animationTime.current / duration, 1);
    
    // Animation phases:
    // 0-0.3: Lightning appears and grows
    // 0.3-0.7: Hand appears at the end of lightning
    // 0.7-1.0: Lightning and hand fade out
    
    // Update lightning bolts
    bolts.forEach((bolt, i) => {
      // Calculate life based on animation phase
      if (progress < 0.3) {
        // Grow phase
        bolt.life = progress / 0.3;
      } else if (progress > 0.7) {
        // Fade out phase
        bolt.life = 1 - (progress - 0.7) / 0.3;
      } else {
        // Full intensity phase
        bolt.life = 1;
        
        // Jitter the lightning during this phase
        if (i % 3 === 0) {
          const jitterAmount = 0.1;
          bolt.points.forEach((point, j) => {
            if (j > 0 && j < bolt.points.length - 1) {
              point.x += (Math.random() - 0.5) * jitterAmount;
              point.y += (Math.random() - 0.5) * jitterAmount;
              point.z += (Math.random() - 0.5) * jitterAmount;
            }
          });
          
          // Update geometry
          if (boltLines[i]) {
            const geometry = boltLines[i].geometry;
            geometry.setFromPoints(bolt.points);
            geometry.attributes.position.needsUpdate = true;
          }
        }
      }
    });
    
    // Update hand segments
    handSegments.forEach((segment, i) => {
      if (progress >= 0.3 && progress <= 1.0) {
        // Calculate progress for this segment
        const handPhaseProgress = (progress - 0.3) / 0.4; // 0 to 1 during hand phase
        
        // Stagger the appearance of segments
        const segmentDelay = i * 0.05;
        const segmentProgress = Math.max(0, Math.min(1, (handPhaseProgress - segmentDelay) * 2));
        
        segment.progress = segmentProgress;
        
        // Fade out during final phase
        if (progress > 0.7) {
          segment.progress *= 1 - (progress - 0.7) / 0.3;
        }
        
        // Update segment mesh
        const mesh = handSegmentRefs.current[i];
        if (mesh) {
          mesh.visible = segment.progress > 0;
          mesh.scale.setScalar(segment.scale * segment.progress);
          
          // Make hand segments pulse slightly
          const pulseFactor = 1 + Math.sin(animationTime.current * 10 + i) * 0.1;
          mesh.scale.multiplyScalar(pulseFactor);
          
          // Glow intensity based on progress
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material) {
            material.emissiveIntensity = 1 * segment.progress;
          }
        }
      } else {
        // Hide segment before its phase
        const mesh = handSegmentRefs.current[i];
        if (mesh) {
          mesh.visible = false;
        }
      }
    });
    
    // Update material opacity for all lightning lines
    boltLines.forEach((line, i) => {
      if (lineGroupRef.current && lineGroupRef.current.children[i]) {
        const lineMesh = lineGroupRef.current.children[i] as THREE.Line;
        const material = lineMesh.material as THREE.LineBasicMaterial;
        if (material) {
          material.opacity = bolts[i].life;
          
          // Make lightning color pulse between primary and secondary colors
          const colorMix = Math.sin(animationTime.current * 15 + i) * 0.5 + 0.5;
          material.color.lerpColors(
            new THREE.Color(color),
            new THREE.Color(secondaryColor),
            colorMix
          );
        }
      }
    });
    
    // Check if animation is complete
    if (progress >= 1.0 && !completed.current) {
      completed.current = true;
      if (onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Lightning bolts */}
      <group ref={lineGroupRef}>
        {boltLines.map((line, i) => (
          <mesh key={i}>
            <bufferGeometry attach="geometry" {...line.geometry} />
            <lineBasicMaterial
              attach="material"
              color={line.color}
              linewidth={line.width}
              transparent
              opacity={1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Hand segments with various robot-like shapes */}
      {handSegments.map((segment, i) => {
        // Choose different geometry for different parts
        let geometry;
        
        // First three segments are wrist and palm - use box geometries
        if (i < 3) {
          // Use box for palm and wrist segments (more robotic)
          geometry = <boxGeometry args={[1.2, 0.8, 0.4]} />;
        } 
        // Finger segments - alternate between different shapes
        else if (i % 3 === 0) {
          // Knuckles - use cylindrical shapes
          geometry = <cylinderGeometry args={[0.5, 0.5, 1.2, 8]} />;
        } 
        else if (i % 3 === 1) {
          // Middle finger segments - use boxes
          geometry = <boxGeometry args={[0.6, 0.6, 1.2]} />;
        } 
        else {
          // Finger tips - use cones
          geometry = <coneGeometry args={[0.5, 1, 8]} />;
        }
        
        // Small connector elements
        if (i > 15) {
          // Small connecting joints
          geometry = <torusGeometry args={[0.5, 0.2, 8, 8]} />;
        }
        
        return (
          <mesh
            key={i}
            ref={el => el && (handSegmentRefs.current[i] = el)}
            position={segment.position}
            rotation={segment.rotation}
            scale={0} // Start with zero scale, will be animated
          >
            {geometry}
            <meshStandardMaterial
              color={i % 2 === 0 ? color : secondaryColor}
              emissive={i % 2 === 0 ? color : secondaryColor}
              emissiveIntensity={1.5}
              transparent
              opacity={0.9}
              toneMapped={false}
              metalness={0.8} // More metallic for robot look
              roughness={0.2} // Less rough for shiny robot appearance
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default ElectricHand;