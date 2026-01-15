import { renderHook, act } from '@testing-library/react'
import { useCastleDefenseStore } from './useCastleDefenseStore'

describe('useCastleDefenseStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.reset()
    })
  })

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    expect(result.current.status).toBe('idle')
    expect(result.current.player.inventory).toEqual([])
  })

  it('starts game', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.startGame()
    })
    expect(result.current.status).toBe('playing')
  })

  it('updates player input', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.setPlayerInput(1, 0)
    })
  })

  it('moves player on tick when playing', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    // Start game first
    act(() => {
        result.current.startGame()
    })

    // Set input
    act(() => {
      result.current.setPlayerInput(1, 0) // Move Right
    })

    const initialX = result.current.player.x

    // Run tick
    act(() => {
      result.current.tick(100) // 100ms
    })

    expect(result.current.player.x).toBeGreaterThan(initialX)
  })

  it('does not move player if status is idle', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    // Status is idle by default
    act(() => {
      result.current.setPlayerInput(1, 0)
    })

    const initialX = result.current.player.x

    act(() => {
      result.current.tick(100)
    })

    expect(result.current.player.x).toBe(initialX)
  })
})