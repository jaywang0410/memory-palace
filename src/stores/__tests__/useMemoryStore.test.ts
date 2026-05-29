import { describe, it, expect, beforeEach } from 'vitest'
import { useMemoryStore } from '../useMemoryStore'

describe('useMemoryStore', () => {
  beforeEach(() => {
    useMemoryStore.setState({
      memories: {},
      shortTermQueue: [],
      coreConstellation: [],
      dailyBelt: [],
      emotionStorms: [],
      forgotten: [],
      imagination: [],
    })
  })

  it('initializes with empty state', () => {
    const state = useMemoryStore.getState()
    expect(Object.keys(state.memories)).toHaveLength(0)
    expect(state.coreConstellation).toHaveLength(0)
  })

  it('can add a memory', () => {
    const { addMemory } = useMemoryStore.getState()
    addMemory([{ speaker: 'user', text: 'hello', timestamp: Date.now() }])
    const state = useMemoryStore.getState()
    expect(Object.keys(state.memories)).toHaveLength(1)
  })

  it('can forget a memory', () => {
    const { addMemory, forgetMemory } = useMemoryStore.getState()
    addMemory([{ speaker: 'user', text: 'hello', timestamp: Date.now() }])
    const id = Object.keys(useMemoryStore.getState().memories)[0]
    forgetMemory(id)
    const state = useMemoryStore.getState()
    expect(state.memories[id].status).toBe('forgotten')
  })
})
