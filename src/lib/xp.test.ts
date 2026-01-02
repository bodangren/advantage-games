import { calculateXP } from './xp'

describe('calculateXP', () => {
  it('calculates XP correctly with 100% accuracy', () => {
    // Score = 100, Accuracy = 1.0
    // XP = (100 / 10) * 1.0 = 10
    const xp = calculateXP(100, 10, 10)
    expect(xp).toBe(10)
  })

  it('calculates XP correctly with 50% accuracy', () => {
    // Score = 100, Accuracy = 0.5 (5 correct / 10 total)
    // XP = (100 / 10) * 0.5 = 5
    const xp = calculateXP(100, 5, 10)
    expect(xp).toBe(5)
  })

  it('calculates XP correctly with 0 attempts', () => {
    const xp = calculateXP(0, 0, 0)
    expect(xp).toBe(0)
  })
  
  it('rounds down to nearest integer', () => {
    // Score = 150, Accuracy = 0.666... (2/3)
    // XP = (150 / 10) * 0.666... = 15 * 0.666... = 10
    const xp = calculateXP(150, 2, 3)
    expect(xp).toBe(10)
  })
})