'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useGameStore, VocabularyItem } from '@/store/useGameStore'
import { useRPGBattleStore } from '@/store/useRPGBattleStore'
import { selectBattleActions, WordPerformance } from '@/lib/rpgBattleWordSelection'
import { calculateRpgBattleXp } from '@/lib/rpgBattleXp'
import { ActionMenu } from '@/components/rpg-battle/ActionMenu'
import { BattleScene } from '@/components/rpg-battle/BattleScene'
import { BattleLog } from '@/components/rpg-battle/BattleLog'
import { HealthBar } from '@/components/rpg-battle/HealthBar'
import { Sprite } from '@/components/rpg-battle/Sprite'
import { BattleResults } from '@/components/rpg-battle/BattleResults'
import { BattleEffects } from '@/components/rpg-battle/BattleEffects'

const SAMPLE_VOCAB: VocabularyItem[] = [
  { term: 'Sword', translation: 'Espada' },
  { term: 'Shield', translation: 'Escudo' },
  { term: 'Fire', translation: 'Fuego' },
  { term: 'Ice', translation: 'Hielo' },
  { term: 'Wind', translation: 'Viento' },
  { term: 'Earth', translation: 'Tierra' },
  { term: 'Water', translation: 'Agua' },
]

const ACTION_COUNT = 3
const BASIC_DAMAGE = 10
const POWER_DAMAGE = 18
const ENEMY_DAMAGE = 8
const MAX_TURNS = 12

export default function RpgBattlePage() {
  const vocabulary = useGameStore((state) => state.vocabulary)
  const setVocabulary = useGameStore((state) => state.setVocabulary)
  const {
    playerHealth,
    playerMaxHealth,
    enemyHealth,
    enemyMaxHealth,
    turn,
    status,
    battleLog,
    playerPose,
    enemyPose,
    inputLocked,
    streak,
    initializeBattle,
    setTurn,
    damageEnemy,
    enemyAttack,
    submitAnswer,
    addLogEntry,
  } = useRPGBattleStore()

  const [inputValue, setInputValue] = useState('')
  const [performance, setPerformance] = useState<Record<string, WordPerformance>>({})
  const [turnsTaken, setTurnsTaken] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const [flashKey, setFlashKey] = useState(0)
  const [flashTone, setFlashTone] = useState<'player' | 'enemy'>('enemy')

  useEffect(() => {
    setVocabulary(SAMPLE_VOCAB)
    initializeBattle()
  }, [initializeBattle, setVocabulary])

  useEffect(() => {
    setLongestStreak((prev) => Math.max(prev, streak))
  }, [streak])

  const actions = useMemo(
    () => selectBattleActions(vocabulary, performance, { count: ACTION_COUNT }),
    [performance, vocabulary]
  )

  const { totalCorrect, totalAttempts } = useMemo(() => {
    return Object.values(performance).reduce(
      (acc, entry) => ({
        totalCorrect: acc.totalCorrect + entry.correct,
        totalAttempts: acc.totalAttempts + entry.attempts,
      }),
      { totalCorrect: 0, totalAttempts: 0 }
    )
  }, [performance])

  const menuActions = useMemo(
    () => actions.map((action) => ({ id: action.id, label: action.term, power: action.power })),
    [actions]
  )

  const updatePerformance = (term: string, correct: boolean) => {
    setPerformance((prev) => {
      const current = prev[term] ?? { correct: 0, attempts: 0 }
      return {
        ...prev,
        [term]: {
          correct: current.correct + (correct ? 1 : 0),
          attempts: current.attempts + 1,
        },
      }
    })
  }

  const triggerEnemyTurn = () => {
    setTurn('enemy')
    setTimeout(() => {
      enemyAttack(ENEMY_DAMAGE)
      setTurnsTaken((prev) => prev + 1)
      setFlashTone('player')
      setFlashKey((prev) => prev + 1)
      setShakeKey((prev) => prev + 1)
      addLogEntry('Enemy strikes back!', 'enemy')
    }, 600)
  }

  const handleSubmit = (value: string) => {
    if (status !== 'playing' || inputLocked || turn !== 'player') return

    const normalized = value.trim().toLowerCase()
    const matched = actions.find((action) => action.translation.toLowerCase() === normalized)
    const fallback = actions.find((action) => action.power === 'power') ?? actions[0]

    if (matched) {
      const damage = matched.power === 'power' ? POWER_DAMAGE : BASIC_DAMAGE
      const nextEnemyHealth = Math.max(0, enemyHealth - damage)

      submitAnswer(value, matched.translation, matched.power)
      updatePerformance(matched.term, true)
      addLogEntry(`You cast ${matched.term}!`, 'player')
      damageEnemy(damage)
      setTurnsTaken((prev) => prev + 1)
      setFlashTone('enemy')
      setFlashKey((prev) => prev + 1)
      setShakeKey((prev) => prev + 1)
      setInputValue('')

      if (nextEnemyHealth > 0) {
        triggerEnemyTurn()
      }
      return
    }

    if (fallback) {
      submitAnswer(value, fallback.translation)
      updatePerformance(fallback.term, false)
      addLogEntry(`Incorrect! The spell was ${fallback.translation}.`, 'system')
    }
  }

  const xp = calculateRpgBattleXp({
    playerHealth,
    playerMaxHealth,
    turnsTaken: Math.max(1, turnsTaken),
    maxTurns: MAX_TURNS,
    longestStreak,
  })

  const handleRestart = () => {
    setInputValue('')
    setPerformance({})
    setTurnsTaken(0)
    setLongestStreak(0)
    initializeBattle()
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">RPG Battle</h1>
          <p className="text-muted-foreground">
            Type the correct translation to unleash your spells.
          </p>
        </header>

        {status === 'victory' || status === 'defeat' ? (
          <BattleResults
            outcome={status}
            xp={xp}
            accuracy={totalAttempts > 0 ? totalCorrect / totalAttempts : 0}
            onRestart={handleRestart}
          />
        ) : (
          <BattleEffects shakeKey={shakeKey} flashKey={flashKey} flashTone={flashTone}>
            <BattleScene
              playerHealth={
                <HealthBar
                  current={playerHealth}
                  max={playerMaxHealth}
                  label="Hero"
                  tone="player"
                />
              }
              enemyHealth={
                <HealthBar
                  current={enemyHealth}
                  max={enemyMaxHealth}
                  label="Enemy"
                  tone="enemy"
                />
              }
              player={
                <Sprite
                  src="/games/rpg-battle/hero_male_pose_sheet_3x3.png"
                  pose={playerPose}
                  alt="Hero"
                  size={140}
                  flip
                />
              }
              enemy={
                <Sprite
                  src="/games/rpg-battle/enemy_slime_pose_sheet_3x3.png"
                  pose={enemyPose}
                  alt="Enemy"
                  size={140}
                />
              }
              actionMenu={
                <ActionMenu
                  actions={menuActions}
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSubmit}
                  disabled={inputLocked || turn !== 'player' || status !== 'playing'}
                />
              }
              battleLog={<BattleLog entries={battleLog} />}
            />
          </BattleEffects>
        )}
      </div>
    </main>
  )
}
