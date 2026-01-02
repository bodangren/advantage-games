'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface MissileProps {
  id: string
  term: string
  duration: number
  onReachBottom: (id: string) => void
}

export function Missile({ id, term, duration, onReachBottom }: MissileProps) {
  return (
    <motion.div
      initial={{ top: -50, left: `${Math.random() * 80 + 10}%` }}
      animate={{ top: '100%' }}
      transition={{ duration, ease: 'linear' }}
      onAnimationComplete={() => onReachBottom(id)}
      className="absolute p-2 bg-destructive text-destructive-foreground rounded shadow-lg font-bold"
      style={{ position: 'absolute' }}
    >
      {term}
    </motion.div>
  )
}
