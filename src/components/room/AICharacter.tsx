import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  state?: 'idle' | 'busted'
}

export default function AICharacter({ state = 'idle' }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)

  const [isBlinking, setIsBlinking] = useState(false)

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current || !bodyRef.current || !headRef.current) return

    const time = performance.now() * 0.001

    if (state === 'busted') {
      // Panic shake
      groupRef.current.position.x = Math.sin(time * 20) * 0.05
      groupRef.current.position.z = Math.cos(time * 15) * 0.05
      headRef.current.rotation.y = Math.sin(time * 10) * 0.2
    } else {
      // Idle breathing
      const breathe = Math.sin(time * 2) * 0.02
      bodyRef.current.scale.y = 1 + breathe
      bodyRef.current.scale.x = 1 - breathe * 0.5
      bodyRef.current.scale.z = 1 - breathe * 0.5

      // Gentle float
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.03

      // Head gentle sway
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
      headRef.current.rotation.z = Math.sin(time * 0.3) * 0.05

      // Arms gentle swing
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.1
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(time * 1.2 + Math.PI) * 0.1
      }
    }

    // Blink
    const eyeScaleY = isBlinking ? 0.1 : 1
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, delta * 20)
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, delta * 20)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.8, 0]} name="ai-character">
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#F5F5F5"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.55, 0]}>
        {/* Head base */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshPhysicalMaterial
            color="#F5F5F5"
            roughness={0.2}
            metalness={0.1}
            clearcoat={0.3}
          />
        </mesh>

        {/* Face mask - black hemisphere */}
        <mesh position={[0, 0.05, 0.12]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshPhysicalMaterial
            color="#1A1A2E"
            roughness={0.1}
            metalness={0.8}
            clearcoat={0.5}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Left Eye */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.08, 0.32]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>

        {/* Right Eye */}
        <mesh ref={rightEyeRef} position={[0.1, 0.08, 0.32]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshPhysicalMaterial color="#F5F5F5" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      </group>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.55, 0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
        <meshPhysicalMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.55, 0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
        <meshPhysicalMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.2, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
        <meshPhysicalMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.2, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
        <meshPhysicalMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  )
}
