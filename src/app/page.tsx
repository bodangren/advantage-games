'use client'

import { useEffect } from 'react'
import { GameContainer } from '@/components/game/GameContainer'
import { useGameStore } from '@/store/useGameStore'

const SAMPLE_VOCAB = [
  { term: 'สวัสดี', translation: 'Hello' },
  { term: 'ขอบคุณ', translation: 'Thank you' },
  { term: 'ใช่', translation: 'Yes' },
  { term: 'ไม่ใช่', translation: 'No' },
  { term: 'สบายดีไหม', translation: 'How are you' },
  { term: 'แมว', translation: 'Cat' },
  { term: 'หมา', translation: 'Dog' },
  { term: 'น้ำ', translation: 'Water' },
  { term: 'ข้าว', translation: 'Rice' },
  { term: 'รัก', translation: 'Love' },
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
