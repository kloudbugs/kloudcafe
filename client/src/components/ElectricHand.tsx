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

// Create a hand shape from simple geometries
const createHandSegments = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  fingerCount: number = 5
): HandSegment[] => {
  const segments: HandSegment[] = [];
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  
  // Create palm
  const palmPosition = new THREE.Vector3().lerpVectors(start, end, 0.6);
  segments.push({
    position: palmPosition,
    rotation: new THREE.Euler(
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2
    ),
    scale: 0.25 + Math.random() * 0.1,
    progress: 0
  });
  
  // Create fingers
  const fingerBasePosition = new THREE.Vector3().lerpVectors(start, end, 0.75);
  const fingerSpread = 0.15;
  
  for (let i = 0; i < fingerCount; i++) {
    // Calculate position offset for finger around a semicircle
    const angle = (i / (fingerCount - 1)) * Math.PI;
    const fingerOffset = new THREE.Vector3(
      Math.cos(angle) * fingerSpread,
      Math.sin(angle) * fingerSpread,
      0
    );
    
    // Create orthogonal basis for spreading fingers
    const forward = direction.clone();
    const right = new THREE.Vector3(1, 0, 0);
    if (Math.abs(forward.dot(right)) > 0.9) {
      right.set(0, 1, 0);
    }
    
    const up = new THREE.Vector3().crossVectors(forward, right).normalize();
    right.crossVectors(up, forward).normalize();
    
    // Apply the offset in local space
    const worldOffset = new THREE.Vector3()
      .addScaledVector(right, fingerOffset.x)
      .addScaledVector(up, fingerOffset.y);
    
    const fingerPosition = fingerBasePosition.clone().add(worldOffset);
    
    // Create finger segment
    segments.push({
      position: fingerPosition,
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 0.3,
        Math.random() * Math.PI * 0.3,
        Math.random() * Math.PI * 0.3
      ),
      scale: 0.1 + Math.random() * 0.05,
      progress: 0
    });
    
    // Create finger tip segment
    const fingerTipPosition = fingerPosition.clone().add(
      direction.clone().multiplyScalar(0.2)
    );
    
    segments.push({
      position: fingerTipPosition,
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 0.3,
        Math.random() * Math.PI * 0.3,
        Math.random() * Math.PI * 0.3
      ),
      scale: 0.05 + Math.random() * 0.03,
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
    const mainBoltCount = 5; // Increased for more dramatic effect
    const branchBoltCount = 7; // Increased for more dramatic effect
    
    // Define more cosmic colors for a richer effect
    const boltColors = [
      color,
      secondaryColor,
      '#00ffee', // Cyan
      '#9900ff', // Purple
      '#ff00cc', // Pink
    ];
    
    // Create main bolts from position to target
    for (let i = 0; i < mainBoltCount; i++) {
      const boltColor = boltColors[i % boltColors.length];
      
      boltsArray.push(createLightningBolt(
        position, 
        target, 
        10 + Math.floor(Math.random() * 8), // More segments
        0.4 + Math.random() * 0.3, // More displacement for wilder effect
        boltColor
      ));
      
      // Create branch bolts
      for (let j = 0; j < branchBoltCount; j++) {
        // Pick a random point along the main bolt to start branch
        const currentMainBolt = boltsArray[boltsArray.length - 1];
        const startIndex = 1 + Math.floor(Math.random() * (currentMainBolt.segments - 1));
        const branchStartPoint = currentMainBolt.points[startIndex].clone();
        
        // Create a random end point for branch
        const branchLength = 0.7 + Math.random() * 1.2; // Longer branches
        const branchDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
        
        const endPoint = branchStartPoint.clone().add(
          branchDirection.multiplyScalar(branchLength)
        );
        
        // Create and add branch bolt with varied colors
        const branchColor = boltColors[Math.floor(Math.random() * boltColors.length)];
        
        boltsArray.push(createLightningBolt(
          branchStartPoint,
          endPoint,
          3 + Math.floor(Math.random() * 5), // More varied segments
          0.15 + Math.random() * 0.25, // More displacement
          branchColor
        ));
      }
    }
    
    return boltsArray;
  }, [position, target, color, secondaryColor]);
  
  // Create hand segments
  const handSegments = useMemo<HandSegment[]>(() => {
    return createHandSegments(position, target, 5);
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
      
      {/* Hand segments */}
      {handSegments.map((segment, i) => (
        <mesh
          key={i}
          ref={el => el && (handSegmentRefs.current[i] = el)}
          position={segment.position}
          rotation={segment.rotation}
          scale={0} // Start with zero scale, will be animated
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color : secondaryColor}
            emissive={i % 2 === 0 ? color : secondaryColor}
            emissiveIntensity={1}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ElectricHand;