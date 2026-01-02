'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  BattleEnemyOption,
  BattleHeroOption,
  BattleLocationOption,
} from '@/lib/rpgBattleSelection'
import { BattleSelectionStep } from '@/store/useRPGBattleStore'

interface BattleSelectionModalProps {
  step: BattleSelectionStep
  heroes: BattleHeroOption[]
  locations: BattleLocationOption[]
  enemies: BattleEnemyOption[]
  onSelectHero: (heroId: BattleHeroOption['id']) => void
  onSelectLocation: (locationId: BattleLocationOption['id']) => void
  onSelectEnemy: (enemyId: BattleEnemyOption['id']) => void
}

interface SelectionOptionButtonProps {
  label: string
  description?: string
  onSelect: () => void
}

const formatMultiplier = (multiplier: number) => {
  const value = Number.isInteger(multiplier) ? multiplier.toFixed(0) : multiplier.toFixed(1)
  return `HP/XP x${value}`
}

function SelectionOptionButton({ label, description, onSelect }: SelectionOptionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto w-full flex-col items-start gap-1 rounded-xl px-4 py-3 text-left"
      onClick={onSelect}
    >
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </Button>
  )
}

export function BattleSelectionModal({
  step,
  heroes,
  locations,
  enemies,
  onSelectHero,
  onSelectLocation,
  onSelectEnemy,
}: BattleSelectionModalProps) {
  if (step === 'ready') {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4"
    >
      <Card className="w-full max-w-xl border-slate-200/60 bg-background/95 shadow-lg">
        <CardHeader className="space-y-1 border-b">
          {step === 'hero' ? (
            <>
              <h2 className="text-lg font-semibold text-foreground">Choose your hero</h2>
              <p className="text-sm text-muted-foreground">Cosmetic choice only.</p>
            </>
          ) : null}
          {step === 'location' ? (
            <>
              <h2 className="text-lg font-semibold text-foreground">Choose a location</h2>
              <p className="text-sm text-muted-foreground">Background only.</p>
            </>
          ) : null}
          {step === 'enemy' ? (
            <>
              <h2 className="text-lg font-semibold text-foreground">Choose an enemy</h2>
              <p className="text-sm text-muted-foreground">Stronger foes grant more XP.</p>
            </>
          ) : null}
        </CardHeader>
        <CardContent className="pt-6">
          {step === 'hero' ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {heroes.map((hero) => (
                <SelectionOptionButton
                  key={hero.id}
                  label={hero.label}
                  onSelect={() => onSelectHero(hero.id)}
                />
              ))}
            </div>
          ) : null}

          {step === 'location' ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {locations.map((location) => (
                <SelectionOptionButton
                  key={location.id}
                  label={location.label}
                  onSelect={() => onSelectLocation(location.id)}
                />
              ))}
            </div>
          ) : null}

          {step === 'enemy' ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {enemies.map((enemy) => (
                <SelectionOptionButton
                  key={enemy.id}
                  label={enemy.label}
                  description={formatMultiplier(enemy.multiplier)}
                  onSelect={() => onSelectEnemy(enemy.id)}
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
