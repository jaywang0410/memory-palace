import { useRef, useEffect, useCallback } from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
} from 'd3-force'
import type { StarNode, StarBridge } from '../../types/starfield'
import type { MemoryCard, StarRegion } from '../../types/memory'
import { useMemoryStore } from '../../stores/useMemoryStore'
import { useStarfieldStore } from '../../stores/useStarfieldStore'
import { getRegionCenter, getPulse } from '../../utils/starPositioner'
import { COLORS } from '../../utils/colorPalette'

interface D3StarNode extends SimulationNodeDatum {
  id: string
  x: number
  y: number
  fx: number | null
  fy: number | null
  radius: number
  color: string
  glowColor: string
  pulsePhase: number
  opacity: number
  region: StarRegion
}

interface D3StarLink extends SimulationNodeDatum {
  source: string | D3StarNode
  target: string | D3StarNode
  strength: number
}

const EMOTION_COLORS: Record<string, string> = {
  joy: COLORS.nebulaJoy,
  sadness: COLORS.nebulaSadness,
  anger: COLORS.nebulaAnger,
  fear: COLORS.nebulaFear,
  neutral: COLORS.dailyStar,
}

const EMOTION_GLOWS: Record<string, string> = {
  joy: '#FFE4B5',
  sadness: '#B0E0E6',
  anger: '#F08080',
  fear: '#DDA0DD',
  neutral: COLORS.dailyStarGlow,
}

function memoryToStarNode(memory: MemoryCard, width: number, height: number): D3StarNode {
  const center = getRegionCenter(memory.region, width, height)
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * Math.min(width, height) * 0.15

  let radius: number
  let color: string
  let glowColor: string

  switch (memory.region) {
    case 'core':
      radius = 8
      color = COLORS.coreStar
      glowColor = COLORS.coreStarGlow
      break
    case 'daily':
      radius = 5
      color = COLORS.dailyStar
      glowColor = COLORS.dailyStarGlow
      break
    case 'emotion':
      radius = 5
      color = EMOTION_COLORS[memory.emotionTag] || COLORS.dailyStar
      glowColor = EMOTION_GLOWS[memory.emotionTag] || COLORS.dailyStarGlow
      break
    case 'forgotten':
      radius = 3
      color = COLORS.whiteDwarf
      glowColor = '#808080'
      break
    default:
      radius = 5
      color = COLORS.dailyStar
      glowColor = COLORS.dailyStarGlow
  }

  return {
    id: memory.id,
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance,
    fx: null,
    fy: null,
    radius,
    color,
    glowColor,
    pulsePhase: Math.random() * Math.PI * 2,
    opacity: 1,
    region: memory.region,
  }
}

function createStarBridges(memories: Record<string, MemoryCard>): StarBridge[] {
  const bridges: StarBridge[] = []
  const seen = new Set<string>()

  for (const memory of Object.values(memories)) {
    for (const relatedId of memory.relatedMemoryIds) {
      const key = [memory.id, relatedId].sort().join('-')
      if (!seen.has(key)) {
        seen.add(key)
        bridges.push({
          source: memory.id,
          target: relatedId,
          strength: 1,
          type: 'strong',
        })
      }
    }
  }

  return bridges
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<D3StarNode[]>([])
  const linksRef = useRef<StarBridge[]>([])
  const simulationRef = useRef<Simulation<D3StarNode, D3StarLink> | null>(null)
  const animFrameRef = useRef<number>(0)

  const memories = useMemoryStore((state) => state.memories)
  const cameraPosition = useStarfieldStore((state) => state.cameraPosition)
  const zoomLevel = useStarfieldStore((state) => state.zoomLevel)
  const focusedStarId = useStarfieldStore((state) => state.focusedStarId)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const nodes = nodesRef.current
    const links = linksRef.current

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, COLORS.starfieldBg1)
    bgGradient.addColorStop(1, COLORS.starfieldBg2)
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    ctx.save()

    // Apply camera transform
    const cx = width / 2
    const cy = height / 2
    ctx.translate(cx + cameraPosition.x, cy + cameraPosition.y)
    ctx.scale(zoomLevel, zoomLevel)
    ctx.translate(-cx, -cy)

    // Determine which stars are related to the focused star
    const relatedIds = new Set<string>()
    if (focusedStarId) {
      relatedIds.add(focusedStarId)
      for (const link of links) {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        if (sourceId === focusedStarId) relatedIds.add(targetId)
        if (targetId === focusedStarId) relatedIds.add(sourceId)
      }
    }

    // Draw links
    for (const link of links) {
      const sourceNode = nodes.find((n) => n.id === (typeof link.source === 'string' ? link.source : link.source.id))
      const targetNode = nodes.find((n) => n.id === (typeof link.target === 'string' ? link.target : link.target.id))
      if (!sourceNode || !targetNode) continue

      let linkOpacity = 1
      if (focusedStarId) {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        if (!relatedIds.has(sourceId) || !relatedIds.has(targetId)) {
          linkOpacity = 0.3
        }
      }

      ctx.globalAlpha = linkOpacity * 0.6
      ctx.strokeStyle = link.type === 'strong' ? COLORS.bridgeStrong : COLORS.bridgeWeak
      ctx.lineWidth = link.type === 'strong' ? 1.5 : 0.8
      ctx.beginPath()
      ctx.moveTo(sourceNode.x, sourceNode.y)
      ctx.lineTo(targetNode.x, targetNode.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Draw star nodes
    for (const node of nodes) {
      const pulse = getPulse(node.pulsePhase)
      const glowRadius = node.radius * 3 * pulse

      let nodeOpacity = node.opacity
      if (focusedStarId && !relatedIds.has(node.id)) {
        nodeOpacity = 0.3
      }

      ctx.globalAlpha = nodeOpacity

      // Outer glow
      const outerGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius)
      outerGradient.addColorStop(0, node.glowColor + '40')
      outerGradient.addColorStop(1, node.glowColor + '00')
      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      // Inner glow
      const innerGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 1.5)
      innerGradient.addColorStop(0, node.color)
      innerGradient.addColorStop(1, node.color + '80')
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // White core
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }, [cameraPosition, zoomLevel, focusedStarId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Initialize nodes from memories
    const memoryList = Object.values(memories)
    const initialNodes = memoryList.map((m) => memoryToStarNode(m, canvas.width, canvas.height))
    nodesRef.current = initialNodes

    // Initialize links from relatedMemoryIds
    const initialLinks = createStarBridges(memories)
    linksRef.current = initialLinks

    // Create D3 force simulation
    const sim = forceSimulation<D3StarNode>(initialNodes)
      .force('charge', forceManyBody().strength(-100))
      .force(
        'link',
        forceLink<D3StarNode, D3StarLink>(
          initialLinks.map((l) => ({ ...l }))
        )
          .id((d: D3StarNode) => d.id)
          .distance(80)
      )
      .force('collide', forceCollide<D3StarNode>().radius((d) => d.radius + 3))
      .force(
        'x',
        forceX<D3StarNode>((d) => getRegionCenter(d.region, canvas.width, canvas.height).x).strength(0.05)
      )
      .force(
        'y',
        forceY<D3StarNode>((d) => getRegionCenter(d.region, canvas.width, canvas.height).y).strength(0.05)
      )

    simulationRef.current = sim

    // Animation loop
    const animate = () => {
      render()
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      sim.stop()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [memories, render])

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
