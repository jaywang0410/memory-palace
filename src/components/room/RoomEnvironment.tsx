import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const WALL_COLOR = '#F5E6D3'
const FLOOR_COLOR = '#D4A574'
const CEILING_COLOR = '#FFF8F0'
const WINDOW_COLOR = '#87CEEB'

export default function RoomEnvironment() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    if (dirLightRef.current) {
      const t = state.clock.getElapsedTime()
      dirLightRef.current.intensity = 1.5 + Math.sin(t * 0.5) * 0.1
    }
  })

  return (
    <group>
      {/* IBL Environment - warm indoor preset */}
      <Environment preset="sunset" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -5]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Window */}
      <mesh position={[0, 5, -4.9]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial
          color={WINDOW_COLOR}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.3} color="#FFF8E7" />
      <directionalLight
        ref={dirLightRef}
        position={[8, 10, 4]}
        intensity={1.5}
        color="#FFE4B5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* RectAreaLight simulating sunlight through window */}
      <rectAreaLight
        position={[0, 5, -3]}
        width={6}
        height={4}
        intensity={2}
        color="#FFE4B5"
        lookAt={[0, 0, 0]}
      />

      {/* Contact Shadows - soft ground shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
        color="#8B7355"
      />
    </group>
  )
}
