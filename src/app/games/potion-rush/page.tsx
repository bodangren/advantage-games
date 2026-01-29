'use client'

import dynamic from 'next/dynamic'
import { SAMPLE_SENTENCES } from '@/lib/sampleSentences'

const PotionRushGame = dynamic(
  () => import('@/components/potion-rush/PotionRushGame'),
  { ssr: false }
)

export default function PotionRushPage() {
  return (
    <main className="w-full h-screen bg-neutral-900 overflow-hidden touch-none">
       <PotionRushGame 
          vocabList={SAMPLE_SENTENCES} 
       />
    </main>
  )
}
