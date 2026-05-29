import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoomStore } from '../../stores/useRoomStore'

interface Props {
  onClick?: () => void
}

export default function Skylight({ onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const skylightGlow = useRoomStore((state) => state.skylightGlow)

  useFrame((state) => {
    if (materialRef.current) {
      const elapsedTime = state.clock.elapsedTime
      const pulse = Math.sin(elapsedTime * 1.5) * 0.2 + 0.8
      materialRef.current.emissiveIntensity = skylightGlow * pulse * 0.5
    }
  })

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <mesh
      ref={meshRef}
      name="skylight"
      position={[0, 9.99, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[3, 3]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#1A1B3A"
        emissive="#FFD700"
        emissiveIntensity={0}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
