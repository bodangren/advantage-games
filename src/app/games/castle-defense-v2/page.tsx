'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { VocabularyItem } from '@/store/useGameStore'

// Dynamic import to avoid SSR issues with Konva
const CastleDefenseGameV2 = dynamic(
  () => import('@/components/castle-defense-v2').then(m => m.CastleDefenseGameV2),
  { ssr: false }
)

// Sample vocabulary for testing
const SAMPLE_VOCABULARY: VocabularyItem[] = [
  { term: 'hello', translation: 'hola' },
  { term: 'goodbye', translation: 'adios' },
  { term: 'friend', translation: 'amigo' },
  { term: 'house', translation: 'casa' },
  { term: 'water', translation: 'agua' },
  { term: 'food', translation: 'comida' },
  { term: 'dog', translation: 'perro' },
  { term: 'cat', translation: 'gato' },
]

export default function CastleDefenseV2Page() {
  const [lastScore, setLastScore] = useState<number | null>(null)

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score)
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
        >
          Back to Home
        </Link>

        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Castle Defense V2
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            Collect the correct translation and bring it to a tower slot to defend your base!
          </p>
        </header>

        {lastScore !== null && (
          <div className="rounded-lg bg-amber-600/20 border border-amber-600/40 px-4 py-3 text-center text-amber-400">
            Last Score: {lastScore}
          </div>
        )}

        <CastleDefenseGameV2
          vocabulary={SAMPLE_VOCABULARY}
          onGameOver={handleGameOver}
        />

        <div className="rounded-lg bg-slate-900/50 border border-white/10 p-6 space-y-3">
          <h2 className="text-xl font-semibold">How to Play</h2>
          <ul className="space-y-2 text-white/70">
            <li>• Use WASD or the D-Pad to move your character</li>
            <li>• Find and collect the word shown at the top</li>
            <li>• Bring collected words to tower slots (dashed circles)</li>
            <li>• Towers will automatically shoot at enemies</li>
            <li>• Defend your base from enemies reaching the center</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
