import {
  createInitialState,
  advanceCastleDefenseTime,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_RADIUS,
} from '../castleDefenseV2'
import { SAMPLE_SENTENCES } from '../sampleSentences'

const VOCAB = SAMPLE_SENTENCES

describe('castleDefenseV2', () => {
  describe('createInitialState', () => {
    it('should create valid initial state with vocabulary', () => {
      const state = createInitialState(VOCAB)

      expect(state.status).toBe('idle')
      expect(state.player.x).toBe(GAME_WIDTH / 2)
      expect(state.player.y).toBe(GAME_HEIGHT / 2)
      expect(state.player.radius).toBe(PLAYER_RADIUS)
      expect(state.grassMap).toHaveLength(12)
      expect(state.grassMap[0]).toHaveLength(16)
      expect(state.targetSentence).toBe(VOCAB[0].term)
      expect(state.targetTranslation).toBe(VOCAB[0].translation)
      expect(state.words.length).toBe(VOCAB[0].term.split(' ').length)
    })
  })

  describe('advanceCastleDefenseTime', () => {
    it('should not update when status is idle', () => {
      const state = createInitialState(VOCAB)
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 1, dy: 0 }, VOCAB)
      expect(nextState.player.x).toBe(state.player.x)
      expect(nextState.gameTime).toBe(state.gameTime)
    })

    it('should move player and advance game time when playing', () => {
      const state = { ...createInitialState(VOCAB), status: 'playing' as const }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 1, dy: 0 }, VOCAB)
      expect(nextState.player.x).toBeGreaterThan(state.player.x)
      expect(nextState.gameTime).toBe(50)
    })

    it('should spawn an enemy when spawn timer reaches threshold', () => {
      const state = {
        ...createInitialState(VOCAB),
        status: 'playing' as const,
        spawnTimer: 1490,
        enemies: [],
        spawnQueue: ['SOLDIER'],
      }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, VOCAB)
      expect(nextState.enemies.length).toBe(1)
      expect(nextState.spawnQueue.length).toBe(0)
    })
  })
})
