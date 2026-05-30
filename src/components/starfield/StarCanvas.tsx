import { useRef, useEffect, useCallback } from 'react'
import type { Memory, ConstellationType } from '../../types/memory'
import { CONSTELLATION_CONFIG } from '../../types/memory'
import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'
import { useStarfieldStore } from '../../stores/useStarfieldStore'

interface StarNode extends Memory {
  x: number
  y: number
  baseAngle: number
  orbitRadius: number
  orbitSpeed: number
  currentAngle: number
  radius: number
  pulsePhase: number
}

const CONSTELLATION_ORDER: ConstellationType[] = [
  'daily', 'emotion', 'travel', 'growth', 'social'
]

const SECTOR_ANGLE = (Math.PI * 2) / 5 // 72° for each constellation

function createStarNodes(ascendedMemories: Memory[]): StarNode[] {
  const nodes: StarNode[] = []
  const constellationStars: Record<string, Memory[]> = {}

  // Group ascended stars by constellation
  for (const mem of ascendedMemories) {
    if (mem.constellation === 'core' || !mem.constellation) continue
    if (!constellationStars[mem.constellation]) {
      constellationStars[mem.constellation] = []
    }
    constellationStars[mem.constellation].push(mem)
  }

  // Place stars in orbital sectors
  CONSTELLATION_ORDER.forEach((constellation, index) => {
    const sectorStars = constellationStars[constellation] || []
    const baseAngle = index * SECTOR_ANGLE - Math.PI / 2 // Start from top

    sectorStars.forEach((mem, starIndex) => {
      const angleOffset = (Math.random() - 0.5) * SECTOR_ANGLE * 0.7
      const orbitRadius = 180 + starIndex * 55 + Math.random() * 30
      const orbitSpeed = 0.0003 + Math.random() * 0.0002

      nodes.push({
        ...mem,
        x: 0,
        y: 0,
        baseAngle: baseAngle + angleOffset,
        orbitRadius,
        orbitSpeed: orbitSpeed * (index % 2 === 0 ? 1 : -1),
        currentAngle: baseAngle + angleOffset,
        radius: 4 + Math.random() * 3,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    })
  })

  return nodes
}

function getPulse(phase: number): number {
  return Math.sin(Date.now() * 0.001 + phase) * 0.2 + 0.8
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<StarNode[]>([])
  const animFrameRef = useRef<number>(0)

  const memories = useUnifiedMemoryStore((state) => state.memories)
  const selectedId = useUnifiedMemoryStore((state) => state.selectedStarId)
  const selectStar = useUnifiedMemoryStore((state) => state.selectStar)

  const ascendedMemories = memories.filter((m) => m.status === 'ascended')

  const isPanningRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const store = useStarfieldStore.getState()
    const cameraPosition = store.cameraPosition
    const zoomLevel = store.zoomLevel
    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2
    const nodes = nodesRef.current

    // Update orbital positions
    const time = Date.now() * 0.0001
    for (const node of nodes) {
      node.currentAngle = node.baseAngle + time * node.orbitSpeed * 1000
      node.x = cx + Math.cos(node.currentAngle) * node.orbitRadius
      node.y = cy + Math.sin(node.currentAngle) * node.orbitRadius
    }

    ctx.clearRect(0, 0, width, height)

    // Background
    const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height))
    bgGradient.addColorStop(0, '#0a0e27')
    bgGradient.addColorStop(1, '#050714')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(zoomLevel, zoomLevel)
    ctx.translate(-cameraPosition.x, -cameraPosition.y)

    // Draw constellation sector backgrounds
    for (let i = 0; i < 5; i++) {
      const constellation = CONSTELLATION_ORDER[i]
      const config = CONSTELLATION_CONFIG[constellation]
      const startAngle = i * SECTOR_ANGLE - Math.PI / 2 - SECTOR_ANGLE / 2
      const endAngle = startAngle + SECTOR_ANGLE

      const sectorGradient = ctx.createRadialGradient(0, 0, 100, 0, 0, 600)
      sectorGradient.addColorStop(0, config.color + '00')
      sectorGradient.addColorStop(0.5, config.color + '06')
      sectorGradient.addColorStop(1, config.color + '00')

      ctx.fillStyle = sectorGradient
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, 600, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()
    }

    // Draw relation links
    const relatedIds = new Set<string>()
    if (selectedId) {
      relatedIds.add(selectedId)
      const selectedNode = nodes.find((n) => n.id === selectedId)
      if (selectedNode) {
        for (const relatedId of selectedNode.relatedMemoryIds) {
          relatedIds.add(relatedId)
        }
      }
    }

    for (const node of nodes) {
      for (const relatedId of node.relatedMemoryIds) {
        const targetNode = nodes.find((n) => n.id === relatedId)
        if (!targetNode) continue

        let linkOpacity = 0.15
        let linkWidth = 0.5

        if (selectedId) {
          const isRelated =
            relatedIds.has(node.id) && relatedIds.has(targetNode.id)
          if (!isRelated) {
            linkOpacity = 0.03
          } else {
            linkOpacity = 0.5
            linkWidth = 1
          }
        }

        ctx.globalAlpha = linkOpacity
        ctx.strokeStyle = '#87CEEB'
        ctx.lineWidth = linkWidth
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1

    // Draw regular stars
    for (const node of nodes) {
      const pulse = getPulse(node.pulsePhase)
      const glowRadius = node.radius * 4 * pulse

      let nodeOpacity = 1
      if (selectedId && !relatedIds.has(node.id) && selectedId !== node.id) {
        nodeOpacity = 0.25
      }

      if (nodeOpacity < 0.3) continue

      ctx.globalAlpha = nodeOpacity

      const constellation = node.constellation as ConstellationType
      const config = CONSTELLATION_CONFIG[constellation] || CONSTELLATION_CONFIG.daily

      // Outer glow
      const outerGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, glowRadius
      )
      outerGradient.addColorStop(0, config.glowColor + '40')
      outerGradient.addColorStop(1, config.glowColor + '00')
      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      // Inner glow
      const innerGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 1.8
      )
      innerGradient.addColorStop(0, config.color)
      innerGradient.addColorStop(1, config.color + '60')
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 1.8, 0, Math.PI * 2)
      ctx.fill()

      // White core
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1

    // Draw core star (loona & friya)
    const corePulse = Math.sin(Date.now() * 0.0015) * 0.3 + 0.7
    const coreRadius = 18

    // Core outer ring
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 * corePulse})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, coreRadius * 2.5 + 10 * corePulse, 0, Math.PI * 2)
    ctx.stroke()

    // Core glow layers
    for (let i = 3; i >= 1; i--) {
      const glowR = coreRadius * (1 + i * 1.5) * corePulse
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
      gradient.addColorStop(0, `rgba(255, 215, 0, ${0.4 / i})`)
      gradient.addColorStop(0.5, `rgba(135, 206, 250, ${0.2 / i})`)
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
      ctx.fill()
    }

    // Core body
    const coreGradient = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, coreRadius)
    coreGradient.addColorStop(0, '#FFF8DC')
    coreGradient.addColorStop(0.5, '#FFD700')
    coreGradient.addColorStop(1, '#DAA520')
    ctx.fillStyle = coreGradient
    ctx.beginPath()
    ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
    ctx.fill()

    // Core white highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(cx - 5, cy - 5, coreRadius * 0.3, 0, Math.PI * 2)
    ctx.fill()

    // Core label
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LOONA & FRIYA', cx, cy + coreRadius + 20)

    ctx.restore()
  }, [selectedId])

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    nodesRef.current = createStarNodes(ascendedMemories)

    const animate = () => {
      render()
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [ascendedMemories, render])

  // Interaction
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getWorldPos = (clientX: number, clientY: number) => {
      const store = useStarfieldStore.getState()
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      return {
        x: (clientX - cx) / store.zoomLevel + store.cameraPosition.x,
        y: (clientY - cy) / store.zoomLevel + store.cameraPosition.y,
      }
    }

    const findStarAt = (clientX: number, clientY: number) => {
      const worldPos = getWorldPos(clientX, clientY)
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // Check core star first
      const distToCore = Math.hypot(worldPos.x - cx, worldPos.y - cy)
      if (distToCore < 30) {
        return 'star-core-1'
      }

      // Check regular stars
      for (const node of nodesRef.current) {
        const dx = worldPos.x - node.x
        const dy = worldPos.y - node.y
        if (Math.hypot(dx, dy) < node.radius * 4) {
          return node.id
        }
      }
      return null
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      useStarfieldStore.getState().zoomCamera(factor)
    }

    const handleClick = (e: MouseEvent) => {
      const starId = findStarAt(e.clientX, e.clientY)
      selectStar(starId)
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (findStarAt(e.clientX, e.clientY)) return
      isPanningRef.current = true
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return
      const dx = e.clientX - lastMouseRef.current.x
      const dy = e.clientY - lastMouseRef.current.y
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
      useStarfieldStore.getState().panCamera(dx, dy)
    }

    const handleMouseUp = () => {
      isPanningRef.current = false
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [selectStar])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
}
