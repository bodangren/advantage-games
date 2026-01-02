'use client'

import React, { useState, useCallback } from 'react'
import { useGameStore, VocabularyItem } from '@/store/useGameStore'
import { Missile } from './Missile'
import { useInterval } from '@/hooks/useInterval'
import { nanoid } from 'nanoid'
import { InputController } from './InputController'

interface ActiveMissile extends VocabularyItem {
  id: string
}

export function GameEngine() {
  const { vocabulary, status, decreaseHealth } = useGameStore()
  const [activeMissiles, setActiveMissiles] = useState<ActiveMissile[]>([])
  const [spawnRate, setSpawnRate] = useState(3000) // 3 seconds initially

  const spawnMissile = useCallback(() => {
    if (status !== 'playing' || vocabulary.length === 0) return

    const randomVocab = vocabulary[Math.floor(Math.random() * vocabulary.length)]
    const newMissile: ActiveMissile = {
      ...randomVocab,
      id: nanoid(),
    }

    setActiveMissiles((prev) => [...prev, newMissile])
  }, [status, vocabulary])

  useInterval(spawnMissile, status === 'playing' ? spawnRate : null)

  const handleReachBottom = useCallback((id: string) => {
    decreaseHealth()
    setActiveMissiles((prev) => prev.filter((m) => m.id !== id))
  }, [decreaseHealth])

  const checkAnswer = useCallback((answer: string) => {
    // Find the oldest missile that matches the answer
    const matchingMissile = activeMissiles.find(
      (m) => m.translation.toLowerCase() === answer.toLowerCase()
    )

    if (matchingMissile) {
      // Logic for score increase will be handled here later
      setActiveMissiles((prev) => prev.filter((m) => m.id !== matchingMissile.id))
      return true
    }
    return false
  }, [activeMissiles])

  if (status !== 'playing') return null

  return (
    <div className="relative w-full h-[600px] bg-slate-900 overflow-hidden border-x-4 border-slate-800 shadow-inner rounded-lg">
      {activeMissiles.map((missile) => (
        <Missile
          key={missile.id}
          id={missile.id}
          term={missile.term}
          duration={10} // 10 seconds to reach bottom initially
          onReachBottom={handleReachBottom}
        />
      ))}
      
      {/* Bases at the bottom */}
      <div className="absolute bottom-0 w-full flex justify-around p-2">
        <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>

      <div className="absolute bottom-16 left-0 right-0">
        <InputController onSubmit={checkAnswer} />
      </div>
    </div>
  )
}
