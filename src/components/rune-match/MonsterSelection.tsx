'use client'

import React from 'react'
import { RUNE_MATCH_CONFIG, type MonsterType } from '@/lib/runeMatchConfig'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Swords, Trophy, Heart } from 'lucide-react'

type MonsterSelectionProps = {
  onSelect: (monster: MonsterType) => void
}

const MONSTER_METADATA: Record<MonsterType, { label: string; color: string; description: string }> = {
  goblin: { label: 'Goblin', color: 'bg-green-900/50 text-green-400 border-green-500/30', description: 'Weak but fast.' },
  skeleton: { label: 'Skeleton', color: 'bg-slate-800/50 text-slate-300 border-slate-500/30', description: 'Restless undead.' },
  orc: { label: 'Orc', color: 'bg-red-900/50 text-red-400 border-red-500/30', description: 'A fierce warrior.' },
  dragon: { label: 'Dragon', color: 'bg-amber-900/50 text-amber-400 border-amber-500/30', description: 'The ultimate challenge.' },
}

export function MonsterSelection({ onSelect }: MonsterSelectionProps) {
  const monsterTypes: MonsterType[] = ['goblin', 'skeleton', 'orc', 'dragon']

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Choose Your Opponent</h2>
        <p className="text-slate-400">Select a monster to begin the rune match battle.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {monsterTypes.map((type) => {
          const config = RUNE_MATCH_CONFIG.monsters[type]
          const meta = MONSTER_METADATA[type]

          return (
            <Card 
              key={type}
              className={`bg-slate-900/50 border-2 transition-all hover:scale-105 ${meta.color} hover:border-current cursor-default group`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center group-hover:scale-110 transition-transform">{meta.label}</CardTitle>
                <p className="text-xs text-center opacity-70">{meta.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> HP</span>
                    <span className="font-bold">{config.hp} HP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Swords className="w-4 h-4" /> ATK</span>
                    <span className="font-bold">1-{config.attack}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Reward</span>
                    <span className="font-bold text-yellow-500">{config.xp} XP</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onSelect(type)}
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white hover:text-black border-none transition-colors"
                >
                  Battle
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
