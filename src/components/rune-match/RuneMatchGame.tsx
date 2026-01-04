'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva'
import { AnimatePresence, motion } from 'framer-motion'
import { createRuneMatchState, type RuneMatchState } from '@/lib/runeMatch'
import { RUNE_MATCH_CONFIG, type MonsterType } from '@/lib/runeMatchConfig'
import type { VocabularyItem } from '@/store/useGameStore'
import { withBasePath } from '@/lib/basePath'

export type RuneMatchGameResult = {
  xp: number
  accuracy: number
}

export type RuneMatchGameProps = {
  vocabulary: VocabularyItem[]
  onComplete: (result: RuneMatchGameResult) => void
}

type RuneMatchAssets = {
  monsters: {
    goblin: HTMLImageElement
    skeleton: HTMLImageElement
    orc: HTMLImageElement
    dragon: HTMLImageElement
  }
  runes: {
    base: HTMLImageElement
    heal: HTMLImageElement
    shield: HTMLImageElement
  }
  background: HTMLImageElement
}

const buildSpriteGrid = (width: number, height: number, cols: number, rows: number) => {
  const fw = width / cols
  const fh = height / rows
  return { fw, fh }
}

const getSpriteCrop = (fw: number, fh: number, col: number, row: number) => ({
  x: col * fw,
  y: row * fh,
  width: fw,
  height: fh,
})

export function RuneMatchGame({ vocabulary, onComplete }: RuneMatchGameProps) {
  const [gameState, setGameState] = useState<RuneMatchState | null>(null)
  const [assets, setAssets] = useState<RuneMatchAssets | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Asset Loading
  useEffect(() => {
    let mounted = true
    const load = async () => {
      const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
          const img = new Image()
          img.src = withBasePath(src)
          img.onload = () => res(img)
          img.onerror = rej
        })

      try {
        const [goblin, skeleton, orc, dragon, base, heal, shield, background] = await Promise.all([
          loadImage('/games/rune-match/monsters/goblin_3x4_pose_sheet.png'),
          loadImage('/games/rune-match/monsters/skeleton_3x4_pose_sheet.png'),
          loadImage('/games/rune-match/monsters/orc_3x4_pose_sheet.png'),
          loadImage('/games/rune-match/monsters/dragon_3x4_pose_sheet.png'),
          loadImage('/games/rune-match/runes/rune_base_3x2_pose_sheet.png'),
          loadImage('/games/rune-match/runes/rune_heal_3x2_pose_sheet.png'),
          loadImage('/games/rune-match/runes/rune_shield_3x2_pose_sheet.png'),
          loadImage('/games/rune-match/ui/background-tiled.png'),
        ])
        if (mounted) {
          setAssets({
            monsters: { goblin, skeleton, orc, dragon },
            runes: { base, heal, shield },
            background,
          })
        }
      } catch (e) {
        console.error('Failed to load assets', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Initialize game state
  const resetGame = useCallback(() => {
    if (vocabulary.length > 0) {
      setGameState(createRuneMatchState(vocabulary))
    }
  }, [vocabulary])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  // Dimensions handling
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      if (width > 0 && height > 0) setDimensions({ width, height })
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height })
        }
      }
    })

    observer.observe(containerRef.current)
    const interval = setInterval(updateDimensions, 200)
    const timeout = setTimeout(() => clearInterval(interval), 2000)
    updateDimensions()

    return () => {
      observer.disconnect()
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // Show loading state
  if (!assets || !gameState || dimensions.width === 0) {
    return (
      <div
        ref={containerRef}
        data-testid="rune-match-container"
        className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="text-sm text-white/60">Loading assets...</p>
        </div>
      </div>
    )
  }

  // Render game
  return (
    <div
      ref={containerRef}
      data-testid="rune-match-container"
      className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 border border-white/10 md:aspect-video md:h-auto"
    >
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Background */}
          <Rect fill="#0f172a" width={dimensions.width} height={dimensions.height} />

          {/* Placeholder content */}
          <Text
            text="Monster Selection Screen - Coming Soon"
            x={dimensions.width / 2}
            y={dimensions.height / 2}
            offsetX={200}
            offsetY={15}
            fontSize={20}
            fill="#94a3b8"
            fontFamily="Arial"
          />
        </Layer>
      </Stage>
    </div>
  )
}
