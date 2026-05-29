import type { StarRegion } from '../types/memory'
import type { StarNode } from '../types/starfield'

export function getRegionCenter(
  region: StarRegion,
  width: number,
  height: number
): { x: number; y: number } {
  const cx = width / 2
  const cy = height / 2

  const offsets: Record<StarRegion, { x: number; y: number }> = {
    core: { x: 0, y: 0 },
    daily: { x: 0, y: height * 0.25 },
    emotion: { x: -width * 0.3, y: height * 0.2 },
    forgotten: { x: width * 0.3, y: height * 0.2 },
    imagination: { x: 0, y: -height * 0.25 },
  }

  const o = offsets[region]
  return { x: cx + o.x, y: cy + o.y }
}

export function generateStarPositions(
  count: number,
  width: number,
  height: number,
  region: StarRegion = 'daily'
): Pick<StarNode, 'x' | 'y'>[] {
  const center = getRegionCenter(region, width, height)
  const positions: Pick<StarNode, 'x' | 'y'>[] = []

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Math.min(width, height) * 0.2
    positions.push({
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    })
  }

  return positions
}
