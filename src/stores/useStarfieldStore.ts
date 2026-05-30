import { create } from 'zustand'
import type { ConstellationType } from '../types/starfield'

interface StarfieldState {
  currentRegion: ConstellationType | null
  focusedStarId: string | null
  zoomLevel: number
  cameraPosition: { x: number; y: number }
  filterTags: string[]
  filterTimeRange: string | null
  searchQuery: string
  showConstellationNames: boolean

  focusStar: (id: string | null) => void
  zoomToRegion: (region: ConstellationType | null) => void
  applyFilter: (tags: string[], timeRange?: string | null) => void
  panCamera: (deltaX: number, deltaY: number) => void
  zoomCamera: (factor: number) => void
  setSearchQuery: (query: string) => void
}

export const useStarfieldStore = create<StarfieldState>((set) => ({
  currentRegion: null,
  focusedStarId: null,
  zoomLevel: 1,
  cameraPosition: { x: 0, y: 0 },
  filterTags: [],
  filterTimeRange: null,
  searchQuery: '',
  showConstellationNames: true,

  focusStar: (id) => set({ focusedStarId: id }),
  zoomToRegion: (region) => {
    const regionCenters: Record<string, { x: number; y: number }> = {
      core: { x: 0, y: 0 },
      daily: { x: 0, y: 200 },
      emotion: { x: -300, y: 150 },
      forgotten: { x: 300, y: 200 },
      imagination: { x: 0, y: -250 },
    }
    const center = region ? regionCenters[region] || { x: 0, y: 0 } : { x: 0, y: 0 }
    set({ currentRegion: region, cameraPosition: center })
  },
  applyFilter: (tags, timeRange = null) => set({ filterTags: tags, filterTimeRange: timeRange }),
  panCamera: (deltaX, deltaY) => set((state) => ({
    cameraPosition: {
      x: state.cameraPosition.x + deltaX / state.zoomLevel,
      y: state.cameraPosition.y + deltaY / state.zoomLevel,
    },
  })),
  zoomCamera: (factor) => set((state) => ({
    zoomLevel: Math.max(0.1, Math.min(5, state.zoomLevel * factor)),
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
