import { advanceWizardZombieTime, createWizardZombieState, WizardZombieState } from './wizardZombie'

describe('advanceWizardZombieTime', () => {
  const vocabulary = [{ term: 'A', translation: 'B', id: '1' }]

  it('increases game time', () => {
    const initialState = createWizardZombieState(vocabulary)
    const nextState = advanceWizardZombieTime(initialState, 100)
    
    expect(nextState.gameTime).toBe(initialState.gameTime + 100)
  })

  it('moves player based on input', () => {
    const initialState = createWizardZombieState(vocabulary)
    // Speed is 3. dt=16.6 (1 frame). Expect move ~3px.
    const nextState = advanceWizardZombieTime(initialState, 16.6, { dx: 1, dy: 0 })
    
    expect(nextState.player.x).toBeGreaterThan(initialState.player.x)
    expect(nextState.player.y).toBe(initialState.player.y)
  })

  it('normalizes diagonal movement', () => {
    const initialState = createWizardZombieState(vocabulary)
    const nextState = advanceWizardZombieTime(initialState, 16.6, { dx: 1, dy: 1 })
    
    const deltaX = nextState.player.x - initialState.player.x
    const deltaY = nextState.player.y - initialState.player.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Should be approx equal to speed (3), not speed * sqrt(2) (4.24)
    expect(distance).toBeCloseTo(initialState.player.speed, 1)
  })

  it('clamps player to boundaries', () => {
    const initialState = createWizardZombieState(vocabulary)
    // Teleport player to edge
    initialState.player.x = 0
    
    // Try to move left (out of bounds)
    const nextState = advanceWizardZombieTime(initialState, 16.6, { dx: -1, dy: 0 })
    
    // Should be clamped to radius
    expect(nextState.player.x).toBe(20) // PLAYER_RADIUS
  })
})
