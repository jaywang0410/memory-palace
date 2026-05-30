import { create } from 'zustand'
import type { StarMemory } from '../types/starfield'
import { ENRICHED_STAR_MEMORIES } from '../data/starMemories'

interface StarStore {
  stars: StarMemory[]
  selectedStarId: string | null
  hoveredStarId: string | null

  selectStar: (id: string | null) => void
  hoverStar: (id: string | null) => void
  getStarById: (id: string) => StarMemory | undefined
  getRelatedStars: (id: string) => StarMemory[]
}

export const useStarStore = create<StarStore>((set, get) => ({
  stars: ENRICHED_STAR_MEMORIES,
  selectedStarId: null,
  hoveredStarId: null,

  selectStar: (id) => set({ selectedStarId: id }),
  hoverStar: (id) => set({ hoveredStarId: id }),

  getStarById: (id) => {
    return get().stars.find((s) => s.id === id)
  },

  getRelatedStars: (id) => {
    const star = get().stars.find((s) => s.id === id)
    if (!star) return []
    return get().stars.filter((s) => star.relatedStarIds.includes(s.id))
  },
}))
