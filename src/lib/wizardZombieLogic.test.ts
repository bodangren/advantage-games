import { advanceWizardZombieTime, createWizardZombieState, WizardZombieState } from './wizardZombie'

describe('advanceWizardZombieTime', () => {
  const vocabulary = [{ term: 'A', translation: 'B', id: '1' }]

  it('increases game time', () => {
    const initialState = createWizardZombieState(vocabulary)
    const nextState = advanceWizardZombieTime(initialState, 100)
    
    expect(nextState.gameTime).toBe(initialState.gameTime + 100)
  })

  it('does not mutate state', () => {
    const initialState = createWizardZombieState(vocabulary)
    const nextState = advanceWizardZombieTime(initialState, 100)
    
    expect(initialState.gameTime).toBe(0)
    expect(nextState).not.toBe(initialState)
  })
})
