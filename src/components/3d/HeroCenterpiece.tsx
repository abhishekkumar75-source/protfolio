'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface HeroCenterpieceProps {
  mousePosition?: { x: number; y: number }
}

export function HeroCenterpiece({ mousePosition = { x: 0, y: 0 } }: HeroCenterpieceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<(THREE.Mesh | null)[]>([null, null, null])
  const particlesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (groupRef.current) {
      const targetX = mousePosition.x * 0.15
      const targetY = -mousePosition.y * 0.15

      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02
      groupRef.current.rotation.z += delta * 0.05
    }

    ringsRef.current.forEach((ring: THREE.Mesh | null, i: number) => {
      if (ring) {
        ring.rotation.x += delta * (0.1 + i * 0.05)
        ring.rotation.y += delta * (0.05 + i * 0.03)
        ring.scale.setScalar(1 + Math.sin(timeRef.current * 0.5 + i) * 0.02)
      }
    })

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02
      particlesRef.current.rotation.x += delta * 0.01

      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(timeRef.current * 2 + i) * 0.001
        positions[i] += Math.cos(timeRef.current * 1.5 + i) * 0.001
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial
          color="#B7FF65"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main translucent glass sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshPhysicalMaterial
          transmission={0.95}
          roughness={0.05}
          metalness={0.0}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner core sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#B7FF65"
          emissive="#B7FF65"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          metalness={0.0}
          roughness={0.1}
        />
      </mesh>

      {/* Floating metallic rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringsRef.current[i] = el }}
          rotation={[i * 0.5, i * 0.3, i * 0.7]}
        >
          <torusGeometry args={[2.8 + i * 0.4, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color={i === 0 ? '#171717' : i === 1 ? '#C0C0C0' : '#B7FF65'}
            metalness={1.0}
            roughness={0.1}
            transparent
            opacity={i === 0 ? 0.6 : i === 1 ? 0.4 : 0.5}
          />
        </mesh>
      ))}

      {/* Geometric floating structures */}
      <group rotation={[-0.3, 0.5, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[
            Math.cos(i * 2.1) * 3.2,
            Math.sin(i * 2.1) * 1.5,
            Math.cos(i * 1.7) * 2.5
          ]} rotation={[i * 0.4, i * 0.6, i * 0.3]} scale={[0.4, 0.4, 0.4]}>
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color="#171717"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.7}
              envMapIntensity={1}
            />
          </mesh>
        ))}
      </group>

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={800}
            array={new Float32Array(800 * 3).map(() => (Math.random() - 0.5) * 8)}
            itemSize={3}
          />
          <float32BufferAttribute
            attach="attributes-size"
            count={800}
            array={new Float32Array(800).map(() => Math.random() * 2 + 0.5)}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#B7FF65"
          size={0.04}
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient light particles */}
      <points>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={200}
            array={new Float32Array(200 * 3).map(() => (Math.random() - 0.5) * 12)}
            itemSize={3}
          />
          <float32BufferAttribute
            attach="attributes-size"
            count={200}
            array={new Float32Array(200).map(() => Math.random() * 4 + 1)}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.08}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export function HeroCenterpieceCanvas({ mousePosition }: HeroCenterpieceProps) {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const fogColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientColor = isDark ? '#ffffff' : '#ffffff'
  const ambientIntensity = isDark ? 0.6 : 0.8
  const dirLightIntensity = isDark ? 1.0 : 1.2
  const dirLight2Intensity = isDark ? 0.3 : 0.5

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      shadows={false}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 5, 25]} />
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight position={[5, 10, 7]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={dirLight2Intensity} color="#B7FF65" />
      <pointLight position={[0, 3, 5]} intensity={0.5} color="#B7FF65" decay={2} />
      <HeroCenterpiece mousePosition={mousePosition} />
    </Canvas>
  )
}