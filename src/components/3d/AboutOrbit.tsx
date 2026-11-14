'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface AboutOrbitProps {
  mousePosition?: { x: number; y: number }
}

export function AboutOrbit({ mousePosition = { x: 0, y: 0 } }: AboutOrbitProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (groupRef.current) {
      const targetX = mousePosition.x * 0.1
      const targetY = -mousePosition.y * 0.1

      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02
      groupRef.current.rotation.z += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central geometric form */}
      <mesh>
        <torusKnotGeometry args={[1.2, 0.3, 100, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#171717"
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.8}
          envMapIntensity={1.5}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Outer wireframe */}
      <mesh>
        <torusKnotGeometry args={[1.5, 0.4, 100, 16, 2, 3]} />
        <meshBasicMaterial
          color="#B7FF65"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Floating accent pieces */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * 1.5 + timeRef.current * 0.3) * 2.5,
            Math.sin(i * 1.2 + timeRef.current * 0.2) * 1.5,
            Math.cos(i * 1.8 + timeRef.current * 0.25) * 2
          ]}
          rotation={[timeRef.current * 0.2, timeRef.current * 0.3, timeRef.current * 0.1]}
          scale={0.3}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? '#B7FF65' : '#C0C0C0'}
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.6}
            emissive={i % 2 === 0 ? '#B7FF65' : '#000000'}
            emissiveIntensity={i % 2 === 0 ? 0.1 : 0}
          />
        </mesh>
      ))}

      {/* Subtle particle ring */}
      <points>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={300}
            array={(() => {
              const arr = new Float32Array(300 * 3)
              for (let idx = 0; idx < 300; idx++) {
                const angle = (idx / 300) * Math.PI * 2
                const radius = 2.8 + (Math.random() - 0.5) * 0.5
                arr[idx * 3] = Math.cos(angle) * radius
                arr[idx * 3 + 1] = (Math.random() - 0.5) * 2
                arr[idx * 3 + 2] = Math.sin(angle) * radius
              }
              return arr
            })()}
            itemSize={3}
          />
          <float32BufferAttribute
            attach="attributes-size"
            count={300}
            array={new Float32Array(300).map(() => Math.random() * 1.5 + 0.5)}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#B7FF65"
          size={0.03}
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export function AboutOrbitCanvas({ mousePosition }: AboutOrbitProps) {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientIntensity = isDark ? 0.6 : 0.8
  const dirLightIntensity = isDark ? 0.8 : 1
  const dirLight2Intensity = isDark ? 0.3 : 0.4

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      shadows={false}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight position={[3, 5, 5]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-3, -5, -5]} intensity={dirLight2Intensity} color="#B7FF65" />
      <AboutOrbit mousePosition={mousePosition} />
    </Canvas>
  )
}