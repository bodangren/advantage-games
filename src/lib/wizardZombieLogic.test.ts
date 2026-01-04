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

  it('spawns zombies periodically', () => {
    let state = createWizardZombieState(vocabulary)
    // Force spawn timer to threshold (assuming 1s for test simplicity, check logic constant)
    // We'll advance time by 2000ms to ensure a spawn happens
    state = advanceWizardZombieTime(state, 2000)
    
    expect(state.zombies.length).toBeGreaterThan(0)
  })

  it('zombies move towards player', () => {
    let state = createWizardZombieState(vocabulary)
    // Manually add a zombie at 0,0
    state.zombies.push({
      id: 'z1',
      x: 0,
      y: 0,
      radius: 15,
      speed: 2,
      damage: 10
    })
    
    // Player is at center (400, 300)
    const nextState = advanceWizardZombieTime(state, 16.6)
    const zombie = nextState.zombies[0]
    
    // Zombie should move positive towards player
    expect(zombie.x).toBeGreaterThan(0)
    expect(zombie.y).toBeGreaterThan(0)
  })

  it('player takes damage from zombie collision', () => {
    let state = createWizardZombieState(vocabulary)
    // Place player and zombie overlapping
    state.player.x = 100
    state.player.y = 100
    state.zombies.push({
      id: 'z1',
      x: 100,
      y: 100,
      radius: 15,
      speed: 2,
      damage: 10
    })

    const nextState = advanceWizardZombieTime(state, 16.6)
    
    // Should take damage
    expect(nextState.player.hp).toBe(state.player.hp - 10)
    // Should be invulnerable
    expect(nextState.player.invulnerabilityTime).toBeGreaterThan(0)
  })

  it('player does not take damage while invulnerable', () => {
    let state = createWizardZombieState(vocabulary)
    state.player.x = 100
    state.player.y = 100
    state.player.invulnerabilityTime = 500
    state.zombies.push({
      id: 'z1',
      x: 100,
      y: 100,
      radius: 15,
      speed: 2,
      damage: 10
    })

    const nextState = advanceWizardZombieTime(state, 16.6)
    
    expect(nextState.player.hp).toBe(state.player.hp)
    // Invulnerability should decrease
    expect(nextState.player.invulnerabilityTime).toBeLessThan(500)
  })

  it('triggers gameover when hp reaches 0', () => {
    let state = createWizardZombieState(vocabulary)
    state.player.hp = 10
    state.zombies.push({
      id: 'z1',
      x: state.player.x, // Direct hit
      y: state.player.y,
      radius: 15,
      speed: 2,
      damage: 10
    })

    const nextState = advanceWizardZombieTime(state, 16.6)
    
    expect(nextState.player.hp).toBe(0)
    expect(nextState.status).toBe('gameover')
  })
})
