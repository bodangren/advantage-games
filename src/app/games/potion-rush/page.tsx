'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { loadVocabulary } from '@/lib/vocabLoader'
import type { VocabularyItem } from '@/store/useGameStore'

const PotionRushGame = dynamic(
  () => import('@/components/potion-rush/PotionRushGame'),
  { ssr: false }
)

export default function PotionRushPage() {
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([])

  useEffect(() => {
    loadVocabulary('potion-rush')
      .then((vocab) => setVocabList(vocab))
      .catch((error) => console.error('Failed to load vocabulary:', error))
  }, [])

  if (vocabList.length === 0) {
    return null // Or a loading spinner
  }

  return (
    <main className="w-full h-screen bg-neutral-900 overflow-hidden touch-none">
       <PotionRushGame
          vocabList={vocabList}
       />
    </main>
  )
}
