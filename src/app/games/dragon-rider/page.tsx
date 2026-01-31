'use client'

import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import { DragonRiderGame } from '@/components/dragon-rider/DragonRiderGame'
import type { DragonRiderResults } from '@/lib/dragonRider'
import { loadVocabulary } from '@/lib/vocabLoader'
import { useGameStore } from '@/store/useGameStore'

export default function DragonRiderPage() {
  const vocabulary = useGameStore((state) => state.vocabulary)
  const setVocabulary = useGameStore((state) => state.setVocabulary)
  const setLastResult = useGameStore((state) => state.setLastResult)

  useEffect(() => {
    loadVocabulary('dragon-rider')
      .then((vocab) => setVocabulary(vocab))
      .catch((error) => console.error('Failed to load vocabulary:', error))
  }, [setVocabulary])

  const handleComplete = useCallback(
    (results: DragonRiderResults) => {
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
          <h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>Dragon Rider</h1>
          <p className='max-w-2xl text-base text-white/70'>
            Choose the correct gate to grow your dragon flight before the Skeleton King arrives.
          </p>
        </header>

        <DragonRiderGame vocabulary={vocabulary} onComplete={handleComplete} />
      </div>
    </main>
  )
}
