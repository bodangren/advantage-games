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
import { MagicBolt } from './MagicBolt'

interface ActiveMissile extends VocabularyItem {
  id: string
  x: number
}

interface ActiveExplosion {
  id: string
  x: number
  y: number
}

interface ActiveBolt {
  id: string
  targetX: number
  targetY: number // We'll need to estimate Y or just shoot to top? Enemy moves.
  // Actually, we can just shoot to the current estimated Y or just use a fixed "hit" Y if we can't track it easily.
  // Or, we can just shoot to the enemy's X and a fixed Y (like 50% or wherever it is).
  // Since framer motion handles the enemy movement, JS doesn't know exact Y.
  // Let's approximate or just shoot to 'top' but that looks weird if enemy is low.
  // We can pass a `y` to Enemy too but that complicates the animation (needs to update).
  // Simple approach: Shoot to the enemy's X and a fixed Y (e.g. 50%) or try to estimate based on time? Too complex.
  // Let's shoot to the enemy's X at roughly 50% height for now, or just off screen top?
  // Let's try shooting to targetX and Y=20 (near top).
}

export function GameEngine() {
  const { vocabulary, status, health, decreaseHealth, increaseScore, incrementAttempts } = useGameStore()
  const { playSound } = useSound()
  const [activeMissiles, setActiveMissiles] = useState<ActiveMissile[]>([])
  const [explosions, setExplosions] = useState<ActiveExplosion[]>([])
  const [bolts, setBolts] = useState<ActiveBolt[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [spawnRate, setSpawnRate] = useState(5000)
  const [missileDuration, setMissileDuration] = useState(15)

  const spawnMissile = useCallback(() => {
    if (status !== 'playing' || vocabulary.length === 0) return

    const randomVocab = vocabulary[Math.floor(Math.random() * vocabulary.length)]
    const newMissile: ActiveMissile = {
      ...randomVocab,
      id: nanoid(),
      x: Math.random() * 80 + 10,
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

  const handleBoltComplete = useCallback((boltId: string, enemyId: string, enemyX: number) => {
    setBolts(prev => prev.filter(b => b.id !== boltId))
    
    // Trigger explosion
    setExplosions(prev => [...prev, { 
      id: nanoid(), 
      x: enemyX, 
      y: 50 // Approximate Y since we don't track it perfectly
    }])
    
    // Remove enemy
    setActiveMissiles((prev) => prev.filter((m) => m.id !== enemyId))
  }, [])

  const checkAnswer = useCallback((answer: string) => {
    const matchingMissile = activeMissiles.find(
      (m) => m.translation.toLowerCase() === answer.toLowerCase()
    )

    if (matchingMissile) {
      playSound('success')
      setFeedback('correct')
      setConsecutiveCorrect((prev) => prev + 1)
      
      // Spawn Bolt
      const boltId = nanoid()
      // We pass the callback to the component or handle state change?
      // Since `onAnimationComplete` is on the component, we can just pass a handler there?
      // But we need to know WHICH enemy to kill. 
      // Let's store the targetEnemyId in the bolt state
      setBolts(prev => [...prev, {
        id: boltId,
        targetX: matchingMissile.x,
        targetY: 20, // Aim high
        targetEnemyId: matchingMissile.id
      }])

      if ((consecutiveCorrect + 1) % 3 === 0) {
        setSpawnRate((prev) => Math.max(prev - 200, 1000))
        setMissileDuration((prev) => Math.max(prev - 0.5, 5))
      }

      increaseScore(10)
      setTimeout(() => setFeedback(null), 500)
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
            x={missile.x}
            term={missile.term}
            duration={missileDuration}
            onReachBottom={handleReachBottom}
          />
        ))}
      </AnimatePresence>

      {bolts.map((bolt) => (
        <MagicBolt 
          key={bolt.id}
          startX={50}
          startY={80} // Wizard position
          targetX={bolt.targetX}
          targetY={bolt.targetY}
          onComplete={() => handleBoltComplete(bolt.id, bolt.targetEnemyId, bolt.targetX)}
        />
      ))}

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
        {/* Left Castle (Dies 2nd, so visible if health >= 2) */}
        <motion.div
          animate={{ 
            opacity: health >= 2 ? 1 : 0,
            scale: health >= 2 ? 1 : 0.5,
            y: health >= 2 ? 0 : 20,
            filter: health >= 2 ? 'none' : 'grayscale(100%) brightness(0.5)'
          }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <CastleIcon className="w-16 h-16 text-slate-400 fill-slate-700 shadow-lg" />
          <div className="w-20 h-4 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
             <motion.div 
               initial={{ width: '100%' }}
               animate={{ width: health >= 2 ? '100%' : '0%' }}
               className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
             />
          </div>
        </motion.div>

        {/* Center Wizard (Dies last, visible if health >= 1) */}
        {/* We keep the avatar separate above, but maybe this castle represents him? 
            Let's keep the castle visual for consistency or make this one distinct?
            The spec said "Wizard can be the center 'castle'".
            Let's keep the castle icon but maybe gold? */}
        <motion.div
          animate={{ 
            opacity: health >= 1 ? 1 : 0,
            scale: health >= 1 ? 1 : 0.5,
            y: health >= 1 ? 0 : 20,
            filter: health >= 1 ? 'none' : 'grayscale(100%) brightness(0.5)'
          }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <CastleIcon className="w-20 h-20 text-yellow-500 fill-yellow-900/50 shadow-lg" />
          <div className="w-24 h-4 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
             <motion.div 
               initial={{ width: '100%' }}
               animate={{ width: health >= 1 ? '100%' : '0%' }}
               className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
             />
          </div>
        </motion.div>

        {/* Right Castle (Dies 1st, visible if health >= 3) */}
        <motion.div
          animate={{ 
            opacity: health >= 3 ? 1 : 0,
            scale: health >= 3 ? 1 : 0.5,
            y: health >= 3 ? 0 : 20,
            filter: health >= 3 ? 'none' : 'grayscale(100%) brightness(0.5)'
          }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <CastleIcon className="w-16 h-16 text-slate-400 fill-slate-700 shadow-lg" />
          <div className="w-20 h-4 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
             <motion.div 
               initial={{ width: '100%' }}
               animate={{ width: health >= 3 ? '100%' : '0%' }}
               className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
             />
          </div>
        </motion.div>
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
