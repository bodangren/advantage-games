'use client'

import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Target } from 'lucide-react'
import { GameStartScreen, type ControlHint, type Instruction } from '@/components/game/GameStartScreen'
import { GameEngine } from './GameEngine'
import { GameEndScreen } from '@/components/game/GameEndScreen'
import { calculateXP } from '@/lib/xp'

const MAGIC_DEFENSE_INSTRUCTIONS: Instruction[] = [
  { step: 1, text: 'Type the correct translation to target falling words.' },
  { step: 2, text: 'Press Enter to launch a spell.' },
  { step: 3, text: 'Protect the castles for as long as you can.' },
]

const MAGIC_DEFENSE_CONTROLS: ControlHint[] = [
  { label: 'Type', keys: 'Keyboard', color: 'bg-amber-500' },
  { label: 'Fire', keys: 'Enter', color: 'bg-emerald-500' },
]

export function GameContainer() {
  const { status, vocabulary, score, correctAnswers, totalAttempts, resetGame } = useGameStore()

  const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0
  const xp = calculateXP(score, correctAnswers, totalAttempts)

  if (status === 'idle') {
    return (
      <GameStartScreen
        gameTitle="Magic Defense"
        gameSubtitle="Vocab Edition"
        icon={Target}
        vocabulary={vocabulary}
        instructions={MAGIC_DEFENSE_INSTRUCTIONS}
        proTip="Fast, accurate typing earns more XP."
        controls={MAGIC_DEFENSE_CONTROLS}
        onStart={resetGame}
      />
    )
  }

  if (status === 'playing') {
    return <GameEngine />
  }

  if (status === 'game-over') {
    return (
      <GameEndScreen
        status="defeat"
        title="Game Over"
        subtitle="The castles have fallen."
        score={score}
        accuracy={accuracy}
        xp={xp}
        onRestart={resetGame}
        restartButtonText="Try Again"
      />
    )
  }

  return null
}
