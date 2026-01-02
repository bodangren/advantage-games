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
  setVocabulary: (vocab: VocabularyItem[]) => void
  resetGame: () => void
  increaseScore: (amount: number) => void
  decreaseHealth: () => void
}

export const useGameStore = create<GameState>((set) => ({
  vocabulary: [],
  score: 0,
  health: 3,
  status: 'idle',
  setVocabulary: (vocab) => set({ vocabulary: vocab }),
  resetGame: () => set({ score: 0, health: 3, status: 'playing' }),
  increaseScore: (amount) => set((state) => ({ score: state.score + amount })),
  decreaseHealth: () => set((state) => ({ health: state.health - 1 })),
}))
