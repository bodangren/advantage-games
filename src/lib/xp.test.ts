import { calculateXP } from './xp'

describe('calculateXP', () => {
  it('calculates XP correctly with 100% accuracy and no speed bonus', () => {
    const xp = calculateXP(10, 10, 0)
    // baseXP = 10 * 10 = 100
    // accuracyBonus = 100 * (10/10) = 100
    // total = 200
    expect(xp).toBe(200)
  })

  it('calculates XP correctly with 50% accuracy', () => {
    const xp = calculateXP(5, 10, 0)
    // baseXP = 5 * 10 = 50
    // accuracyBonus = 50 * (5/10) = 25
    // total = 75
    expect(xp).toBe(75)
  })

  it('includes speed bonus', () => {
    const xp = calculateXP(10, 10, 50)
    expect(xp).toBe(250)
  })
})
