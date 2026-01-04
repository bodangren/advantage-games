'use client'

import { VocabularyItem } from '@/store/useGameStore'

interface WizardZombieGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: any) => void
}

export function WizardZombieGame({ vocabulary, onComplete }: WizardZombieGameProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
      <div className="flex h-full items-center justify-center">
        <p className="text-white/50 italic">Wizard vs Zombie Game (Coming Soon)</p>
      </div>
    </div>
  )
}
