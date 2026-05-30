import type { MemoryCard, EmotionType } from '../types/memory'

// ===== Emotion to color mapping =====
const EMOTION_COLORS: Record<EmotionType, string> = {
  joy: '#84fab0',
  sadness: '#a18cd1',
  anger: '#ff6b6b',
  fear: '#DDA0DD',
  neutral: '#ebedee',
}

const EMOTION_GRADIENTS: Record<EmotionType, string> = {
  joy: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  sadness: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  anger: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
  fear: 'linear-gradient(135deg, #DDA0DD 0%, #9370DB 100%)',
  neutral: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
}

const EMOTION_LABELS: Record<EmotionType, string> = {
  joy: '欢愉',
  sadness: ' melancholy',
  anger: '烈焰',
  fear: '迷雾',
  neutral: '平静',
}

export function getEmotionColor(emotion: EmotionType): string {
  return EMOTION_COLORS[emotion]
}

export function getEmotionGradient(emotion: EmotionType): string {
  return EMOTION_GRADIENTS[emotion]
}

export function getEmotionLabel(emotion: EmotionType): string {
  return EMOTION_LABELS[emotion]
}

// ===== Memory selectors for furniture modals =====

/** Bookshelf: knowledge/growth memories */
export function selectBookMemories(memories: Record<string, MemoryCard>): MemoryCard[] {
  const all = Object.values(memories)
  const knowledgeTags = ['学习', '工作', '成长', '技能']

  let filtered = all.filter(
    (m) =>
      m.tags.some((t) => knowledgeTags.includes(t)) || m.category === 'first_disclosure'
  )

  // Fallback: daily region memories
  if (filtered.length === 0) {
    filtered = all.filter((m) => m.region === 'daily')
  }

  return filtered
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 6)
}

/** TV: life/entertainment/travel memories */
export function selectMovieMemories(memories: Record<string, MemoryCard>): MemoryCard[] {
  const all = Object.values(memories)
  const sceneTags = ['旅行', '娱乐', '美食', '聚会']

  let filtered = all.filter(
    (m) => m.tags.some((t) => sceneTags.includes(t)) || m.category === 'ritual'
  )

  // Fallback: high importance memories
  if (filtered.length === 0) {
    filtered = all.filter((m) => m.importanceScore > 60)
  }

  return filtered
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3)
}

/** Speaker: one per emotion type */
export function selectSongMemories(memories: Record<string, MemoryCard>): MemoryCard[] {
  const all = Object.values(memories)
  const emotions: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'neutral']
  const result: MemoryCard[] = []

  for (const emotion of emotions) {
    const matches = all.filter((m) => m.emotionTag === emotion)
    if (matches.length > 0) {
      // Pick one randomly from this emotion group
      const pick = matches[Math.floor(Math.random() * matches.length)]
      result.push(pick)
    }
  }

  return result
}

/** Diary: recent daily memories */
export function selectDiaryMemories(memories: Record<string, MemoryCard>): MemoryCard[] {
  return Object.values(memories)
    .filter((m) => m.region === 'daily' || m.category === 'daily')
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
}

/** Desk: high priority active memories as todos */
export function selectTodoMemories(memories: Record<string, MemoryCard>): MemoryCard[] {
  return Object.values(memories)
    .filter((m) => m.status === 'active' && m.importanceScore > 70)
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5)
}

import type { Memory } from '../types/memory'

/** Corkboard: precious core memories (legacy MemoryCard format) */
export function selectCorkboardMemory(memories: Record<string, MemoryCard>): MemoryCard | null {
  const candidates = Object.values(memories).filter(
    (m) => m.region === 'core' || m.importanceScore > 85
  )
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/** Corkboard: select from unified Memory array */
export function selectCorkboardMemoryFromArray(memories: Memory[]): Memory | null {
  if (memories.length === 0) return null
  // Prefer ascended memories, then pick a recent one
  const ascended = memories.filter((m) => m.status === 'ascended')
  const pool = ascended.length > 0 ? ascended : memories
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Format memory content as a short title */
export function formatTitle(content: string, maxLen: number): string {
  if (content.length <= maxLen) return content
  return content.slice(0, maxLen) + '...'
}

/** Format days ago from timestamp */
export function formatDaysAgo(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days}天前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

/** Format date string */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
