import {
  createGriffinRidersEscapeState,
  tickGriffinRidersEscape,
  switchLane,
  spawnWave,
  type GriffinRiderState
} from './griffinRidersEscape'
import { GRIFFIN_RIDERS_ESCAPE_CONFIG } from './griffinRidersEscapeConfig'

const mockVocabulary = [
  { term: 'The cat sits', translation: 'แมวนั่ง' },
  { term: 'Dog runs fast', translation: 'หมาวิ่งเร็ว' }
]

describe('griffinRidersEscape logic', () => {
  describe('createGriffinRidersEscapeState', () => {
    it('initializes the game state correctly', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      expect(state.status).toBe('playing')
      expect(state.lives).toBe(GRIFFIN_RIDERS_ESCAPE_CONFIG.initialLives)
      expect(state.playerLane).toBe('center')
      expect(state.words.length).toBeGreaterThan(0)
      expect(state.targetIndex).toBe(0)
    })

    it('throws error if vocabulary is empty', () => {
      expect(() => createGriffinRidersEscapeState([])).toThrow('Vocabulary cannot be empty')
    })
  })

  describe('spawnWave', () => {
    it('spawns a wave of gates when not an obstacle wave', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary, { rng: () => 0.9 }) // Above obstacle freq
      const newState = spawnWave(state, () => 0.9)
      const gates = newState.objects.filter(obj => obj.type === 'gate')
      expect(gates.length).toBe(3) // One for each lane
      expect(gates.some(g => g.orderIndex === state.targetIndex)).toBe(true)
    })

    it('spawns an obstacle wave based on rng', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      // Mock difficulty config to ensure obstacle freq is met
      const newState = spawnWave(state, () => 0.05) // Low roll for obstacle
      const obstacles = newState.objects.filter(obj => obj.type === 'obstacle')
      expect(obstacles.length).toBeGreaterThan(0)
    })
  })

  describe('tickGriffinRidersEscape', () => {
    it('moves objects towards the player', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const stateWithWave = spawnWave(state)
      const initialZ = stateWithWave.objects[0].z
      const newState = tickGriffinRidersEscape(stateWithWave, mockVocabulary, 100)
      expect(newState.objects[0].z).toBeLessThan(initialZ)
    })

    it('handles collision with correct gate', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const targetWord = state.words[0]
      const stateWithGate: GriffinRiderState = {
        ...state,
        objects: [{
          id: 'test-gate',
          z: 2, // Near collision
          lane: 'center',
          type: 'gate',
          word: targetWord,
          orderIndex: 0
        }]
      }
      const newState = tickGriffinRidersEscape(stateWithGate, mockVocabulary, 16)
      expect(newState.targetIndex).toBe(1)
      expect(newState.score).toBeGreaterThan(0)
      expect(newState.objects[0].collisionTriggered).toBe(true)
    })

    it('handles collision with wrong gate', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const stateWithGate: GriffinRiderState = {
        ...state,
        objects: [{
          id: 'wrong-gate',
          z: 2,
          lane: 'center',
          type: 'gate',
          word: 'Wrong',
          orderIndex: 99
        }]
      }
      const newState = tickGriffinRidersEscape(stateWithGate, mockVocabulary, 16)
      expect(newState.lives).toBe(GRIFFIN_RIDERS_ESCAPE_CONFIG.initialLives - 1)
      expect(newState.combo).toBe(0)
    })

    it('handles collision with obstacle', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const stateWithObstacle: GriffinRiderState = {
        ...state,
        objects: [{
          id: 'test-obstacle',
          z: 2,
          lane: 'center',
          type: 'obstacle'
        }]
      }
      const newState = tickGriffinRidersEscape(stateWithObstacle, mockVocabulary, 16)
      expect(newState.lives).toBe(GRIFFIN_RIDERS_ESCAPE_CONFIG.initialLives - 1)
    })

    it('sets status to defeat when lives reach zero', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const lowLivesState: GriffinRiderState = {
        ...state,
        lives: 1,
        objects: [{
          id: 'test-obstacle',
          z: 2,
          lane: 'center',
          type: 'obstacle'
        }]
      }
      const newState = tickGriffinRidersEscape(lowLivesState, mockVocabulary, 16)
      expect(newState.status).toBe('defeat')
    })

    it('spawns new waves over time', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const newState = tickGriffinRidersEscape(state, mockVocabulary, 3000) // Longer than spawn interval
      expect(newState.objects.length).toBeGreaterThan(0)
      expect(newState.spawnTimer).toBeLessThan(3000)
    })
  })

  describe('switchLane', () => {
    it('switches lane to the left', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const newState = switchLane(state, 'left')
      expect(newState.playerLane).toBe('left')
    })

    it('switches lane to the right', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const newState = switchLane(state, 'right')
      expect(newState.playerLane).toBe('right')
    })

    it('does not switch past boundaries', () => {
      const state = createGriffinRidersEscapeState(mockVocabulary)
      const leftState = switchLane(state, 'left')
      const moreLeftState = switchLane(leftState, 'left')
      expect(moreLeftState.playerLane).toBe('left')
      
      const rightState = switchLane(state, 'right')
      const moreRightState = switchLane(rightState, 'right')
      expect(moreRightState.playerLane).toBe('right')
    })
  })
})
