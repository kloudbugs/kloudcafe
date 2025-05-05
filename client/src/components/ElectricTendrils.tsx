import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../lib/stores/useControls';

interface ElectricTendrilsProps {
  count?: number;
  length?: number;
  color?: string;
  width?: number;
}

const ElectricTendrils: React.FC<ElectricTendrilsProps> = ({
  count = 8,
  length = 1.2,
  color,
  width = 0.03,
}) => {
  const tendrilsRef = useRef<THREE.Group>(null);
  const controls = useControls();
  const tendrilColor = color || controls.getColorByScheme('tendril');
  
  // Create tendril material
  const tendrilMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: new THREE.Color(tendrilColor),
      linewidth: 1,
      opacity: 0.8,
      transparent: true,
    }), 
  [tendrilColor]);
  
  // Generate random tendril paths
  const tendrils = useMemo(() => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      // Create a random direction for each tendril
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Calculate start position (within the cube)
      const startX = (Math.random() - 0.5) * 1.0;
      const startY = (Math.random() - 0.5) * 1.0;
      const startZ = (Math.random() - 0.5) * 1.0;
      const start = new THREE.Vector3(startX, startY, startZ);
      
      // Calculate end position (within the cube)
      const endX = (Math.random() - 0.5) * 1.0;
      const endY = (Math.random() - 0.5) * 1.0;
      const endZ = (Math.random() - 0.5) * 1.0;
      const end = new THREE.Vector3(endX, endY, endZ);
      
      // Create control points for a curved path
      const midPoint = new THREE.Vector3();
      midPoint.addVectors(start, end).multiplyScalar(0.5);
      
      // Add random offset to create curve
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 1.0,
        (Math.random() - 0.5) * 1.0,
        (Math.random() - 0.5) * 1.0
      );
      midPoint.add(offset);
      
      // Create a quadratic curve
      const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
      
      // Create points along the curve
      const pointCount = 20;
      const points = curve.getPoints(pointCount);
      
      data.push({
        points,
        speed: 0.2 + Math.random() * 0.3,
        phaseOffset: Math.random() * Math.PI * 2,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
    
    return data;
  }, [count, length]);
  
  // Animation loop
  useFrame((_, delta) => {
    if (!tendrilsRef.current) return;
    
    // Animate the tendrils group
    if (controls.autoRotate) {
      tendrilsRef.current.rotation.y += delta * controls.rotationSpeed * 0.1;
    }
    
    // Update each tendril line
    tendrilsRef.current.children.forEach((child, i) => {
      if (i < tendrils.length) {
        const tendril = tendrils[i];
        const time = Date.now() * 0.001 * tendril.direction * tendril.speed + tendril.phaseOffset;
        
        // Create electric-like movement
        const line = child as THREE.Line;
        const positions = line.geometry.attributes.position;
        
        for (let j = 0; j < positions.count; j++) {
          const point = tendril.points[j].clone();
          const offset = Math.sin(time + j * 0.2) * 0.05;
          
          // Apply a slight offset to create electric movement
          point.x += Math.sin(time * 1.1 + j * 0.05) * offset;
          point.y += Math.sin(time * 0.9 + j * 0.1) * offset;
          point.z += Math.sin(time * 1.3 + j * 0.15) * offset;
          
          positions.setXYZ(j, point.x, point.y, point.z);
        }
        
        positions.needsUpdate = true;
      }
    });
  });
  
  return (
    <group ref={tendrilsRef}>
      {tendrils.map((tendril, i) => {
        // Create line geometry from points
        const geometry = new THREE.BufferGeometry().setFromPoints(tendril.points);
        
        return (
          <primitive key={i} object={new THREE.Line(geometry, tendrilMaterial)} />
        );
      })}
    </group>
  );
};

export default ElectricTendrils;