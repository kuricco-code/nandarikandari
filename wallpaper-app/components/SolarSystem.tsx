'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html, OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { PLANETS, type PlanetData } from '@/lib/planetData'

function CanvasCapture({ onCanvas }: { onCanvas: (c: HTMLCanvasElement) => void }) {
  const { gl } = useThree()
  useEffect(() => {
    onCanvas(gl.domElement)
  }, [gl, onCanvas])
  return null
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08
  })

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={4} distance={300} color="#fff4d0" castShadow={false} />
      <pointLight position={[0, 0, 0]} intensity={1} distance={500} color="#ff9900" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF6600"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      {/* outer glow */}
      <mesh>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial color="#FF8800" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

function OrbitPath({ orbitRadius }: { orbitRadius: number }) {
  const points = useMemo(() => {
    return Array.from({ length: 129 }, (_, i) => {
      const angle = (i / 128) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius)
    })
  }, [orbitRadius])

  return <Line points={points} color="#ffffff" lineWidth={0.4} transparent opacity={0.12} />
}

function Planet({
  data,
  speedMultiplier,
  showLabels,
}: {
  data: PlanetData
  speedMultiplier: number
  showLabels: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    angleRef.current += ((2 * Math.PI) / data.period) * delta * speedMultiplier * 0.08

    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.orbitRadius
      groupRef.current.position.z = Math.sin(angleRef.current) * data.orbitRadius
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group>
      <OrbitPath orbitRadius={data.orbitRadius} />

      <group ref={groupRef}>
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.emissive}
            emissiveIntensity={0.3}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Saturn ring */}
        {data.ring && (
          <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
            <ringGeometry args={[data.radius * 1.5, data.radius * 2.4, 80]} />
            <meshBasicMaterial
              color={data.ring}
              side={THREE.DoubleSide}
              transparent
              opacity={0.65}
            />
          </mesh>
        )}

        {/* Planet label */}
        {showLabels && (
          <Html
            position={[0, data.radius + 0.8, 0]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '10px',
                fontFamily: 'sans-serif',
                whiteSpace: 'nowrap',
                textShadow: '0 0 4px rgba(0,0,0,0.8)',
                letterSpacing: '0.05em',
              }}
            >
              {data.name}
            </span>
          </Html>
        )}
      </group>
    </group>
  )
}

interface SolarSystemProps {
  speedMultiplier: number
  showLabels: boolean
  onCanvas: (canvas: HTMLCanvasElement) => void
}

export function SolarSystem({ speedMultiplier, showLabels, onCanvas }: SolarSystemProps) {
  return (
    <Canvas
      camera={{ position: [0, 88, 72], fov: 48 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ background: '#00000a' }}
    >
      <ambientLight intensity={0.05} />
      <Stars radius={250} depth={80} count={6000} factor={4} saturation={0} fade speed={0.3} />

      <Sun />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.nameEn}
          data={planet}
          speedMultiplier={speedMultiplier}
          showLabels={showLabels}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={15}
        maxDistance={220}
        target={[0, 0, 0]}
        dampingFactor={0.05}
        enableDamping
      />

      <CanvasCapture onCanvas={onCanvas} />
    </Canvas>
  )
}
