export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral'

export type MemoryCategory = 'first_disclosure' | 'emotional_peak' | 'ritual' | 'daily'

export type MemoryStatus = 'active' | 'archived' | 'forgotten'

export type StarRegion = 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination'

export type LinkStrength = 'strong' | 'weak' | 'potential' | 'residual'

export interface RoomItemSnapshot {
  furnitureId: string
  furnitureName: string
  position: [number, number, number]
}

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
