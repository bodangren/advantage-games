import { create } from 'zustand'

export interface VocabularyItem {
  term: string
  translation: string
}

export interface GameState {
  vocabulary: VocabularyItem[]
  score: number
  health: number
  status: 'idle' | 'playing' | 'game-over'
  correctAnswers: number
  totalAttempts: number
  setVocabulary: (vocab: VocabularyItem[]) => void
  resetGame: () => void
  increaseScore: (amount: number) => void
  decreaseHealth: () => void
  incrementAttempts: () => void
}

export const useGameStore = create<GameState>((set) => ({
  vocabulary: [],
  score: 0,
  health: 3,
  status: 'idle',
  correctAnswers: 0,
  totalAttempts: 0,
  setVocabulary: (vocab) => set({ vocabulary: vocab }),
  resetGame: () => set({ score: 0, health: 3, status: 'playing', correctAnswers: 0, totalAttempts: 0 }),
  increaseScore: (amount) => set((state) => ({ 
    score: state.score + amount,
    correctAnswers: state.correctAnswers + 1,
    totalAttempts: state.totalAttempts + 1
  })),
  decreaseHealth: () => set((state) => {
    const newHealth = state.health - 1
    return { 
      health: newHealth,
      status: newHealth <= 0 ? 'game-over' : state.status
    }
  }),
  incrementAttempts: () => set((state) => ({ totalAttempts: state.totalAttempts + 1 })),
}))
