import {
  createInitialState,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_RADIUS,
  BASE_HP,
} from '../castleDefenseV2'

describe('castleDefenseV2', () => {
  describe('createInitialState', () => {
    it('should create valid initial state with empty vocabulary', () => {
      const state = createInitialState([])

      expect(state.status).toBe('playing')
      expect(state.player.x).toBe(GAME_WIDTH / 2)
      expect(state.player.y).toBe(GAME_HEIGHT - 100)
      expect(state.player.radius).toBe(PLAYER_RADIUS)
      expect(state.player.inventory).toEqual([])
      expect(state.enemies).toEqual([])
      expect(state.base.hp).toBe(BASE_HP)
      expect(state.wave).toBe(1)
    })

    it('should assign target words to tower slots from vocabulary', () => {
      const vocab = [
        { term: 'hello', translation: 'hola' },
        { term: 'world', translation: 'mundo' },
      ]
      const state = createInitialState(vocab)

      expect(state.towerSlots.length).toBeGreaterThan(0)
      expect(state.towerSlots[0].targetWord).toBe('hola')
      expect(state.towerSlots[1].targetWord).toBe('mundo')
    })

    it('should set initial target word from vocabulary', () => {
      const vocab = [{ term: 'test', translation: 'prueba' }]
      const state = createInitialState(vocab)

      expect(state.targetWord).toBe('prueba')
    })
  })
})
