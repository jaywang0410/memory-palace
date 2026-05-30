import { create } from 'zustand'
import type { DiaryEntry } from '../types/diary'
import { getDiaryEntries } from '../data/diaryMockData'

interface DiaryState {
  entries: DiaryEntry[]
  currentIndex: number

  nextEntry: () => void
  prevEntry: () => void
  goToEntry: (index: number) => void
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: getDiaryEntries(),
  currentIndex: 0,

  nextEntry: () => {
    const { entries, currentIndex } = get()
    if (currentIndex < entries.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  prevEntry: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 })
    }
  },

  goToEntry: (index: number) => {
    const { entries } = get()
    if (index >= 0 && index < entries.length) {
      set({ currentIndex: index })
    }
  },
}))
