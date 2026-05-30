export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral'

export type MemoryCategory = 'first_disclosure' | 'emotional_peak' | 'ritual' | 'daily'

export type MemoryStatus = 'active' | 'archived' | 'forgotten'

export type StarRegion = 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination'

export type LinkStrength = 'strong' | 'weak' | 'potential' | 'residual'

export type ConstellationType =
  | 'core'
  | 'daily'
  | 'emotion'
  | 'travel'
  | 'growth'
  | 'social'

export interface RoomItemSnapshot {
  furnitureId: string
  furnitureName: string
  position: [number, number, number]
}

// Legacy MemoryCard - keep for backward compatibility
export interface MemoryCard {
  id: string
  timestamp: number
  content: string
  emotionTag: EmotionType
  importanceScore: number
  category: MemoryCategory
  relatedMemoryIds: string[]
  tags: string[]
  roomItemSnapshot?: RoomItemSnapshot
  aiNote?: string
  status: MemoryStatus
  region: StarRegion
  lastTouched: number
}

export interface DialogueTurn {
  speaker: 'user' | 'ai'
  text: string
  timestamp: number
}

// ===== Unified Memory Type =====
export interface Memory {
  id: string
  date: string
  title: string
  people: string[]
  scene: string
  event: string
  emotion: string
  source: 'conversation' | 'observation' | 'user_action'
  status: 'short_term' | 'ascended'
  constellation: ConstellationType | null
  relatedMemoryIds: string[]
}

export const CONSTELLATION_CONFIG: Record<
  ConstellationType,
  { label: string; color: string; glowColor: string; angleStart: number; angleEnd: number }
> = {
  core: { label: '核心', color: '#FFD700', glowColor: '#FFD700', angleStart: 0, angleEnd: 360 },
  daily: { label: '日常', color: '#7EC8E3', glowColor: '#7EC8E3', angleStart: 0, angleEnd: 60 },
  emotion: { label: '情感', color: '#FFB6C1', glowColor: '#FFB6C1', angleStart: 60, angleEnd: 120 },
  travel: { label: '旅行', color: '#90EE90', glowColor: '#90EE90', angleStart: 120, angleEnd: 180 },
  growth: { label: '成长', color: '#DDA0DD', glowColor: '#DDA0DD', angleStart: 180, angleEnd: 240 },
  social: { label: '人际', color: '#FFA07A', glowColor: '#FFA07A', angleStart: 240, angleEnd: 300 },
}
