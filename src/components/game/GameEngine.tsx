'use client'

import React, { useState, useCallback } from 'react'
import { useGameStore, VocabularyItem } from '@/store/useGameStore'
import { useInterval } from '@/hooks/useInterval'
import { useSound } from '@/hooks/useSound'
import { nanoid } from 'nanoid'
import { InputController } from './InputController'
import { AnimatePresence, motion } from 'framer-motion'
import { Castle as CastleIcon, Wand2 } from 'lucide-react'
import { Enemy } from './Enemy'
import { Explosion } from './Explosion'

interface ActiveMissile extends VocabularyItem {
  id: string
}

interface ActiveExplosion {
  id: string
  x: number
  y: number
}

export function GameEngine() {
  const { vocabulary, status, health, decreaseHealth, increaseScore, incrementAttempts } = useGameStore()
  const { playSound } = useSound()
  const [activeMissiles, setActiveMissiles] = useState<ActiveMissile[]>([])
  const [explosions, setExplosions] = useState<ActiveExplosion[]>([])
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
    setSpawnRate((prev) => Math.min(prev + 200, 3000))
    setMissileDuration((prev) => Math.min(prev + 0.5, 15))
    
    incrementAttempts()
    decreaseHealth()
    setActiveMissiles((prev) => prev.filter((m) => m.id !== id))
  }, [decreaseHealth, playSound, incrementAttempts])

  const checkAnswer = useCallback((answer: string) => {
    const matchingMissile = activeMissiles.find(
      (m) => m.translation.toLowerCase() === answer.toLowerCase()
    )

    if (matchingMissile) {
      playSound('success')
      setFeedback('correct')
      setConsecutiveCorrect((prev) => prev + 1)
      
      setExplosions(prev => [...prev, { 
        id: nanoid(), 
        x: Math.random() * 80 + 10, 
        y: Math.random() * 40 + 10 
      }])

      if ((consecutiveCorrect + 1) % 3 === 0) {
        setSpawnRate((prev) => Math.max(prev - 200, 1000))
        setMissileDuration((prev) => Math.max(prev - 0.5, 5))
      }

      increaseScore(10)
      setTimeout(() => setFeedback(null), 500)
      setActiveMissiles((prev) => prev.filter((m) => m.id !== matchingMissile.id))
      return true
    } else {
      playSound('error')
      setFeedback('incorrect')
      setConsecutiveCorrect(0)
      incrementAttempts()
      setTimeout(() => setFeedback(null), 500)
      return false
    }
  }, [activeMissiles, playSound, consecutiveCorrect, increaseScore, incrementAttempts])

  if (status !== 'playing') return null

  return (
    <div className={`relative w-full h-[600px] bg-slate-900 overflow-hidden border-x-4 border-slate-800 shadow-inner rounded-lg transition-colors duration-300 ${
      feedback === 'correct' ? 'bg-green-900/20' : 
      feedback === 'incorrect' ? 'bg-red-900/20' : ''
    }`}>
      <AnimatePresence>
        {activeMissiles.map((missile) => (
          <Enemy
            key={missile.id}
            id={missile.id}
            term={missile.term}
            duration={missileDuration}
            onReachBottom={handleReachBottom}
          />
        ))}
      </AnimatePresence>

      {explosions.map((exp) => (
        <Explosion 
          key={exp.id} 
          x={exp.x} 
          y={exp.y} 
          onComplete={() => setExplosions(prev => prev.filter(e => e.id !== exp.id))} 
        />
      ))}
      
      {/* Bases/Castles at the bottom */}
      <div className="absolute bottom-0 w-full flex justify-around p-4 items-end pointer-events-none">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{ 
              opacity: health > index ? 1 : 0,
              scale: health > index ? 1 : 0.5,
              y: health > index ? 0 : 20
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <CastleIcon className="w-16 h-16 text-slate-400 fill-slate-700 shadow-lg" />
            <div className="w-20 h-4 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
               <motion.div 
                 initial={{ width: '100%' }}
                 animate={{ width: health > index ? '100%' : '0%' }}
                 className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Magician Avatar */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          animate={feedback === 'correct' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Wand2 className="w-12 h-12 text-primary relative z-10" />
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-0 right-0">
        <InputController onSubmit={checkAnswer} />
      </div>
    </div>
  )
}
