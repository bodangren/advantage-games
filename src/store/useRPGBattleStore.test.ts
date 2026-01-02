import { useRPGBattleStore } from './useRPGBattleStore'

describe('useRPGBattleStore', () => {
  it('should initialize with default values', () => {
    const state = useRPGBattleStore.getState()
    
    expect(state.playerHealth).toBe(100)
    expect(state.playerMaxHealth).toBe(100)
    expect(state.enemyHealth).toBe(100)
    expect(state.enemyMaxHealth).toBe(100)
    expect(state.turn).toBe('player')
    expect(state.status).toBe('idle')
    expect(state.battleLog).toEqual([])
    expect(state.streak).toBe(0)
    expect(state.xpEarned).toBe(0)
  })

  it('should initialize battle correctly', () => {
    const { initializeBattle } = useRPGBattleStore.getState()
    initializeBattle()
    
    const state = useRPGBattleStore.getState()
    expect(state.status).toBe('playing')
    expect(state.battleLog).toHaveLength(1)
    expect(state.battleLog[0].text).toBe('A wild monster appears!')
  })

  it('should add log entries correctly', () => {
    const { addLogEntry } = useRPGBattleStore.getState()
    addLogEntry('Test message', 'player')
    
    const state = useRPGBattleStore.getState()
    expect(state.battleLog).toContainEqual({ text: 'Test message', type: 'player' })
  })
})
