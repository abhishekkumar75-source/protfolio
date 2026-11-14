'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface AboutOrbitProps {
  mousePosition?: { x: number; y: number }
  quality?: 'low' | 'medium' | 'high'
}

const particleCounts = { low: 50, medium: 150, high: 300 }
const accentCounts = { low: 0, medium: 2, high: 4 }
const geometryDetail = { low: 48, medium: 72, high: 100 }

export function AboutOrbit({ mousePosition = { x: 0, y: 0 }, quality = 'high' }: AboutOrbitProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  const accentsRef = useRef<THREE.Mesh[]>([])

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (groupRef.current) {
      const targetX = mousePosition.x * 0.08
      const targetY = -mousePosition.y * 0.08

      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.015
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.015
      groupRef.current.rotation.z += delta * 0.015
    }

    // Animate floating accents
    accentsRef.current.slice(0, accentCounts[quality]).forEach((mesh: THREE.Mesh | undefined) => {
      if (mesh) {
        mesh.rotation.x += delta * 0.15
        mesh.rotation.y += delta * 0.2
        mesh.rotation.z += delta * 0.1
      }
    })
  })

  const particlePositions = useMemo(() => {
    const count = particleCounts[quality]
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 2.8 + (Math.random() - 0.5) * 0.4
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [quality])

  const particleSizes = useMemo(() => new Float32Array(particleCounts[quality]).map(() => Math.random() * 1 + 0.3), [quality])

  return (
    <group ref={groupRef}>
      {/* Central torus knot - main visual */}
      <mesh>
        <torusKnotGeometry args={[1.1, 0.3, geometryDetail[quality], 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#171717"
          metalness={quality === 'high' ? 0.7 : 0.5}
          roughness={quality === 'high' ? 0.2 : 0.3}
          transparent
          opacity={0.75}
          envMapIntensity={quality === 'high' ? 1.5 : 0.5}
          clearcoat={quality === 'high' ? 0.5 : 0}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Outer wireframe - simplified */}
      <mesh>
        <torusKnotGeometry args={[1.4, 0.35, 48, 12, 2, 3]} />
        <meshBasicMaterial
          color="#B7FF65"
          transparent
          opacity={quality === 'high' ? 0.12 : 0.08}
          wireframe
        />
      </mesh>

      {/* Floating accent pieces - reduced count */}
      {[...Array(accentCounts[quality])].map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => { if (el) accentsRef.current[idx] = el }}
          position={[
            Math.cos(idx * 1.5 + timeRef.current * 0.2) * 2.2,
            Math.sin(idx * 1.2 + timeRef.current * 0.15) * 1.2,
            Math.cos(idx * 1.8 + timeRef.current * 0.2) * 1.8
          ]}
          rotation={[timeRef.current * 0.15, timeRef.current * 0.2, timeRef.current * 0.08]}
          scale={0.25}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={idx % 2 === 0 ? '#B7FF65' : '#C0C0C0'}
            metalness={0.4}
            roughness={0.35}
            transparent
            opacity={0.5}
            emissive={idx % 2 === 0 ? '#B7FF65' : '#000000'}
            emissiveIntensity={idx % 2 === 0 ? 0.08 : 0}
          />
        </mesh>
      ))}

      {/* Subtle particle ring */}
      <points>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" count={particleCounts[quality]} array={particlePositions} itemSize={3} />
          <float32BufferAttribute attach="attributes-size" count={particleCounts[quality]} array={particleSizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          color="#B7FF65"
          size={0.025}
          transparent
          opacity={quality === 'high' ? 0.25 : 0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export function AboutOrbitCanvas({ mousePosition, quality = 'high' }: AboutOrbitProps) {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientIntensity = isDark ? 0.5 : 0.7
  const dirLightIntensity = isDark ? 0.6 : 0.8
  const dirLight2Intensity = isDark ? 0.2 : 0.3

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{
        antialias: quality !== 'low',
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      }}
      shadows={false}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight position={[3, 5, 5]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-3, -5, -5]} intensity={dirLight2Intensity} color="#B7FF65" />
      <AboutOrbit mousePosition={mousePosition} quality={quality} />
    </Canvas>
  )
}