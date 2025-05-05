import React from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useControls } from '../lib/stores/useControls';

interface MinerTitleProps {
  position?: [number, number, number];
  scale?: number;
}

const MinerTitle: React.FC<MinerTitleProps> = ({
  position = [0, 2.5, 0],
  scale = 1,
}) => {
  const controls = useControls();
  
  // Get color based on the color scheme
  const primaryColor = controls.getColorByScheme('core');
  const secondaryColor = controls.getColorByScheme('tendril');
  
  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group scale={scale}>
        {/* Main Title: KLOUDBUGS CAFE */}
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.4}
          color={primaryColor}
          font="/fonts/orbitron-bold.woff"
          outlineWidth={0.02}
          outlineColor="#000000"
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
        >
          KLOUDBUGS CAFE
        </Text>
        
        {/* Subtitle: ZIG-MINER */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.3}
          color={secondaryColor}
          font="/fonts/orbitron-medium.woff"
          outlineWidth={0.02}
          outlineColor="#000000"
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
        >
          ZIG-MINER
        </Text>
        
        {/* Decorative elements */}
        <group position={[0, -0.05, 0]}>
          <mesh position={[-1.5, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={secondaryColor} emissive={secondaryColor} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={secondaryColor} emissive={secondaryColor} emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </Billboard>
  );
};

export default MinerTitle;