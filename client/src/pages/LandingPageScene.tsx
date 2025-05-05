import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'

// Note: For production, you should download and add the Orbitron font to /client/public/fonts/
// The Text component will try to use the default font if it can't find the specified font

interface FloatingTextProps {
  position: [number, number, number]
  text: string
  color?: string
  size?: number
  rotation?: [number, number, number]
}

const FloatingText: React.FC<FloatingTextProps> = ({ 
  position, 
  text, 
  color = '#00ffff', 
  size = 0.2,
  rotation = [0, 0, 0]
}) => {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame(({clock}) => {
    if (textRef.current) {
      textRef.current.position.y += Math.sin(clock.getElapsedTime()) * 0.0005
      textRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      color={color}
      fontSize={size}
      font="/fonts/Orbitron-Bold.ttf"
      // If the font doesn't load, it will use the default font
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

interface OrbitingObjectProps {
  radius: number
  speed: number
  color: string
  size?: number
  phase?: number
}

const OrbitingObject: React.FC<OrbitingObjectProps> = ({
  radius,
  speed,
  color,
  size = 0.2,
  phase = 0
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({clock}) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed + phase
      meshRef.current.position.x = Math.sin(t) * radius
      meshRef.current.position.z = Math.cos(t) * radius
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

const LandingSceneBackground: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Title */}
      <FloatingText 
        position={[0, 2, 0]} 
        text="KLOUDBUGS CAFE" 
        color="#ffffff" 
        size={0.7}
      />
      
      <FloatingText 
        position={[0, 1.3, 0]} 
        text="EARLY ACCESS" 
        color="#ff00ff" 
        size={0.4}
      />
      
      {/* Orbiting crystals */}
      <OrbitingObject radius={3} speed={0.3} color="#00ffff" size={0.3} phase={0} />
      <OrbitingObject radius={3.5} speed={0.2} color="#ff00ff" size={0.3} phase={2} />
      <OrbitingObject radius={4} speed={0.4} color="#ffcc00" size={0.3} phase={4} />
      <OrbitingObject radius={5} speed={0.2} color="#00ff99" size={0.3} phase={1} />
      <OrbitingObject radius={6} speed={0.1} color="#9900ff" size={0.3} phase={3} />
      
      {/* Text */}
      <FloatingText 
        position={[-3, 0, 2]} 
        text="BITCOIN MINING" 
        color="#ffcc00" 
        size={0.25}
        rotation={[0, 0.5, 0]}
      />
      
      <FloatingText 
        position={[3, 0, -2]} 
        text="SOCIAL JUSTICE" 
        color="#00ff99" 
        size={0.25}
        rotation={[0, -0.5, 0]}
      />
      
      <FloatingText 
        position={[-2, -1, -3]} 
        text="KLOUD MINERS" 
        color="#ff9900" 
        size={0.2}
        rotation={[0, 0.2, 0]}
      />
      
      <FloatingText 
        position={[2, -1, 3]} 
        text="AI MINING" 
        color="#00ffff" 
        size={0.2}
        rotation={[0, -0.2, 0]}
      />
      
      <FloatingText 
        position={[0, -2, 0]} 
        text="ENTER ZIG PORTAL" 
        color="#ffffff" 
        size={0.3}
      />
      
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.3} />
    </>
  )
}

const LandingPageScene: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1
    }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <LandingSceneBackground />
      </Canvas>
    </div>
  )
}

export default LandingPageScene