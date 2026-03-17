'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import type { DungeonLiberatorGameResult } from '@/components/dungeon-liberator/DungeonLiberatorGame'
import { loadVocabulary } from '@/lib/vocabLoader'
import { useGameStore } from '@/store/useGameStore'

const DungeonLiberatorGame = dynamic(
  () => import('@/components/dungeon-liberator/DungeonLiberatorGame').then((mod) => mod.DungeonLiberatorGame),
  { ssr: false }
)

export default function DungeonLiberatorPage() {
  const vocabulary = useGameStore((state) => state.vocabulary)
  const setVocabulary = useGameStore((state) => state.setVocabulary)
  const setLastResult = useGameStore((state) => state.setLastResult)

  useEffect(() => {
    if (vocabulary.length === 0) {
      loadVocabulary('dungeon-liberator')
        .then((vocab) => setVocabulary(vocab))
        .catch((error) => console.error('Failed to load vocabulary:', error))
    }
  }, [vocabulary.length, setVocabulary])

  const handleComplete = useCallback(
    (results: DungeonLiberatorGameResult) => {
      setLastResult(results.xp, results.accuracy)
    },
    [setLastResult]
  )

  return (
    <main className='min-h-screen bg-slate-950 px-6 py-10 text-white'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
        <Link
          href='/'
          className='text-sm uppercase tracking-[0.2em] text-white/60 transition hover:text-white'
        >
          Back to Home
        </Link>

        <header className='flex flex-col gap-3'>
          <h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>Dungeon Liberator</h1>
          <p className='max-w-2xl text-base text-white/70'>
            Rescue prisoners trapped in the dungeon by collecting them in the correct word order. 
            Guide your party safely to the exit portal!
          </p>
        </header>

        <DungeonLiberatorGame vocabulary={vocabulary} onComplete={handleComplete} />
      </div>
    </main>
  )
}
