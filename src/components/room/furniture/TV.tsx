import { useRef } from 'react'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

export default function TV({ onClick }: Props) {
  const screenRef = useRef<THREE.Mesh>(null)

  return (
    <group
      position={[-1, 0, -4.5]}
      rotation={[0, 0.2, 0]}
      name="tv"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* TV stand */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshPhysicalMaterial color="#8B7355" roughness={0.6} />
      </mesh>
      {/* Stand legs */}
      {[[-0.5, 0.2, 0], [0.5, 0.2, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.05, 0.4, 0.3]} />
          <meshPhysicalMaterial color="#8B7355" roughness={0.6} />
        </mesh>
      ))}

      {/* TV frame */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.05]} />
        <meshPhysicalMaterial color="#2D2D3A" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* TV screen */}
      <mesh ref={screenRef} position={[0, 1.0, 0.03]}>
        <planeGeometry args={[0.92, 0.52]} />
        <meshBasicMaterial color="#1a3a5c" />
      </mesh>
      {/* Screen glow effect */}
      <mesh position={[0, 1.0, 0.04]}>
        <planeGeometry args={[0.92, 0.52]} />
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.15} />
      </mesh>

      {/* Sound bar below */}
      <mesh position={[0, 0.65, 0.05]}>
        <boxGeometry args={[0.6, 0.06, 0.08]} />
        <meshPhysicalMaterial color="#1A1A2E" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}
