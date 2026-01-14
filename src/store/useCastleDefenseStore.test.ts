import { renderHook, act } from '@testing-library/react'
import { useCastleDefenseStore } from './useCastleDefenseStore'

describe('useCastleDefenseStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.reset()
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    expect(result.current.status).toBe('playing')
    expect(result.current.player.inventory).toEqual([])
  })

  it('updates player input', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    act(() => {
      result.current.setPlayerInput(1, 0)
    })
    // Note: setPlayerInput updates a local var, so we can't test it directly on state 
    // without running tick().
  })

  it('moves player on tick', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
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

  it('does not move player if status is not playing', () => {
    const { result } = renderHook(() => useCastleDefenseStore())
    
    // Manually set status to gameover
    act(() => {
        useCastleDefenseStore.setState({ status: 'gameover' })
    })

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
