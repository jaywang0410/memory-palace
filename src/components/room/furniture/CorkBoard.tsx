import { useMemo } from 'react'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

const PIN_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#FF8C42']

export default function CorkBoard({ onClick }: Props) {
  const pins = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 1.6,
      y: (Math.random() - 0.5) * 1.0 + 0.5,
      color: PIN_COLORS[Math.floor(Math.random() * PIN_COLORS.length)],
    }))
  }, [])

  const photos = useMemo(() => {
    return Array.from({ length: 3 }, () => ({
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 0.6 + 0.5,
      rotation: (Math.random() - 0.5) * 0.3,
      width: 0.3 + Math.random() * 0.15,
      height: 0.25 + Math.random() * 0.1,
    }))
  }, [])

  return (
    <group
      position={[3.8, 1.5, -4.8]}
      rotation={[0, -0.8, 0]}
      name="corkboard"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.6, 0.08]} />
        <meshPhysicalMaterial color="#8B6914" roughness={0.6} />
      </mesh>

      {/* Cork surface */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.0, 1.4, 0.02]} />
        <meshPhysicalMaterial color="#D2B48C" roughness={0.9} />
      </mesh>

      {/* Photos / notes */}
      {photos.map((photo, i) => (
        <group key={i} position={[photo.x, photo.y, 0.04]} rotation={[0, 0, photo.rotation]}>
          <mesh>
            <planeGeometry args={[photo.width, photo.height]} />
            <meshPhysicalMaterial color="#FFF8E7" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          {/* Photo border */}
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[photo.width + 0.02, photo.height + 0.02]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Pins */}
      {pins.map((pin, i) => (
        <mesh key={i} position={[pin.x, pin.y, 0.06]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshPhysicalMaterial color={pin.color} roughness={0.3} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}
