import type { Memory } from '../types/memory'
import type { DiaryEntry } from '../types/diary'
import type { StarMemory } from '../types/starfield'
import { DIARY_ENTRIES } from './diaryMockData'
import { ENRICHED_STAR_MEMORIES } from './starMemories'

function diaryToMemory(entry: DiaryEntry): Memory {
  const emotionMap: Record<string, string> = {
    '主人今天心情不错': '开心',
    '主人今天有点累': '疲惫',
    '主人今天特别开心': '开心',
    '主人今天有点低落': '低落',
    '主人今天精神满满': '兴奋',
    '主人今天很平静': '平静',
    '主人今天有点焦虑': '焦虑',
  }

  const title = entry.events[0]?.content.slice(0, 12) || '今日日记'

  return {
    id: `mem-diary-${entry.id.replace('diary-', '')}`,
    date: entry.date,
    title: title.length > 12 ? title + '...' : title,
    people: ['loona', 'friya'],
    scene: '家里',
    event: entry.aiDiary,
    emotion: emotionMap[entry.userMood] || '温暖',
    source: 'observation',
    status: 'short_term',
    constellation: null,
    relatedMemoryIds: [],
  }
}

function starToMemory(star: StarMemory): Memory {
  return {
    id: star.id,
    date: star.date,
    title: star.title,
    people: star.people,
    scene: star.scene,
    event: star.event,
    emotion: star.emotion,
    source: 'observation',
    status: 'ascended',
    constellation: star.constellation,
    relatedMemoryIds: star.relatedStarIds,
  }
}

export const UNIFIED_MEMORIES: Memory[] = [
  ...DIARY_ENTRIES.map(diaryToMemory),
  ...ENRICHED_STAR_MEMORIES.map(starToMemory),
]

export function computeMemoryRelations(memories: Memory[]): Memory[] {
  return memories.map((mem) => {
    const related: string[] = []

    for (const other of memories) {
      if (other.id === mem.id) continue

      let score = 0
      if (other.scene === mem.scene) score += 2
      const commonPeople = other.people.filter((p) => mem.people.includes(p))
      if (commonPeople.length > 0) score += commonPeople.length
      if (other.emotion === mem.emotion) score += 1
      if (other.constellation && other.constellation === mem.constellation) score += 0.5

      if (score >= 2) {
        related.push(other.id)
      }
    }

    return { ...mem, relatedMemoryIds: related.slice(0, 5) }
  })
}
