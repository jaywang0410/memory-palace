import { create } from 'zustand'
import type { RegionType } from '../types/starfield'

interface StarfieldState {
  currentRegion: RegionType
  focusedStarId: string | null
  zoomLevel: number
  cameraPosition: { x: number; y: number }
  filterTags: string[]
  filterTimeRange: string | null
  searchQuery: string
  showConstellationNames: boolean

  focusStar: (id: string | null) => void
  zoomToRegion: (region: RegionType) => void
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
  zoomToRegion: (region) => set({ currentRegion: region }),
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
