'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Swords, Target, Sparkles, BookOpen, Play } from 'lucide-react'
import { VocabularyItem } from '@/store/useGameStore'

interface CastleDefenseStartScreenProps {
  onStart: () => void
  vocabulary: VocabularyItem[]
}

export default function CastleDefenseStartScreen({
  onStart,
  vocabulary,
}: CastleDefenseStartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-slate-950/90 text-white overflow-hidden backdrop-blur-sm"
    >
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-amber-400 font-bold">Kingdom Defense</div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Castle Defense</h2>
          </div>
          <div className="px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
            Rally the Guard
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                <Shield className="w-5 h-5 text-amber-400" /> How to Defend
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">01.</span>
                  <span>Collect the sentence words in order to prepare a tower.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">02.</span>
                  <span>Move to an empty tower base to build and protect the path.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">03.</span>
                  <span>Defeat incoming enemies before they reach the castle.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">
              <Sparkles className="w-6 h-6 text-yellow-400 shrink-0" />
              <p><b>Pro Tip:</b> Finish sentences quickly to unlock more towers and control the waves.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Practice Sentences
              </h3>
              <span className="text-xs text-white/40">{vocabulary.length} Sentences</span>
            </div>
            <div className="max-h-[260px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/50 scrollbar-thin scrollbar-thumb-white/10">
              {vocabulary.length === 0 ? (
                <div className="p-8 text-center text-white/40 italic">No sentences loaded...</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {vocabulary.map((item, i) => (
                    <div key={`${item.term}-${i}`} className="flex flex-col gap-1 p-3 px-4 hover:bg-white/5 transition-colors">
                      <span className="font-medium text-white leading-snug">{item.term}</span>
                      <span className="text-slate-400 text-sm leading-snug">{item.translation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="p-6 sm:p-8 border-t border-white/10 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Move: Arrows / WASD</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Build: Walk to base</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Collect: Touch words</div>
        </div>
        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="relative z-10">Start Defense</span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </footer>
    </motion.div>
  )
}
