'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface InteractiveExperienceProps {
  quality?: 'low' | 'medium' | 'high'
}

const particleCounts = { low: 200, medium: 600, high: 1500 }
const structureCounts = { low: 1, medium: 2, high: 3 }
const shardCounts = { low: 4, medium: 8, high: 12 }
const sphereCounts = { low: 2, medium: 3, high: 4 }
const geometryDetail = { low: 16, medium: 24, high: 32 }

export function InteractiveExperience({ quality = 'high' }: InteractiveExperienceProps) {
  const sceneRef = useRef<THREE.Group>(null)
  const structuresRef = useRef<THREE.Mesh[]>([])
  const particlesRef = useRef<THREE.Points>(null)
  const metallicSpheresRef = useRef<(THREE.Mesh | null)[]>([])
  const shardsRef = useRef<THREE.Mesh[]>([])
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    if (quality === 'low') return // Skip mouse on low quality
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [quality])

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (sceneRef.current && quality !== 'low') {
      const targetX = mouseRef.current.x * 0.2
      const targetY = mouseRef.current.y * 0.2

      sceneRef.current.rotation.y += (targetX - sceneRef.current.rotation.y) * 0.01
      sceneRef.current.rotation.x += (targetY - sceneRef.current.rotation.x) * 0.01
    }

    const sCount = structureCounts[quality]
    structuresRef.current.slice(0, sCount).forEach((mesh: THREE.Mesh | undefined, i: number) => {
      if (mesh) {
        mesh.rotation.x += delta * (0.03 + i * 0.015)
        mesh.rotation.y += delta * (0.02 + i * 0.01)
        const float = Math.sin(timeRef.current * 0.5 + i) * 0.1
        mesh.position.y += (float - mesh.position.y) * 0.015
      }
    })

    const mCount = sphereCounts[quality]
    metallicSpheresRef.current.slice(0, mCount).forEach((sphere: THREE.Mesh | null, i: number) => {
      if (sphere) {
        sphere.rotation.y += delta * 0.08
        const orbitRadius = 4 + i * 1.5
        const angle = timeRef.current * (0.12 + i * 0.04) + i * 2
        sphere.position.x = Math.cos(angle) * orbitRadius
        sphere.position.z = Math.sin(angle) * orbitRadius
        sphere.position.y = Math.sin(timeRef.current * 0.4 + i) * 0.6
      }
    })

    if (quality !== 'low') {
      const shCount = shardCounts[quality]
      shardsRef.current.slice(0, shCount).forEach((mesh: THREE.Mesh | undefined, i: number) => {
        if (mesh) {
          mesh.rotation.x += delta * 0.04
          mesh.rotation.y += delta * 0.03
          mesh.position.y += Math.sin(timeRef.current * 0.6 + i) * 0.005
        }
      })
    }

    if (particlesRef.current && quality !== 'low') {
      particlesRef.current.rotation.y += delta * 0.008
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(timeRef.current * 1.2 + i * 0.08) * 0.0015
        positions[i] += Math.cos(timeRef.current * 1.0 + i * 0.08) * 0.0015
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (camera && quality !== 'low') {
      camera.position.x += (mouseRef.current.x * 0.4 - camera.position.x) * 0.015
      camera.position.y += (mouseRef.current.y * 0.4 - camera.position.y) * 0.015
      camera.rotation.x = mouseRef.current.y * 0.03
      camera.rotation.y = mouseRef.current.x * 0.03
    }
  })

  const positions = useMemo(() => {
    const count = particleCounts[quality]
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [quality])

  const sizes = useMemo(() => new Float32Array(particleCounts[quality]).map(() => Math.random() * 1.2 + 0.2), [quality])
  const colors = useMemo(() => {
    const count = particleCounts[quality]
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = Math.random()
      if (r > 0.7) {
        arr[i * 3] = 0.7; arr[i * 3 + 1] = 1; arr[i * 3 + 2] = 0.4 // accent
      } else if (r > 0.3) {
        arr[i * 3] = 0.9; arr[i * 3 + 1] = 0.9; arr[i * 3 + 2] = 0.9 // silver
      } else {
        arr[i * 3] = 0.1; arr[i * 3 + 1] = 0.1; arr[i * 3 + 2] = 0.1 // dark
      }
    }
    return arr
  }, [quality])

  return (
    <group ref={sceneRef}>
      {/* Central structure - reduced detail */}
      <group position={[0, 0, 0]}>
        {[0, 1].map((layer) => (
          <mesh
            key={layer}
            ref={(el) => { if (el) structuresRef.current[layer] = el }}
            scale={layer === 0 ? 1.5 : 0.7}
            rotation={[layer * 0.5, layer * 0.3, 0]}
          >
            <icosahedronGeometry args={[1, layer === 0 ? 0 : quality === 'high' ? 1 : 0]} />
            <meshPhysicalMaterial
              color={layer === 0 ? '#171717' : '#B7FF65'}
              metalness={layer === 0 ? 0.8 : 0.2}
              roughness={layer === 0 ? 0.15 : 0.5}
              transparent
              opacity={layer === 0 ? 0.7 : 0.5}
              wireframe={layer === 1}
              envMapIntensity={quality === 'high' ? 1.5 : 0.5}
            />
          </mesh>
        ))}

        <mesh
          ref={(el) => { if (el) structuresRef.current[2] = el }}
          scale={0.3}
          rotation={[0.7, -0.3, 0]}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#B7FF65"
            emissive="#B7FF65"
            emissiveIntensity={0.3}
            metalness={0.0}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Orbiting spheres */}
      {[...Array(sphereCounts[quality])].map((_, i) => {
        const detail = geometryDetail[quality]
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) metallicSpheresRef.current[i] = el }}
          >
            <sphereGeometry args={[0.3, detail, detail]} />
            <meshPhysicalMaterial
              color={['#171717', '#C0C0C0', '#B7FF65', '#171717'][i]}
              metalness={1.0}
              roughness={0.08}
              envMapIntensity={quality === 'high' ? 2 : 1}
              clearcoat={quality === 'high' ? 1 : 0}
              clearcoatRoughness={0.0}
            />
          </mesh>
        )
      })}

      {/* Floating shards */}
      {quality !== 'low' && (
        <group>
          {[...Array(shardCounts[quality])].map((_, i) => (
            <mesh
              key={i}
              ref={(el) => { if (el) shardsRef.current[i] = el }}
              position={[
                Math.cos(i * 0.52) * (4 + Math.sin(i) * 0.5),
                Math.sin(i * 0.37) * 2 + Math.cos(i) * 1,
                Math.sin(i * 0.52) * (4 + Math.cos(i) * 0.5)
              ]}
              rotation={[Math.random(), Math.random(), Math.random()]}
              scale={0.2 + Math.random() * 0.1}
            >
              <tetrahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color={i % 3 === 0 ? '#171717' : i % 3 === 1 ? '#C0C0C0' : '#B7FF65'}
                metalness={0.7}
                roughness={0.25}
                transparent
                opacity={0.6}
                envMapIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Particle atmosphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" count={particleCounts[quality]} array={positions} itemSize={3} />
          <float32BufferAttribute attach="attributes-size" count={particleCounts[quality]} array={sizes} itemSize={1} />
          <float32BufferAttribute attach="attributes-color" count={particleCounts[quality]} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          transparent
          opacity={quality === 'high' ? 0.45 : 0.35}
          sizeAttenuation
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Light shafts - only on high */}
      {quality === 'high' && (
        <>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[Math.cos(i * 2.1) * 5, 0, Math.sin(i * 2.1) * 5]} scale={[0.4, 6, 0.4]}>
              <cylinderGeometry args={[1, 1, 1, 6, 1, true]} />
              <meshBasicMaterial
                color={i === 0 ? '#B7FF65' : i === 1 ? '#171717' : '#C0C0C0'}
                transparent
                opacity={0.015}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

export function InteractiveExperienceCanvas({ quality = 'high' }: InteractiveExperienceProps) {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const fogColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientIntensity = isDark ? 0.3 : 0.5
  const dirLightIntensity = isDark ? 0.8 : 1.2
  const dirLight2Intensity = isDark ? 0.3 : 0.5
  const pointLightIntensity = isDark ? 0.5 : 0.7

  return (
    <Canvas
      camera={{ position: [0, 1, 10], fov: 50 }}
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
      <fog attach="fog" args={[fogColor, 8, 35]} />
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-10, -5, -10]} intensity={dirLight2Intensity} color="#B7FF65" />
      <pointLight position={[0, 5, 5]} intensity={pointLightIntensity} color="#B7FF65" decay={2} />
      <InteractiveExperience quality={quality} />
    </Canvas>
  )
}