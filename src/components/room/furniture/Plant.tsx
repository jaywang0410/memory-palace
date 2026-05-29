import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

export default function Plant({ onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const leavesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (leavesRef.current) {
      const t = state.clock.getElapsedTime()
      leavesRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
      leavesRef.current.children.forEach((leaf, i) => {
        leaf.rotation.z = Math.sin(t * 0.5 + i) * 0.03
      })
    }
  })

  return (
    <group
      ref={groupRef}
      position={[3, 0, -3]}
      name="plant"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Pot */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.7, 16]} />
        <meshPhysicalMaterial color="#D2691E" roughness={0.8} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 16]} />
        <meshPhysicalMaterial color="#C4956A" roughness={0.6} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.68, 0]}>
        <circleGeometry args={[0.27, 16]} />
        <meshBasicMaterial color="#4A3728" />
      </mesh>

      {/* Leaves */}
      <group ref={leavesRef} position={[0, 0.7, 0]}>
        {/* Stem */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
          <meshPhysicalMaterial color="#228B22" roughness={0.7} />
        </mesh>

        {/* Leaf 1 */}
        <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshPhysicalMaterial color="#32CD32" roughness={0.6} transparent opacity={0.9} />
        </mesh>
        {/* Leaf 2 */}
        <mesh position={[-0.25, 1.0, 0.1]} rotation={[0.3, 0, 0.4]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhysicalMaterial color="#2E8B57" roughness={0.6} transparent opacity={0.9} />
        </mesh>
        {/* Leaf 3 */}
        <mesh position={[0.1, 1.4, -0.15]} rotation={[-0.2, 0, -0.2]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshPhysicalMaterial color="#3CB371" roughness={0.6} transparent opacity={0.9} />
        </mesh>
        {/* Leaf 4 */}
        <mesh position={[-0.2, 1.5, 0.05]} rotation={[0.1, 0, 0.3]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshPhysicalMaterial color="#228B22" roughness={0.6} transparent opacity={0.9} />
        </mesh>
        {/* Leaf 5 */}
        <mesh position={[0.15, 1.6, 0.1]} rotation={[-0.1, 0.5, -0.1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhysicalMaterial color="#32CD32" roughness={0.6} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  )
}
