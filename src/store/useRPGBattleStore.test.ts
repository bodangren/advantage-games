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

  it('should transition turns correctly', () => {
    const { initializeBattle, setTurn } = useRPGBattleStore.getState()
    initializeBattle()
    
    setTurn('enemy')
    expect(useRPGBattleStore.getState().turn).toBe('enemy')
    
    setTurn('player')
    expect(useRPGBattleStore.getState().turn).toBe('player')
  })

  it('should update battle status correctly', () => {
    const { setStatus } = useRPGBattleStore.getState()
    
    setStatus('victory')
    expect(useRPGBattleStore.getState().status).toBe('victory')
    
    setStatus('defeat')
    expect(useRPGBattleStore.getState().status).toBe('defeat')
  })

  it('should apply damage to the player and handle defeat', () => {
    const { initializeBattle, damagePlayer } = useRPGBattleStore.getState()
    initializeBattle()

    damagePlayer(30)
    expect(useRPGBattleStore.getState().playerHealth).toBe(70)
    expect(useRPGBattleStore.getState().status).toBe('playing')

    damagePlayer(200)
    expect(useRPGBattleStore.getState().playerHealth).toBe(0)
    expect(useRPGBattleStore.getState().status).toBe('defeat')
  })

  it('should apply damage to the enemy and handle victory', () => {
    const { initializeBattle, damageEnemy } = useRPGBattleStore.getState()
    initializeBattle()

    damageEnemy(45)
    expect(useRPGBattleStore.getState().enemyHealth).toBe(55)
    expect(useRPGBattleStore.getState().status).toBe('playing')

    damageEnemy(200)
    expect(useRPGBattleStore.getState().enemyHealth).toBe(0)
    expect(useRPGBattleStore.getState().status).toBe('victory')
  })
})
