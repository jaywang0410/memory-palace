import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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
      dirLightRef.current.intensity = 1.2 + Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshToonMaterial color={FLOOR_COLOR} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -5]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color={WALL_COLOR} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color={WALL_COLOR} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color={WALL_COLOR} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshToonMaterial color={CEILING_COLOR} />
      </mesh>

      {/* Window */}
      <mesh position={[0, 5, -4.9]}>
        <planeGeometry args={[6, 4]} />
        <meshToonMaterial
          color={WINDOW_COLOR}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.4} color="#FFF8E7" />
      <directionalLight
        ref={dirLightRef}
        position={[10, 8, 5]}
        intensity={1.2}
        color="#FFE4B5"
        castShadow
      />
      <pointLight position={[-3, 4, -2]} intensity={0.3} color="#F5E6C8" />
    </group>
  )
}
