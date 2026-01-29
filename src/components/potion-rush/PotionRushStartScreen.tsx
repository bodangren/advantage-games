'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Beaker, Users, ShoppingCart, ArrowRight, Play, BookOpen, Info } from 'lucide-react'
import { VocabularyItem } from '@/store/useGameStore'

interface PotionRushStartScreenProps {
  onStart: () => void
  vocabulary: VocabularyItem[]
}

export default function PotionRushStartScreen({ onStart, vocabulary }: PotionRushStartScreenProps) {
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
            <div className="text-xs uppercase tracking-[0.4em] text-purple-400 font-bold">Alchemical Management</div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Potion Rush</h2>
          </div>
          <div className="px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
            Ready to Brew
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                <Info className="w-5 h-5 text-purple-400" /> How to Play
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">1. Take Orders</h4>
                    <p className="text-xs text-slate-400">Customers appear at the counter with requests in their native language.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">2. Collect Ingredients</h4>
                    <p className="text-xs text-slate-400">Find the target language words scrolling on the conveyor belt.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Beaker className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">3. Brew & Serve</h4>
                    <p className="text-xs text-slate-400">Drag correct words to a cauldron. Once finished, drag the potion to the customer!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-200">
              <ArrowRight className="w-6 h-6 text-yellow-400 shrink-0" />
              <p><b>Pro Tip:</b> Use the Trash Portal to clear ruined potions if you make a mistake.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Potion Recipes
              </h3>
              <span className="text-xs text-white/40">{vocabulary.length} Recipes</span>
            </div>
            <div className="max-h-[240px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/50 scrollbar-thin scrollbar-thumb-white/10">
              {vocabulary.length === 0 ? (
                <div className="p-8 text-center text-white/40 italic">Recipe book is empty...</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {vocabulary.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 px-4 hover:bg-white/5 transition-colors">
                      <span className="font-medium text-white">{item.term}</span>
                      <span className="text-slate-400 text-sm">{item.translation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="p-6 sm:p-8 border-t border-white/10 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-center sm:justify-between gap-6">
        <div className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Match Meanings</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Drag and Drop</div>
        </div>
        <button 
          onClick={onStart}
          className="group relative px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="relative z-10">Start Brewing</span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </footer>
    </motion.div>
  )
}
