import { describe, it, expect } from 'vitest'
import { generateMockMemories, getRegionDistribution } from '../generateMockData'

describe('generateMockMemories', () => {
  it('generates exactly 300 memories', () => {
    const memories = generateMockMemories(300)
    expect(memories).toHaveLength(300)
  })

  it('generates unique IDs', () => {
    const memories = generateMockMemories(300)
    const ids = memories.map(m => m.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(300)
  })

  it('distributes memories across all regions', () => {
    const memories = generateMockMemories(300)
    const dist = getRegionDistribution(memories)
    expect(dist.core).toBeGreaterThanOrEqual(5)
    expect(dist.daily).toBeGreaterThanOrEqual(200)
    expect(dist.emotion).toBeGreaterThanOrEqual(20)
    expect(dist.forgotten).toBeGreaterThanOrEqual(15)
  })

  it('all memories have required fields', () => {
    const memories = generateMockMemories(10)
    memories.forEach(m => {
      expect(m.id).toBeTruthy()
      expect(m.timestamp).toBeGreaterThan(0)
      expect(m.content).toBeTruthy()
      expect(m.emotionTag).toBeTruthy()
      expect(m.importanceScore).toBeGreaterThanOrEqual(0)
      expect(m.importanceScore).toBeLessThanOrEqual(100)
      expect(m.region).toBeTruthy()
    })
  })
})
