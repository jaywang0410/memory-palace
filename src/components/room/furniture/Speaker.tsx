import { useRef } from 'react'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

export default function Speaker({ onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group
      ref={groupRef}
      position={[2.5, 0.3, -1.5]}
      name="speaker"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Speaker body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.35]} />
        <meshPhysicalMaterial color="#FFF8E7" roughness={0.3} metalness={0.1} clearcoat={0.2} />
      </mesh>

      {/* Speaker grille */}
      <mesh position={[0, 0.25, 0.18]}>
        <circleGeometry args={[0.18, 32]} />
        <meshPhysicalMaterial color="#E8E8E8" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0.19]}>
        <ringGeometry args={[0.05, 0.18, 32]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Knob */}
      <mesh position={[0.15, 0.45, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshPhysicalMaterial color="#F4A261" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Antenna */}
      <mesh position={[-0.15, 0.55, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshPhysicalMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Legs */}
      {[[-0.2, -0.02, -0.12], [0.2, -0.02, -0.12], [-0.2, -0.02, 0.12], [0.2, -0.02, 0.12]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshPhysicalMaterial color="#8B7355" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}
