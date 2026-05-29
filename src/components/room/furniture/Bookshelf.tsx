import { useMemo } from 'react'
import * as THREE from 'three'

interface Props {
  onClick?: () => void
}

const BOOK_COLORS = [
  '#8B4513', '#CD853F', '#D2691E', '#A0522D',
  '#2F4F4F', '#556B2F', '#8B0000', '#4B0082',
  '#FFD700', '#FF6347', '#4682B4', '#32CD32',
]

export default function Bookshelf({ onClick }: Props) {
  const books = useMemo(() => {
    const result: { color: string; height: number; width: number; x: number; y: number }[] = []
    const shelves = [
      { y: 0.4, count: 8 },
      { y: 1.1, count: 7 },
      { y: 1.8, count: 9 },
    ]

    shelves.forEach((shelf) => {
      let currentX = -0.85
      for (let i = 0; i < shelf.count; i++) {
        const width = 0.15 + Math.random() * 0.1
        const height = 0.3 + Math.random() * 0.25
        if (currentX + width > 0.9) break
        result.push({
          color: BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)],
          height,
          width,
          x: currentX + width / 2,
          y: shelf.y + height / 2,
        })
        currentX += width + 0.02
      }
    })

    return result
  }, [])

  return (
    <group
      position={[-3.5, 0, -3.5]}
      rotation={[0, 0.5, 0]}
      name="bookshelf"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Back panel */}
      <mesh position={[0, 1.2, -0.25]} castShadow>
        <boxGeometry args={[2, 2.6, 0.05]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.7} />
      </mesh>

      {/* Side panels */}
      <mesh position={[-1, 1.2, 0]} castShadow>
        <boxGeometry args={[0.05, 2.6, 0.5]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.7} />
      </mesh>
      <mesh position={[1, 1.2, 0]} castShadow>
        <boxGeometry args={[0.05, 2.6, 0.5]} />
        <meshPhysicalMaterial color="#D4A574" roughness={0.7} />
      </mesh>

      {/* Shelves */}
      {[0.25, 0.95, 1.65, 2.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[2, 0.05, 0.5]} />
          <meshPhysicalMaterial color="#C4956A" roughness={0.6} />
        </mesh>
      ))}

      {/* Books */}
      {books.map((book, i) => (
        <mesh key={i} position={[book.x, book.y, 0]} castShadow>
          <boxGeometry args={[book.width, book.height, 0.4]} />
          <meshPhysicalMaterial color={book.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
