import { create } from 'zustand'
import type { AIState } from '../types/room'

interface RoomState {
  aiState: AIState
  aiPosition: [number, number, number]
  aiTarget: string | null
  bustedCount: Record<string, number>
  skylightGlow: number
  isUserInRoom: boolean

  setAIState: (state: AIState) => void
  setAITarget: (target: string | null) => void
  triggerBusted: (furnitureId: string) => number
  setSkylightGlow: (glow: number) => void
  enterRoom: () => void
  leaveRoom: () => void
}

export const useRoomStore = create<RoomState>((set) => ({
  aiState: 'idle',
  aiPosition: [0, 0, 0],
  aiTarget: null,
  bustedCount: {},
  skylightGlow: 0,
  isUserInRoom: true,

  setAIState: (state) => set({ aiState: state }),
  setAITarget: (target) => set({ aiTarget: target }),
  triggerBusted: (furnitureId) => {
    let newCount = 1
    set((state) => {
      newCount = (state.bustedCount[furnitureId] || 0) + 1
      return {
        bustedCount: { ...state.bustedCount, [furnitureId]: newCount },
      }
    })
    return newCount
  },
  setSkylightGlow: (glow) => set({ skylightGlow: glow }),
  enterRoom: () => set({ isUserInRoom: true }),
  leaveRoom: () => set({ isUserInRoom: false }),
}))
