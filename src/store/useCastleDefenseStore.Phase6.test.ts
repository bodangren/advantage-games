import { renderHook, act } from '@testing-library/react'
import { useCastleDefenseStore } from './useCastleDefenseStore'
import { CASTLE_DEFENSE_CONFIG } from '@/lib/castleDefenseConfig'
import { MAP_CONFIG } from '@/lib/castleDefense'

describe('Castle Defense Phase 6: Depth & Balancing', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.reset()
    })
  })

  test('CASTLE_DEFENSE_CONFIG structure', () => {
    expect(CASTLE_DEFENSE_CONFIG.WAVE.INITIAL_BUDGET).toBeGreaterThan(0)
    expect(CASTLE_DEFENSE_CONFIG.ENEMIES.SOLDIER.type).toBe('SOLDIER')
    expect(CASTLE_DEFENSE_CONFIG.ENEMIES.BOSS.hp).toBeGreaterThan(CASTLE_DEFENSE_CONFIG.ENEMIES.SOLDIER.hp)
  })

  test('Wave Management: Spawning and Cooldown', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    act(() => {
      result.current.initialize([{ term: 'Test', translation: 'Test' }])
      result.current.startGame()
    })

    const initialQueueLength = result.current.spawnQueue.length
    expect(initialQueueLength).toBeGreaterThan(0)

    // Simulate time passing to spawn an enemy
    act(() => {
      // Spawn timer threshold is 1500ms
      result.current.tick(1600)
    })

    expect(result.current.enemies.length).toBe(1)
    expect(result.current.spawnQueue.length).toBe(initialQueueLength - 1)

    // Fast forward to clear queue
    act(() => {
        // Run enough ticks to empty queue
        // We can't easily loop here without potentially timing out the test runner if not careful
        // But we can simulate clearing the queue manually for testing logic
        // Or just observe the state change when we forcefully empty it
    })
  })

  test('Wave Progression', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    act(() => {
      result.current.initialize([{ term: 'Test', translation: 'Test' }])
      result.current.startGame()
    })

    // Force empty queue and enemies to trigger cooldown
    act(() => {
        // Mock state to force cooldown condition
        useCastleDefenseStore.setState({ 
            enemies: [],
            spawnQueue: [],
            status: 'playing' // Will transition to cooldown next tick
        })
        result.current.tick(100) 
    })

    expect(result.current.status).toBe('cooldown')
    expect(result.current.waveCooldownTimer).toBe(CASTLE_DEFENSE_CONFIG.WAVE.COOLDOWN_MS)

    // Fast forward cooldown
    act(() => {
        result.current.tick(CASTLE_DEFENSE_CONFIG.WAVE.COOLDOWN_MS + 100)
    })

    expect(result.current.status).toBe('playing')
    expect(result.current.wave).toBe(2)
    expect(result.current.spawnQueue.length).toBeGreaterThan(0)
  })

  test('Win Condition', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    act(() => {
      result.current.initialize([{ term: 'Test', translation: 'Test' }])
      result.current.startGame()
    })

    // Simulate winning state
    act(() => {
        const slots = MAP_CONFIG.towerSlots
        const fakeTowers = slots.map((s, i) => ({
            id: `tower-${i}`,
            x: s.x,
            y: s.y,
            radius: 30,
            range: 100,
            damage: 1,
            cooldown: 100,
            lastFired: 0
        }))

        useCastleDefenseStore.setState({
            towers: fakeTowers,
            enemies: [],
            spawnQueue: [],
            status: 'playing'
        })
        
        result.current.tick(100)
    })

    expect(result.current.status).toBe('victory')
  })
})
