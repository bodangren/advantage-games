import { createCastleDefenseState, MAP_CONFIG, GAME_WIDTH } from './castleDefense'

describe('createCastleDefenseState', () => {
  it('initializes with default values', () => {
    const state = createCastleDefenseState([])
    
    expect(state.status).toBe('idle')
    expect(state.hearts).toBe(5)
    expect(state.wave).toBe(1)
    expect(state.player.x).toBe(GAME_WIDTH / 2)
  })

  it('initializes a grassMap with correct dimensions', () => {
    const state = createCastleDefenseState([])
    expect(state.grassMap).toHaveLength(12) // Rows
    expect(state.grassMap[0]).toHaveLength(16) // Cols
    expect(state.grassMap[0][0]).toBeGreaterThanOrEqual(0)
    expect(state.grassMap[0][0]).toBeLessThan(4)
  })

  it('uses provided vocabulary', () => {
    const vocab = [{ term: 'Apple', translation: 'Pomme' }]
    const state = createCastleDefenseState(vocab)
    
    expect(state.targetSentence).toBe('Apple')
    expect(state.targetTranslation).toBe('Pomme')
  })

  it('initializes with empty entities', () => {
    const state = createCastleDefenseState([])
    expect(state.enemies).toHaveLength(0)
    expect(state.towers).toHaveLength(0)
    expect(state.words.length).toBeGreaterThan(0)
    expect(state.projectiles).toHaveLength(0)
  })
})

describe('MAP_CONFIG', () => {
  it('has valid path points', () => {
    expect(MAP_CONFIG.path.length).toBeGreaterThan(1)
  })

  it('has tower slots', () => {
    expect(MAP_CONFIG.towerSlots.length).toBeGreaterThan(0)
  })
})
