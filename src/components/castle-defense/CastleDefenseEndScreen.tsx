'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, Swords, RotateCcw, Shield } from 'lucide-react'

interface CastleDefenseEndScreenProps {
  status: 'gameover' | 'victory'
  score: number
  xp: number
  wavesCompleted: number
  enemiesDefeated: number
  accuracy: number
  onRestart: () => void
}

export default function CastleDefenseEndScreen({
  status,
  score,
  xp,
  wavesCompleted,
  enemiesDefeated,
  accuracy,
  onRestart,
}: CastleDefenseEndScreenProps) {
  const isVictory = status === 'victory'
  const title = isVictory ? 'Victory!' : 'Defeated'
  const subtitle = isVictory ? 'The castle stands strong.' : 'The castle has fallen.'
  const safeAccuracy = Number.isFinite(accuracy) ? Math.max(0, Math.min(accuracy, 1)) : 0
  const accuracyPercent = Math.round(safeAccuracy * 100)
  const containerBorder = isVictory ? 'border-emerald-500/30' : 'border-rose-500/30'
  const iconShell = isVictory ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
  const titleColor = isVictory ? 'text-emerald-400' : 'text-rose-400'
  const xpShell = isVictory ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-6 text-white"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`w-full max-w-xl rounded-3xl border ${containerBorder} bg-slate-900/90 p-8 shadow-2xl`}
      >
        <header className="text-center space-y-2">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${iconShell}`}
          >
            {isVictory ? <Shield className="h-9 w-9" /> : <Swords className="h-9 w-9" />}
          </div>
          <h2 className={`text-4xl font-black ${titleColor}`}>{title}</h2>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">{subtitle}</p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
              <Trophy className="h-3 w-3" /> Final Score
            </div>
            <div className="text-3xl font-black text-white">{score}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
              <Target className="h-3 w-3" /> Accuracy
            </div>
            <div className="text-3xl font-black text-white">{accuracyPercent}%</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Waves Cleared</div>
            <div className="text-2xl font-bold text-white">{wavesCompleted}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Enemies Defeated</div>
            <div className="text-2xl font-bold text-white">{enemiesDefeated}</div>
          </div>
          <div className={`sm:col-span-2 rounded-2xl border p-4 text-center ${xpShell}`}>
            <div className="text-xs uppercase tracking-wider font-bold">
              XP Earned: {xp}
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-8 w-full rounded-2xl bg-white py-4 text-slate-950 font-black uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcw className="h-5 w-5" /> Play Again
          </span>
        </button>
      </motion.div>
    </motion.div>
  )
}
