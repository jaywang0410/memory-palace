import { create } from 'zustand'
import type { Memory, ConstellationType } from '../types/memory'
import { UNIFIED_MEMORIES, computeMemoryRelations } from '../data/unifiedMemories'

interface UnifiedMemoryState {
  memories: Memory[]
  isAscending: boolean
  ascendingIds: string[]
  selectedStarId: string | null

  // Short-term memories (room view)
  getShortTermMemories: () => Memory[]

  // Ascended memories (starfield view)
  getAscendedMemories: () => Memory[]

  // Diary entries (short-term, formatted for diary view)
  getDiaryEntries: () => Memory[]

  // Add from conversation
  addFromConversation: (text: string, aiReply?: string) => Memory

  // Ascend a memory (short_term -> ascended)
  ascendMemory: (id: string) => void

  // Ascend all short-term memories (batch, for demo)
  ascendAllShortTerm: () => void

  // Auto-assign constellation based on content
  autoAssignConstellation: (memory: Memory) => ConstellationType

  // Get memory by id
  getMemoryById: (id: string) => Memory | undefined

  // Star selection
  selectStar: (id: string | null) => void
  hoverStar: (id: string | null) => void
}

function assignConstellation(text: string): ConstellationType {
  const lower = text.toLowerCase()

  const keywords: Record<ConstellationType, string[]> = {
    core: ['相遇', '5.16', 'loona', 'friya', '永远', '爱'],
    daily: ['早安', '早餐', '睡觉', '起床', '吃饭', '做饭', '打扫'],
    emotion: ['开心', '感动', '难过', '哭', '笑', '想念', '温暖'],
    travel: ['海边', '公园', '爬山', '旅行', '外出', '散步', '咖啡馆'],
    growth: ['工作', '学习', '项目', '技能', '进步', '完成', '读书'],
    social: ['朋友', '闺蜜', '家人', '妈妈', '聚会', '聊天', '视频'],
  }

  const scores: Record<string, number> = {}
  for (const [constellation, words] of Object.entries(keywords)) {
    scores[constellation] = words.reduce((acc, word) =>
      acc + (lower.includes(word) ? 1 : 0), 0)
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return (best[1] > 0 ? best[0] : 'daily') as ConstellationType
}

export const useUnifiedMemoryStore = create<UnifiedMemoryState>((set, get) => ({
  memories: computeMemoryRelations(UNIFIED_MEMORIES),
  isAscending: false,
  ascendingIds: [],
  selectedStarId: null,

  getShortTermMemories: () => {
    return get().memories.filter((m) => m.status === 'short_term')
  },

  getAscendedMemories: () => {
    return get().memories.filter((m) => m.status === 'ascended')
  },

  getDiaryEntries: () => {
    return get().memories
      .filter((m) => m.status === 'short_term')
      .slice().reverse()
  },

  addFromConversation: (text: string, aiReply?: string) => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`

    const newMemory: Memory = {
      id: `mem-conv-${Date.now()}`,
      date: dateStr,
      title: text.slice(0, 12) + (text.length > 12 ? '...' : ''),
      people: ['loona', 'friya'],
      scene: '实时对话',
      event: aiReply
        ? `主人说："${text}"\n我回复："${aiReply}"`
        : text,
      emotion: '温暖',
      source: 'conversation',
      status: 'short_term',
      constellation: null,
      relatedMemoryIds: [],
    }

    set((state) => ({
      memories: computeMemoryRelations([...state.memories, newMemory]),
    }))

    return newMemory
  },

  ascendMemory: (id: string) => {
    const memory = get().memories.find((m) => m.id === id)
    if (!memory || memory.status !== 'short_term') return

    const constellation = assignConstellation(memory.event)

    set((state) => ({
      isAscending: true,
      ascendingIds: [...state.ascendingIds, id],
      memories: state.memories.map((m) =>
        m.id === id
          ? { ...m, status: 'ascended' as const, constellation }
          : m
      ),
    }))

    // Clear ascending state after animation
    setTimeout(() => {
      set((state) => ({
        isAscending: state.ascendingIds.length <= 1,
        ascendingIds: state.ascendingIds.filter((aid) => aid !== id),
      }))
    }, 3000)
  },

  ascendAllShortTerm: () => {
    const shortTerm = get().memories.filter((m) => m.status === 'short_term')
    if (shortTerm.length === 0) return

    const ids = shortTerm.map((m) => m.id)

    set((state) => ({
      isAscending: true,
      ascendingIds: ids,
      memories: state.memories.map((m) => {
        if (m.status !== 'short_term') return m
        return {
          ...m,
          status: 'ascended' as const,
          constellation: assignConstellation(m.event),
        }
      }),
    }))

    setTimeout(() => {
      set({ isAscending: false, ascendingIds: [] })
    }, 3000)
  },

  autoAssignConstellation: (memory: Memory) => {
    return assignConstellation(memory.event)
  },

  getMemoryById: (id: string) => {
    return get().memories.find((m) => m.id === id)
  },

  selectStar: (id: string | null) => {
    set({ selectedStarId: id })
  },

  hoverStar: (_id: string | null) => {
    // Reserved for future hover effects
  },
}))
