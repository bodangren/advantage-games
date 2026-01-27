import React from 'react'
import { useCastleDefenseStore } from '@/store/useCastleDefenseStore'
import { motion, AnimatePresence } from 'framer-motion'

export function CastleDefenseHUD() {
  const wave = useCastleDefenseStore(state => state.wave)
  const targetTranslation = useCastleDefenseStore(state => state.targetTranslation)
  const hearts = useCastleDefenseStore(state => state.hearts)
  const score = useCastleDefenseStore(state => state.score)
  const status = useCastleDefenseStore(state => state.status)
  const waveCooldownTimer = useCastleDefenseStore(state => state.waveCooldownTimer)
  const player = useCastleDefenseStore(state => state.player)

  if (status === 'idle') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        {/* Score */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-amber-400 font-bold shadow-lg backdrop-blur-sm">
          SCORE: {score}
        </div>

        {/* Hearts */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-rose-500 font-bold shadow-lg backdrop-blur-sm">
          ❤️ {hearts}
        </div>
      </div>

      {/* Target Translation Panel (Centered Top) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <div className="bg-slate-900/90 border border-blue-500/50 rounded-xl p-3 text-center shadow-xl backdrop-blur-md">
            <div className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-1">
                Wave {wave} • Translate:
            </div>
            <div className="text-2xl font-bold text-white leading-none pb-1">
                {targetTranslation}
            </div>
        </div>
      </div>

      {/* Cooldown Overlay */}
      <AnimatePresence>
        {status === 'cooldown' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
           >
              <div className="bg-slate-900/90 border border-blue-500 rounded-2xl p-6 text-center shadow-2xl">
                 <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Next Wave In</div>
                 <div className="text-5xl font-black text-white font-mono">
                    {(waveCooldownTimer / 1000).toFixed(1)}s
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Area: Inventory */}
      <div className="absolute bottom-6 left-6 flex gap-2 items-end">
         {player.inventory.map((word, i) => (
            <motion.div 
                key={word.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative bg-slate-100 border-2 border-blue-500 rounded-lg w-12 h-10 flex items-center justify-center shadow-lg"
            >
                <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {i + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-900 text-center leading-tight px-1 overflow-hidden">
                    {word.text}
                </span>
            </motion.div>
         ))}
      </div>
    </div>
  )
}
