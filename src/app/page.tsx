'use client'

import { useEffect } from 'react'
import { GameContainer } from '@/components/game/GameContainer'
import { useGameStore } from '@/store/useGameStore'

const SAMPLE_VOCAB = [
  { term: 'Apple', translation: 'Manzana' },
  { term: 'Bread', translation: 'Pan' },
  { term: 'House', translation: 'Casa' },
  { term: 'Dog', translation: 'Perro' },
  { term: 'Water', translation: 'Agua' },
  { term: 'Book', translation: 'Libro' },
  { term: 'Friend', translation: 'Amigo' },
  { term: 'City', translation: 'Ciudad' },
  { term: 'School', translation: 'Escuela' },
  { term: 'Sun', translation: 'Sol' },
]

export default function Home() {
  const setVocabulary = useGameStore((state) => state.setVocabulary)

  useEffect(() => {
    setVocabulary(SAMPLE_VOCAB)
  }, [setVocabulary])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Vocab Arcade
          </h1>
          <p className="text-muted-foreground">
            Master your vocabulary through action-packed games.
          </p>
        </header>

        <GameContainer />
      </div>
    </main>
  )
}
