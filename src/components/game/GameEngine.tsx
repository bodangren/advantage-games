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

import { useInterval } from '@/hooks/useInterval'
import { useSound } from '@/hooks/useSound'
import { nanoid } from 'nanoid'
import { InputController } from './InputController'
import { AnimatePresence, motion } from 'framer-motion'
import { Castle as CastleIcon, Wand2 } from 'lucide-react'
import { Enemy } from './Enemy'

interface ActiveMissile extends VocabularyItem {
  id: string
}

export function GameEngine() {
  const { vocabulary, status, health, decreaseHealth, increaseScore, incrementAttempts } = useGameStore()
  const { playSound } = useSound()
  const [activeMissiles, setActiveMissiles] = useState<ActiveMissile[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [spawnRate, setSpawnRate] = useState(3000)
  const [missileDuration, setMissileDuration] = useState(10)

  // ... rest of the component ...

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
