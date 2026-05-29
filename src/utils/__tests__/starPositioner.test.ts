import { describe, it, expect } from 'vitest'
import { getRegionCenter, generateStarPositions } from '../starPositioner'

describe('getRegionCenter', () => {
  it('returns correct center for core region', () => {
    const center = getRegionCenter('core', 1000, 800)
    expect(center.x).toBe(500)
    expect(center.y).toBe(400)
  })

  it('returns correct center for daily region', () => {
    const center = getRegionCenter('daily', 1000, 800)
    expect(center.y).toBeGreaterThan(400)
  })

  it('returns correct center for forgotten region', () => {
    const center = getRegionCenter('forgotten', 1000, 800)
    expect(center.x).toBeGreaterThan(500)
  })
})

describe('generateStarPositions', () => {
  it('generates positions within canvas bounds', () => {
    const nodes = generateStarPositions(10, 1000, 800)
    expect(nodes).toHaveLength(10)
    nodes.forEach(node => {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(1000)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(800)
    })
  })
})
