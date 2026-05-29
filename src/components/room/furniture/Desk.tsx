import { useRef } from 'react'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

export default function Desk({ onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group
      ref={groupRef}
      position={[-3, 0, -2]}
      rotation={[0, 0.3, 0]}
      name="desk"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Table top */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.6} clearcoat={0.2} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-1, 0.65, -0.4]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshPhysicalMaterial color="#C4956A" roughness={0.5} />
      </mesh>
      <mesh position={[-1, 0.65, 0.4]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshPhysicalMaterial color="#C4956A" roughness={0.5} />
      </mesh>

      {/* Right leg */}
      <mesh position={[1, 0.65, -0.4]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshPhysicalMaterial color="#C4956A" roughness={0.5} />
      </mesh>
      <mesh position={[1, 0.65, 0.4]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshPhysicalMaterial color="#C4956A" roughness={0.5} />
      </mesh>

      {/* Drawer unit */}
      <mesh position={[0.6, 0.7, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.5} />
      </mesh>

      {/* Drawer handles */}
      <mesh position={[0.6, 0.9, 0.51]}>
        <boxGeometry args={[0.3, 0.04, 0.04]} />
        <meshPhysicalMaterial color="#8B7355" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0.6, 0.51]}>
        <boxGeometry args={[0.3, 0.04, 0.04]} />
        <meshPhysicalMaterial color="#8B7355" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Computer monitor */}
      <mesh position={[-0.3, 1.7, -0.1]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.03]} />
        <meshPhysicalMaterial color="#2D2D3A" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[-0.3, 1.55, -0.1]}>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshPhysicalMaterial color="#2D2D3A" roughness={0.3} />
      </mesh>
      {/* Screen glow */}
      <mesh position={[-0.3, 1.7, -0.08]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>

      {/* Coffee cup */}
      <mesh position={[0.8, 1.5, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
        <meshPhysicalMaterial color="#FFF8E7" roughness={0.4} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0.8, 1.58, 0.2]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color="#4A3728" />
      </mesh>
    </group>
  )
}
