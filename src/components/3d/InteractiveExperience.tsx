'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export function InteractiveExperience() {
  const sceneRef = useRef<THREE.Group>(null)
  const structuresRef = useRef<THREE.Mesh[]>([])
  const particlesRef = useRef<THREE.Points>(null)
  const metallicSpheresRef = useRef<(THREE.Mesh | null)[]>([])
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((_state, delta) => {
    timeRef.current += delta

    if (sceneRef.current) {
      const targetX = mouseRef.current.x * 0.3
      const targetY = mouseRef.current.y * 0.3

      sceneRef.current.rotation.y += (targetX - sceneRef.current.rotation.y) * 0.015
      sceneRef.current.rotation.x += (targetY - sceneRef.current.rotation.x) * 0.015
    }

    structuresRef.current.forEach((mesh: THREE.Mesh | undefined, i: number) => {
      if (mesh) {
        mesh.rotation.x += delta * (0.05 + i * 0.02)
        mesh.rotation.y += delta * (0.03 + i * 0.01)
        const float = Math.sin(timeRef.current * 0.7 + i) * 0.15
        mesh.position.y += (float - mesh.position.y) * 0.02
      }
    })

    metallicSpheresRef.current.forEach((sphere: THREE.Mesh | null, i: number) => {
      if (sphere) {
        sphere.rotation.y += delta * 0.1
        const orbitRadius = 4 + i * 1.5
        const angle = timeRef.current * (0.15 + i * 0.05) + i * 2
        sphere.position.x = Math.cos(angle) * orbitRadius
        sphere.position.z = Math.sin(angle) * orbitRadius
        sphere.position.y = Math.sin(timeRef.current * 0.5 + i) * 0.8
      }
    })

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.01
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(timeRef.current * 1.5 + i * 0.1) * 0.002
        positions[i] += Math.cos(timeRef.current * 1.2 + i * 0.1) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (camera) {
      camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.02
      camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.02
      camera.rotation.x = mouseRef.current.y * 0.05
      camera.rotation.y = mouseRef.current.x * 0.05
    }
  })

  return (
    <group ref={sceneRef}>
      {/* Central geometric structure - complex polyhedron */}
      <group position={[0, 0, 0]}>
        {[0, 1].map((layer) => (
          <mesh
            key={layer}
            ref={(el) => { if (el) structuresRef.current[layer] = el }}
            scale={layer === 0 ? 1.5 : 0.7}
            rotation={[layer * 0.5, layer * 0.3, 0]}
          >
            <icosahedronGeometry args={[1, layer === 0 ? 0 : 1]} />
            <meshPhysicalMaterial
              color={layer === 0 ? '#171717' : '#B7FF65'}
              metalness={layer === 0 ? 0.9 : 0.3}
              roughness={layer === 0 ? 0.1 : 0.4}
              transparent
              opacity={layer === 0 ? 0.8 : 0.6}
              wireframe={layer === 1}
              envMapIntensity={1.5}
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
            emissiveIntensity={0.4}
            metalness={0.0}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Orbiting metallic spheres */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) metallicSpheresRef.current[i] = el }}
        >
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshPhysicalMaterial
            color={['#171717', '#C0C0C0', '#B7FF65', '#171717'][i]}
            metalness={1.0}
            roughness={0.05}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.0}
          />
        </mesh>
      ))}

      {/* Floating geometric shards */}
      <group>
        {[...Array(12)].map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) structuresRef.current[3 + i] = el }}
            position={[
              Math.cos(i * 0.52) * (4 + Math.sin(i) * 0.5),
              Math.sin(i * 0.37) * 2 + Math.cos(i) * 1,
              Math.sin(i * 0.52) * (4 + Math.cos(i) * 0.5)
            ]}
            rotation={[Math.random(), Math.random(), Math.random()]}
            scale={0.25 + Math.random() * 0.15}
          >
            <tetrahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color={i % 3 === 0 ? '#171717' : i % 3 === 1 ? '#C0C0C0' : '#B7FF65'}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.7}
              envMapIntensity={1}
            />
          </mesh>
        ))}
      </group>

      {/* Particle atmosphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={1500}
            array={new Float32Array(1500 * 3).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
          <float32BufferAttribute
            attach="attributes-size"
            count={1500}
            array={new Float32Array(1500).map(() => Math.random() * 1.5 + 0.3)}
            itemSize={1}
          />
          <float32BufferAttribute
            attach="attributes-color"
            count={1500}
            array={new Float32Array(1500 * 3).map(() => Math.random() > 0.7 ? 0.7 : Math.random() > 0.3 ? 0.9 : 1)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Volumetric light shafts */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2.1) * 5, 0, Math.sin(i * 2.1) * 5]} scale={[0.5, 8, 0.5]}>
          <cylinderGeometry args={[1, 1, 1, 8, 1, true]} />
          <meshBasicMaterial
            color={i === 0 ? '#B7FF65' : i === 1 ? '#171717' : '#C0C0C0'}
            transparent
            opacity={0.02}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export function InteractiveExperienceCanvas() {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  const bgColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const fogColor = isDark ? '#0A0A0A' : '#F7F7F2'
  const ambientIntensity = isDark ? 0.4 : 0.6
  const dirLightIntensity = isDark ? 1.0 : 1.5
  const dirLight2Intensity = isDark ? 0.4 : 0.6
  const pointLightIntensity = isDark ? 0.6 : 0.8

  return (
    <Canvas
      camera={{ position: [0, 1, 10], fov: 50 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      shadows={false}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 8, 35]} />
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={dirLightIntensity} color="#ffffff" />
      <directionalLight position={[-10, -5, -10]} intensity={dirLight2Intensity} color="#B7FF65" />
      <pointLight position={[0, 5, 5]} intensity={pointLightIntensity} color="#B7FF65" decay={2} />
      <InteractiveExperience />
    </Canvas>
  )
}