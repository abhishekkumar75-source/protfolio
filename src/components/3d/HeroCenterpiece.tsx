'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface HeroCenterpieceProps {
  mousePosition?: { x: number; y: number }
  quality?: 'low' | 'medium' | 'high'
}

const particleCounts = { low: 100, medium: 300, high: 800 }
const ringCounts = { low: 1, medium: 2, high: 3 }
const structureCounts = { low: 1, medium: 2, high: 3 }
const geometryDetail = { low: 32, medium: 48, high: 64 }

export function HeroCenterpiece({ mousePosition = { x: 0, y: 0 }, quality = 'high' }: HeroCenterpieceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<(THREE.Mesh | null)[]>([])
  const particlesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const count = particleCounts[quality]
  const rings = ringCounts[quality]
  const structures = structureCounts[quality]
  const detail = geometryDetail[quality]

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (groupRef.current) {
      const targetX = mousePosition.x * 0.15
      const targetY = -mousePosition.y * 0.15

      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02
      groupRef.current.rotation.z += delta * 0.03
    }

    ringsRef.current.forEach((ring: THREE.Mesh | null, i: number) => {
      if (ring) {
        ring.rotation.x += delta * (0.1 + i * 0.05)
        ring.rotation.y += delta * (0.05 + i * 0.03)
        ring.scale.setScalar(1 + Math.sin(timeRef.current * 0.5 + i) * 0.02)
      }
    })

    if (particlesRef.current && quality !== 'low') {
      particlesRef.current.rotation.y += delta * 0.015
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(timeRef.current * 1.5 + i) * 0.0008
        positions[i] += Math.cos(timeRef.current * 1.2 + i) * 0.0008
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [count])

  const sizes = useMemo(() => new Float32Array(count).map(() => Math.random() * 1.5 + 0.3), [count])

  return (
    <group ref={groupRef}>
      {/* Main sphere - simplified materials for performance */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.2, detail, detail]} />
        <meshPhysicalMaterial
          transmission={quality === 'high' ? 0.9 : 0}
          roughness={0.1}
          metalness={0.0}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={1.5}
          clearcoat={quality === 'high' ? 1.0 : 0}
          clearcoatRoughness={0.1}
          color="#ffffff"
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner glow - only on medium+ */}
      {quality !== 'low' && (
        <mesh>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshPhysicalMaterial
            color="#B7FF65"
            emissive="#B7FF65"
            emissiveIntensity={0.25}
            transparent
            opacity={0.5}
            metalness={0.0}
            roughness={0.1}
          />
        </mesh>
      )}

      {/* Rings - simplified */}
      {[...Array(rings)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringsRef.current[i] = el }}
          rotation={[i * 0.5, i * 0.3, i * 0.7]}
        >
          <torusGeometry args={[2.8 + i * 0.4, 0.02, 12, 64]} />
          <meshPhysicalMaterial
            color={i === 0 ? '#171717' : i === 1 ? '#C0C0C0' : '#B7FF65'}
            metalness={1.0}
            roughness={0.1}
            transparent
            opacity={i === 0 ? 0.5 : i === 1 ? 0.35 : 0.45}
          />
        </mesh>
      ))}

      {/* Geometric structures - only on medium+ */}
      {quality !== 'low' && (
        <group rotation={[-0.3, 0.5, 0]}>
          {[...Array(structures)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i * 2.1) * 3.2,
                Math.sin(i * 2.1) * 1.5,
                Math.cos(i * 1.7) * 2.5
              ]}
              rotation={[i * 0.4, i * 0.6, i * 0.3]}
              scale={[0.4, 0.4, 0.4]}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color="#171717"
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.6}
                envMapIntensity={1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Particle field - reduced count */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <float32BufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          color="#B7FF65"
          size={0.035}
          transparent
          opacity={quality === 'high' ? 0.4 : 0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient particles - only on high */}
      {quality === 'high' && (
        <points>
          <bufferGeometry>
            <float32BufferAttribute
              attach="attributes-position"
              count={150}
              array={new Float32Array(150 * 3).map(() => (Math.random() - 0.5) * 10)}
              itemSize={3}
            />
            <float32BufferAttribute
              attach="attributes-size"
              count={150}
              array={new Float32Array(150).map(() => Math.random() * 3 + 0.5)}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff"
            size={0.06}
            transparent
            opacity={0.1}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}
    </group>
  )
}

export function HeroCenterpieceCanvas({ mousePosition, quality = 'high' }: HeroCenterpieceProps) {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const fogColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientIntensity = isDark ? 0.5 : 0.7
  const dirLightIntensity = isDark ? 0.8 : 1.0
  const dirLight2Intensity = isDark ? 0.25 : 0.4

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
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
      <fog attach="fog" args={[fogColor, 5, 25]} />
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight position={[5, 10, 7]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={dirLight2Intensity} color="#B7FF65" />
      <pointLight position={[0, 3, 5]} intensity={0.4} color="#B7FF65" decay={2} />
      <HeroCenterpiece mousePosition={mousePosition} quality={quality} />
    </Canvas>
  )
}