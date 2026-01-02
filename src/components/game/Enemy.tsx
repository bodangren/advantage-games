'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Skull } from 'lucide-react'

interface EnemyProps {
  id: string
  x: number
  term: string
  duration: number
  onReachBottom: (id: string) => void
  isDying?: boolean
}

export function Enemy({ id, x, term, duration, onReachBottom, isDying = false }: EnemyProps) {
  return (
    <motion.div
      initial={{ top: -50, left: `${x}%`, opacity: 1, scale: 1 }}
      animate={isDying ? { 
        scale: 2, 
        opacity: 0,
        rotate: 180,
      } : { 
        top: '100%' 
      }}
      transition={isDying ? { duration: 0.3 } : { duration, ease: 'linear' }}
      onAnimationComplete={() => {
        if (!isDying) {
          onReachBottom(id)
        }
      }}
      className="absolute flex flex-col items-center group"
      style={{ position: 'absolute' }}
    >
      <div className="relative">
        <Skull className="w-10 h-10 text-slate-300 fill-slate-800 group-hover:text-primary transition-colors" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background/90 px-2 py-1 rounded border shadow-sm whitespace-nowrap font-bold text-sm">
          {term}
        </div>
      </div>
    </motion.div>
  )
}