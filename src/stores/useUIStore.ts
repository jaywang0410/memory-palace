import { create } from 'zustand'

type SceneType = 'room' | 'starfield'

interface UIState {
  currentScene: SceneType
  toast: { message: string; type: 'info' | 'success' | 'warning' } | null

  setScene: (scene: SceneType) => void
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  currentScene: 'room',
  toast: null,

  setScene: (scene) => set({ currentScene: scene }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}))
