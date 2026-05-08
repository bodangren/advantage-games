import { act } from '@testing-library/react'
import { usePotionRushStore } from './usePotionRushStore'

describe('Potion Rush Endless Mode', () => {
  beforeEach(() => {
    act(() => {
      usePotionRushStore.getState().reset()
      usePotionRushStore.getState().startGame([{ term: 'dummy', definition: 'dummy', id: '0' }])
    })
  })

  it('should end game when dayTime reaches 1', () => {
    // Clear vocabList to prevent customer spawns that would affect reputation
    act(() => {
        usePotionRushStore.setState({ vocabList: [] })
    })

    // Tick for 200 seconds - dayTime increases by dt * 0.01, so 200 * 0.01 = 2
    act(() => {
        usePotionRushStore.getState().tick(200, 1000)
    })

    const state = usePotionRushStore.getState()
    expect(state.gameState).toBe('GAME_OVER')
    expect(state.dayTime).toBeGreaterThanOrEqual(1)
  })
})
