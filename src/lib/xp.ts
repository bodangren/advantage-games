export function calculateXP(score: number, correctAnswers: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 0
  
  const accuracy = correctAnswers / totalAttempts
  
  // Formula: (Score / 10) * Accuracy
  return Math.floor((score / 10) * accuracy)
}