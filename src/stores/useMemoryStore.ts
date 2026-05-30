import { create } from 'zustand'
import type { MemoryCard, DialogueTurn, LinkStrength } from '../types/memory'
import { MOCK_MEMORIES } from '../data/mockMemories'

interface MemoryState {
  memories: Record<string, MemoryCard>
  shortTermQueue: string[]
  coreConstellation: string[]
  dailyBelt: string[]
  emotionStorms: string[]
  forgotten: string[]
  imagination: string[]

  addMemory: (dialogue: DialogueTurn[]) => void
  archiveMemory: (id: string) => void
  forgetMemory: (id: string) => void
  restoreMemory: (id: string) => void
  crushMemory: (id: string) => void
  linkMemories: (id1: string, id2: string, strength: LinkStrength) => void
  unlinkMemories: (id1: string, id2: string) => void
  demoteFromCore: (id: string) => void
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: MOCK_MEMORIES.reduce((acc, mem) => {
    acc[mem.id] = mem
    return acc
  }, {} as Record<string, MemoryCard>),
  shortTermQueue: [],
  coreConstellation: MOCK_MEMORIES.filter(m => m.region === 'core').map(m => m.id),
  dailyBelt: MOCK_MEMORIES.filter(m => m.region === 'daily').map(m => m.id),
  emotionStorms: MOCK_MEMORIES.filter(m => m.region === 'emotion').map(m => m.id),
  forgotten: MOCK_MEMORIES.filter(m => m.region === 'forgotten').map(m => m.id),
  imagination: [],

  addMemory: (dialogue) => {
    const id = `mem-${Date.now()}`
    const newMemory: MemoryCard = {
      id,
      timestamp: Date.now(),
      content: dialogue.map(d => d.text).join(' ').slice(0, 100),
      emotionTag: 'neutral',
      importanceScore: 50,
      category: 'daily',
      relatedMemoryIds: [],
      tags: [],
      status: 'active',
      region: 'daily',
      lastTouched: Date.now(),
    }
    set(state => ({
      memories: { ...state.memories, [id]: newMemory },
      shortTermQueue: [...state.shortTermQueue, id],
      dailyBelt: [...state.dailyBelt, id],
    }))
  },

  archiveMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'archived' as const },
      },
    }))
  },

  forgetMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'forgotten' as const, region: 'forgotten' as const },
      },
      forgotten: state.forgotten.includes(id)
        ? state.forgotten
        : [...state.forgotten, id],
      dailyBelt: state.dailyBelt.filter(bid => bid !== id),
      coreConstellation: state.coreConstellation.filter(cid => cid !== id),
      emotionStorms: state.emotionStorms.filter(eid => eid !== id),
    }))
  },

  restoreMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'archived' as const, region: 'daily' as const },
      },
      forgotten: state.forgotten.filter(fid => fid !== id),
      dailyBelt: state.dailyBelt.includes(id)
        ? state.dailyBelt
        : [...state.dailyBelt, id],
    }))
  },

  crushMemory: (id) => {
    set(state => {
      const { [id]: _, ...rest } = state.memories
      return {
        memories: rest,
        forgotten: state.forgotten.filter(fid => fid !== id),
        dailyBelt: state.dailyBelt.filter(bid => bid !== id),
        coreConstellation: state.coreConstellation.filter(cid => cid !== id),
        emotionStorms: state.emotionStorms.filter(eid => eid !== id),
        shortTermQueue: state.shortTermQueue.filter(qid => qid !== id),
        imagination: state.imagination.filter(iid => iid !== id),
      }
    })
  },

  linkMemories: (id1, id2, _strength) => {
    set(state => {
      const mem1 = state.memories[id1]
      if (!mem1) return state
      const alreadyLinked = mem1.relatedMemoryIds.includes(id2)
      return {
        memories: {
          ...state.memories,
          [id1]: {
            ...mem1,
            relatedMemoryIds: alreadyLinked
              ? mem1.relatedMemoryIds
              : [...mem1.relatedMemoryIds, id2],
          },
        },
      }
    })
  },

  unlinkMemories: (id1, id2) => {
    set(state => {
      const mem1 = state.memories[id1]
      if (!mem1) return state
      return {
        memories: {
          ...state.memories,
          [id1]: {
            ...mem1,
            relatedMemoryIds: mem1.relatedMemoryIds.filter(rid => rid !== id2),
          },
        },
      }
    })
  },

  demoteFromCore: (id) => {
    set(state => ({
      coreConstellation: state.coreConstellation.filter(cid => cid !== id),
      dailyBelt: state.dailyBelt.includes(id)
        ? state.dailyBelt
        : [...state.dailyBelt, id],
    }))
  },
}))
