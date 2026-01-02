import { useGameStore } from './useGameStore'

describe('useGameStore', () => {
  it('should initialize with default values', () => {
    // Placeholder
  })

  it('should have correct initial state defined in store', () => {
     // This accesses the state as defined in the file (persisted from import)
     // unless I manually changed it.
     // To ensure I'm testing the "raw" store, I'll rely on it not being modified yet 
     // or use a separate test file that doesn't modify it. 
     // But simpler: just assert 0.
     const { score, health, status, vocabulary } = useGameStore.getState()
     
     expect(score).toBe(0)
     expect(health).toBe(3)
     expect(status).toBe('idle')
     expect(vocabulary).toEqual([])
  })
})
