export function calculateXP(correctAnswers: number, totalAttempts: number, speedBonus: number): number {
  if (totalAttempts === 0) return 0
  
  const accuracy = correctAnswers / totalAttempts
  const baseXP = correctAnswers * 10
  const accuracyBonus = Math.floor(baseXP * accuracy)
  
  return baseXP + accuracyBonus + speedBonus
}
