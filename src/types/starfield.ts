import type { StarRegion, LinkStrength } from './memory'

export interface StarNode {
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

export interface StarBridge {
  source: string
  target: string
  strength: number
  type: LinkStrength
}

export type RegionType = 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination' | null

export interface CameraState {
  x: number
  y: number
  zoom: number
}
