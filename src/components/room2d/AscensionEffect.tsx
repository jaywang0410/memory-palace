import { useEffect, useState, useRef } from 'react'
import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'
import { CONSTELLATION_CONFIG } from '../../types/memory'

interface Particle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  size: number
  speed: number
  delay: number
  constellation: string
}

interface Props {
  onAscensionComplete?: () => void
}

export default function AscensionEffect({ onAscensionComplete }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [phase, setPhase] = useState<'idle' | 'gathering' | 'rising' | 'burst' | 'done'>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const particlePositions = useRef<Map<number, { x: number; y: number; progress: number }>>(new Map())

  const isAscending = useUnifiedMemoryStore((s) => s.isAscending)
  const ascendingIds = useUnifiedMemoryStore((s) => s.ascendingIds)
  const memories = useUnifiedMemoryStore((s) => s.memories)

  // Start ascension when isAscending becomes true
  useEffect(() => {
    if (isAscending && phase === 'idle' && ascendingIds.length > 0) {
      setPhase('gathering')
    }
  }, [isAscending, ascendingIds, phase])

  // Phase transitions
  useEffect(() => {
    if (phase === 'idle') return

    if (phase === 'gathering') {
      const timer = setTimeout(() => setPhase('rising'), 600)
      return () => clearTimeout(timer)
    }

    if (phase === 'rising') {
      const timer = setTimeout(() => setPhase('burst'), 2000)
      return () => clearTimeout(timer)
    }

    if (phase === 'burst') {
      const timer = setTimeout(() => {
        setPhase('done')
        onAscensionComplete?.()
      }, 800)
      return () => clearTimeout(timer)
    }

    if (phase === 'done') {
      const timer = setTimeout(() => {
        setPhase('idle')
        setParticles([])
        particlePositions.current.clear()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, onAscensionComplete])

  // Create particles when gathering starts
  useEffect(() => {
    if (phase !== 'gathering') return

    const ascendedMemories = memories.filter((m) => ascendingIds.includes(m.id))
    const newParticles: Particle[] = ascendedMemories.map((memory, index) => {
      const constellation = memory.constellation || 'daily'
      const config = CONSTELLATION_CONFIG[constellation]

      // Spread particles around the crystal ball area (top-right)
      const angle = (Math.PI * 2 * index) / Math.max(ascendedMemories.length, 1)
      const spread = 40 + Math.random() * 30

      return {
        id: index,
        x: window.innerWidth - 100 + Math.cos(angle) * spread,
        y: 60 + Math.sin(angle) * spread,
        targetX: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
        targetY: 80 + Math.random() * 40,
        color: config.color,
        size: 4 + Math.random() * 4,
        speed: 0.008 + Math.random() * 0.006,
        delay: index * 100,
        constellation,
      }
    })

    // Initialize positions
    newParticles.forEach((p) => {
      particlePositions.current.set(p.id, { x: p.x, y: p.y, progress: 0 })
    })

    setParticles(newParticles)
  }, [phase, ascendingIds, memories])

  // Animate particles
  useEffect(() => {
    if (phase !== 'rising' || particles.length === 0) return

    let startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      particles.forEach((p) => {
        if (elapsed < p.delay) return

        const adjustedElapsed = elapsed - p.delay
        const progress = Math.min(adjustedElapsed * p.speed, 1)

        // Easing: ease-out-cubic
        const eased = 1 - Math.pow(1 - progress, 3)

        const currentX = p.x + (p.targetX - p.x) * eased
        const currentY = p.y + (p.targetY - p.y) * eased

        // Add some wobble
        const wobble = Math.sin(adjustedElapsed * 0.003) * (1 - eased) * 15

        particlePositions.current.set(p.id, {
          x: currentX + wobble,
          y: currentY,
          progress,
        })
      })

      // Force re-render
      setParticles((prev) => [...prev])

      if (elapsed < 2500) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phase, particles])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  if (phase === 'idle') return null

  const isGathering = phase === 'gathering'
  const isBurst = phase === 'burst' || phase === 'done'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Background flash during burst */}
      {isBurst && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 10%, rgba(147, 197, 253, 0.3) 0%, transparent 50%)',
            animation: 'ascension-flash 0.8s ease-out forwards',
          }}
        />
      )}

      {/* Particles */}
      {particles.map((p) => {
        const pos = particlePositions.current.get(p.id)
        if (!pos) return null

        const progress = pos.progress
        const opacity = isGathering
          ? 0.3 + progress * 0.7
          : isBurst
            ? 1 - (phase === 'done' ? 1 : 0)
            : 1 - progress * 0.3

        const scale = isGathering
          ? 1 + progress * 0.5
          : isBurst
            ? 1 + (phase === 'burst' ? 2 : 3)
            : 1

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: p.size * scale,
              height: p.size * scale,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `
                0 0 ${6 * scale}px ${p.color},
                0 0 ${12 * scale}px ${p.color}80,
                0 0 ${24 * scale}px ${p.color}40
              `,
              opacity,
              transform: 'translate(-50%, -50%)',
              transition: isBurst ? 'all 0.5s ease-out' : 'none',
            }}
          />
        )
      })}

      {/* Trail particles for rising phase */}
      {phase === 'rising' &&
        particles.map((p) => {
          const pos = particlePositions.current.get(p.id)
          if (!pos || pos.progress < 0.1) return null

          return (
            <div
              key={`trail-${p.id}`}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y + 20,
                width: 2,
                height: p.size * 2,
                borderRadius: '50%',
                background: `linear-gradient(to bottom, ${p.color}60, transparent)`,
                opacity: 0.4 * (1 - pos.progress),
                transform: 'translate(-50%, 0)',
              }}
            />
          )
        })}

      {/* Central glow at target during burst */}
      {isBurst && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '8%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(147,197,253,0.5) 30%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'ascension-burst 0.8s ease-out forwards',
          }}
        />
      )}
    </div>
  )
}
