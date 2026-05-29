import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

export default function Diary({ onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const topCoverRef = useRef<THREE.Mesh>(null)
  const [isOpen, setIsOpen] = useState(false)

  useFrame((_, delta) => {
    if (groupRef.current) {
      const time = performance.now() * 0.001
      groupRef.current.position.y = 0.15 + Math.sin(time) * 0.005
    }

    if (topCoverRef.current) {
      const targetRotation = isOpen ? -0.5 : 0
      topCoverRef.current.rotation.y = THREE.MathUtils.lerp(
        topCoverRef.current.rotation.y,
        targetRotation,
        delta * 8
      )
    }
  })

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
    onClick?.()
  }

  return (
    <group
      ref={groupRef}
      name="diary"
      position={[2, 0.15, 1]}
      onClick={handleClick}
    >
      {/* Bottom cover */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.9]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Pages */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.85]} />
        <meshToonMaterial color="#FFF8E7" />
      </mesh>

      {/* Top cover - rotates when opening */}
      <mesh
        ref={topCoverRef}
        position={[-0.6, 0.07, 0]}
      >
        <boxGeometry args={[1.2, 0.04, 0.9]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Bookmark ribbon */}
      <mesh position={[0.3, -0.1, 0.35]}>
        <boxGeometry args={[0.08, 0.01, 0.3]} />
        <meshToonMaterial color="#CD5C5C" />
      </mesh>
    </group>
  )
}
