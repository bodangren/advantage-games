import type { VocabularyItem } from '@/store/useGameStore'

export type RuneMatchGameResult = {
  xp: number
  accuracy: number
}

export type RuneMatchGameProps = {
  vocabulary: VocabularyItem[]
  onComplete: (result: RuneMatchGameResult) => void
}

export function RuneMatchGame({ vocabulary, onComplete }: RuneMatchGameProps) {
  return (
    <div className='flex items-center justify-center rounded-xl bg-slate-900 p-12'>
      <p className='text-slate-400'>Rune Match Game - Coming Soon</p>
    </div>
  )
}
