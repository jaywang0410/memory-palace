import { useRef, useEffect } from 'react'
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
import type { StarBridge } from '../../types/starfield'
import type { MemoryCard, StarRegion } from '../../types/memory'
import { useMemoryStore } from '../../stores/useMemoryStore'
import { useStarfieldStore } from '../../stores/useStarfieldStore'
import { getRegionCenter } from '../../utils/starPositioner'
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

function getPulse(phase: number): number {
  return Math.sin(Date.now() * 0.001 + phase) * 0.2 + 0.8
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<D3StarNode[]>([])
  const linksRef = useRef<StarBridge[]>([])
  const simulationRef = useRef<Simulation<D3StarNode, D3StarLink> | null>(null)
  const animFrameRef = useRef<number>(0)

  const memories = useMemoryStore((state) => state.memories)

  const isPanningRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })

  // Render function - reads latest store state directly
  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Read latest camera state directly from store
    const store = useStarfieldStore.getState()
    const cameraPosition = store.cameraPosition
    const zoomLevel = store.zoomLevel
    const focusedStarId = store.focusedStarId

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
    ctx.translate(cx, cy)
    ctx.scale(zoomLevel, zoomLevel)
    ctx.translate(-cameraPosition.x, -cameraPosition.y)

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

    // Draw region backgrounds
    const regionCenters: Record<StarRegion, { x: number; y: number; color: string; radius: number }> = {
      core: { x: width / 2, y: height / 2, color: '#FFD700', radius: 200 },
      daily: { x: width / 2, y: height / 2 + 200, color: '#7EC8E3', radius: 350 },
      emotion: { x: width / 2 - 300, y: height / 2 + 150, color: '#FFE4B5', radius: 200 },
      forgotten: { x: width / 2 + 300, y: height / 2 + 200, color: '#696969', radius: 180 },
      imagination: { x: width / 2, y: height / 2 - 250, color: '#DDA0DD', radius: 150 },
    }

    for (const [region, center] of Object.entries(regionCenters)) {
      const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, center.radius)
      const baseAlpha = region === 'core' ? '08' : region === 'forgotten' ? '15' : '10'
      gradient.addColorStop(0, center.color + baseAlpha)
      gradient.addColorStop(1, center.color + '00')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw emotion-specific nebulas
    const emotionGroups: Record<string, { color: string; nodes: D3StarNode[] }> = {}
    nodes.forEach((node) => {
      if (node.region === 'emotion') {
        const emotionColor = EMOTION_COLORS[node.id] || COLORS.dailyStar
        if (!emotionGroups[emotionColor]) {
          emotionGroups[emotionColor] = { color: emotionColor, nodes: [] }
        }
        emotionGroups[emotionColor].nodes.push(node)
      }
    })

    for (const group of Object.values(emotionGroups)) {
      if (group.nodes.length === 0) continue
      const avgX = group.nodes.reduce((sum, n) => sum + n.x, 0) / group.nodes.length
      const avgY = group.nodes.reduce((sum, n) => sum + n.y, 0) / group.nodes.length
      const gradient = ctx.createRadialGradient(avgX, avgY, 0, avgX, avgY, 100)
      gradient.addColorStop(0, group.color + '15')
      gradient.addColorStop(1, group.color + '00')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(avgX, avgY, 100, 0, Math.PI * 2)
      ctx.fill()
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

      if (nodeOpacity < 0.3) continue

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

    // Draw AI Spirit
    const time = Date.now() * 0.0005
    const spiritX = width / 2 + Math.sin(time) * 300
    const spiritY = height / 2 + Math.cos(time * 0.7) * 200
    const spiritPulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7

    // Outer glow
    const spiritOuterGradient = ctx.createRadialGradient(spiritX, spiritY, 0, spiritX, spiritY, 40 * spiritPulse)
    spiritOuterGradient.addColorStop(0, '#FFD700' + '30')
    spiritOuterGradient.addColorStop(1, '#FFD700' + '00')
    ctx.fillStyle = spiritOuterGradient
    ctx.beginPath()
    ctx.arc(spiritX, spiritY, 40 * spiritPulse, 0, Math.PI * 2)
    ctx.fill()

    // Inner glow
    const spiritInnerGradient = ctx.createRadialGradient(spiritX, spiritY, 0, spiritX, spiritY, 15)
    spiritInnerGradient.addColorStop(0, '#FFD700')
    spiritInnerGradient.addColorStop(1, '#FFF8DC' + '80')
    ctx.fillStyle = spiritInnerGradient
    ctx.beginPath()
    ctx.arc(spiritX, spiritY, 15, 0, Math.PI * 2)
    ctx.fill()

    // Core
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(spiritX, spiritY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Label
    ctx.fillStyle = '#FFD700'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('AI', spiritX, spiritY + 30)

    ctx.restore()
  }

  // Initialize nodes, links, and simulation (runs once on mount)
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

    // Animation loop - independent of React state
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memories])

  // Interaction event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      useStarfieldStore.getState().zoomCamera(factor)
    }

    const getWorldCoordinates = (mouseX: number, mouseY: number) => {
      const width = canvas.width
      const height = canvas.height
      const store = useStarfieldStore.getState()
      const worldX = (mouseX - width / 2) / store.zoomLevel + store.cameraPosition.x
      const worldY = (mouseY - height / 2) / store.zoomLevel + store.cameraPosition.y
      return { x: worldX, y: worldY }
    }

    const findStarAtPosition = (mouseX: number, mouseY: number) => {
      const worldPos = getWorldCoordinates(mouseX, mouseY)
      const nodes = nodesRef.current
      for (const node of nodes) {
        const dx = worldPos.x - node.x
        const dy = worldPos.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < node.radius * 3) {
          return node.id
        }
      }
      return null
    }

    const handleClick = (e: MouseEvent) => {
      const starId = findStarAtPosition(e.clientX, e.clientY)
      useStarfieldStore.getState().focusStar(starId)
    }

    const handleMouseDown = (e: MouseEvent) => {
      const starId = findStarAtPosition(e.clientX, e.clientY)
      if (starId) {
        return
      }
      isPanningRef.current = true
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return
      const deltaX = e.clientX - lastMouseRef.current.x
      const deltaY = e.clientY - lastMouseRef.current.y
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
      useStarfieldStore.getState().panCamera(deltaX, deltaY)
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
  }, [])

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
