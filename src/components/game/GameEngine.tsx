'use client'

import React, { useState, useCallback } from 'react'
import { useGameStore, VocabularyItem } from '@/store/useGameStore'
import { Missile } from './Missile'
import { useInterval } from '@/hooks/useInterval'
import { useSound } from '@/hooks/useSound'
import { nanoid } from 'nanoid'
import { InputController } from './InputController'
import { AnimatePresence, motion } from 'framer-motion'

interface ActiveMissile extends VocabularyItem {
  id: string
}

export function GameEngine() {
  const { vocabulary, status, decreaseHealth } = useGameStore()
  const { playSound } = useSound()
  const [activeMissiles, setActiveMissiles] = useState<ActiveMissile[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [spawnRate, setSpawnRate] = useState(3000)
  const [missileDuration, setMissileDuration] = useState(10)

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
    playSound('missile-hit')
    setConsecutiveCorrect(0)
    // Reset or slow down difficulty on miss?
    setSpawnRate((prev) => Math.min(prev + 200, 3000))
    setMissileDuration((prev) => Math.min(prev + 0.5, 10))
    
    decreaseHealth()
    setActiveMissiles((prev) => prev.filter((m) => m.id !== id))
  }, [decreaseHealth, playSound])

  const checkAnswer = useCallback((answer: string) => {
    // Find the oldest missile that matches the answer
    const matchingMissile = activeMissiles.find(
      (m) => m.translation.toLowerCase() === answer.toLowerCase()
    )

    if (matchingMissile) {
      playSound('success')
      setFeedback('correct')
      setConsecutiveCorrect((prev) => prev + 1)
      
      // Increase difficulty every 3 correct answers
      if ((consecutiveCorrect + 1) % 3 === 0) {
        setSpawnRate((prev) => Math.max(prev - 200, 1000))
        setMissileDuration((prev) => Math.max(prev - 0.5, 3))
      }

      setTimeout(() => setFeedback(null), 500)
      setActiveMissiles((prev) => prev.filter((m) => m.id !== matchingMissile.id))
      return true
    } else {
      playSound('error')
      setFeedback('incorrect')
      setConsecutiveCorrect(0)
      setTimeout(() => setFeedback(null), 500)
      return false
    }
  }, [activeMissiles, playSound, consecutiveCorrect])

  if (status !== 'playing') return null

  return (
    <div className={`relative w-full h-[600px] bg-slate-900 overflow-hidden border-x-4 border-slate-800 shadow-inner rounded-lg transition-colors duration-300 ${
      feedback === 'correct' ? 'bg-green-900/20' : 
      feedback === 'incorrect' ? 'bg-red-900/20' : ''
    }`}>
      <AnimatePresence>
        {activeMissiles.map((missile) => (
          <Missile
            key={missile.id}
            id={missile.id}
            term={missile.term}
            duration={missileDuration}
            onReachBottom={handleReachBottom}
          />
        ))}
      </AnimatePresence>
      
      {/* Bases at the bottom */}
      <div className="absolute bottom-0 w-full flex justify-around p-2">
        <motion.div 
          animate={feedback === 'incorrect' ? { x: [-5, 5, -5, 5, 0] } : {}}
          className="flex justify-around w-full"
        >
          <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <div className="w-16 h-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-0 right-0">
        <InputController onSubmit={checkAnswer} />
      </div>
    </div>
  )
}
