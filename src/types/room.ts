export type AIState = 'idle' | 'reading' | 'listening_music' | 'daydreaming' | 'busted'

export interface FurnitureState {
  id: string
  name: string
  isOpen: boolean
  hasNewContent: boolean
}

export interface BustedReaction {
  count: number
  text: string
  animation: string
}
