'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva'
import { AnimatePresence, motion } from 'framer-motion'
import { createRuneMatchState, initializeGrid, swapRunes, type RuneMatchState, type GridPosition } from '@/lib/runeMatch'
import { RUNE_MATCH_CONFIG, type MonsterType } from '@/lib/runeMatchConfig'
import type { VocabularyItem } from '@/store/useGameStore'
import { withBasePath } from '@/lib/basePath'
import { MonsterSelection } from './MonsterSelection'

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

  // Layout constants
  const layout = useMemo(() => {
    const padding = 20
    const monsterAreaHeight = dimensions.height * 0.3
    const gridAreaHeight = dimensions.height * 0.6
    const _hudAreaHeight = dimensions.height * 0.1

    const availableGridWidth = dimensions.width - padding * 2
    const availableGridHeight = gridAreaHeight - padding

    const cellSize = Math.min(
      availableGridWidth / RUNE_MATCH_CONFIG.grid.columns,
      availableGridHeight / RUNE_MATCH_CONFIG.grid.rows
    )

    const gridWidth = cellSize * RUNE_MATCH_CONFIG.grid.columns
    const gridHeight = cellSize * RUNE_MATCH_CONFIG.grid.rows

    const gridX = (dimensions.width - gridWidth) / 2
    const gridY = monsterAreaHeight + (gridAreaHeight - gridHeight) / 2

    return {
      cellSize,
      gridX,
      gridY,
      gridWidth,
      gridHeight,
      monsterAreaHeight,
    }
  }, [dimensions])

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

  const handleSelectMonster = useCallback((monsterType: MonsterType) => {
    const config = RUNE_MATCH_CONFIG.monsters[monsterType]
    setGameState((prev) => {
      if (!prev) return null
      
      const grid = initializeGrid(prev.vocabulary, { rng: prev.rng })

      return {
        ...prev,
        status: 'playing',
        selectedMonster: monsterType,
        monster: {
          type: monsterType,
          hp: config.hp,
          maxHp: config.hp,
          attack: config.attack,
          xp: config.xp,
        },
        grid,
      }
    })
  }, [])

  const handleCellClick = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (!prev || prev.status !== 'playing') return prev

      const selected = prev.selectedCell
      if (!selected) {
        return { ...prev, selectedCell: { row, col } }
      }

      // Check if adjacent
      const isAdjacent = 
        (Math.abs(selected.row - row) === 1 && selected.col === col) ||
        (Math.abs(selected.col - col) === 1 && selected.row === row)

      if (isAdjacent) {
        // Swap
        const newGrid = swapRunes(prev.grid, selected, { row, col })
        return { 
          ...prev, 
          grid: newGrid, 
          selectedCell: null 
        }
      } else {
        // Change selection
        return { ...prev, selectedCell: { row, col } }
      }
    })
  }, [])

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
      <AnimatePresence mode="wait">
        {gameState.status === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          >
            <MonsterSelection onSelect={handleSelectMonster} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Background */}
          <Rect fill="#0f172a" width={dimensions.width} height={dimensions.height} />

          {/* Playing State HUD & Grid */}
          {gameState.status === 'playing' && (
            <Group>
              {/* Monster Area Placeholder */}
              <Rect 
                x={0} 
                y={0} 
                width={dimensions.width} 
                height={layout.monsterAreaHeight} 
                fill="rgba(255, 255, 255, 0.05)"
              />
              <Text
                text={`Opponent: ${gameState.monster?.type?.toUpperCase()}`}
                x={dimensions.width / 2}
                y={layout.monsterAreaHeight / 2}
                offsetX={100}
                fontSize={20}
                fill="#f87171"
                fontStyle="bold"
              />

              {/* Grid Background */}
              <Rect
                x={layout.gridX - 4}
                y={layout.gridY - 4}
                width={layout.gridWidth + 8}
                height={layout.gridHeight + 8}
                fill="rgba(0, 0, 0, 0.3)"
                cornerRadius={8}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={2}
              />

              {/* Runes */}
              {gameState.grid.map((row, r) => 
                row.map((rune, c) => {
                  const isSelected = gameState.selectedCell?.row === r && gameState.selectedCell?.col === c
                  return (
                    <Group 
                      key={rune.id} 
                      x={layout.gridX + c * layout.cellSize} 
                      y={layout.gridY + r * layout.cellSize}
                      onClick={() => handleCellClick(r, c)}
                      onTap={() => handleCellClick(r, c)}
                    >
                      <Rect
                        width={layout.cellSize - 4}
                        height={layout.cellSize - 4}
                        x={2}
                        y={2}
                        fill={isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"}
                        stroke={isSelected ? "#60a5fa" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth={isSelected ? 2 : 1}
                        cornerRadius={4}
                      />
                      {rune.type === 'vocabulary' ? (
                        <Text
                          text={rune.translation}
                          width={layout.cellSize - 8}
                          height={layout.cellSize - 8}
                          x={4}
                          y={4}
                          fontSize={Math.max(10, layout.cellSize / 5)}
                          fill="white"
                          align="center"
                          verticalAlign="middle"
                        />
                      ) : (
                        <Text
                          text={rune.type === 'heal' ? "❤️" : "🛡️"}
                          width={layout.cellSize - 8}
                          height={layout.cellSize - 8}
                          x={4}
                          y={4}
                          fontSize={layout.cellSize / 2}
                          align="center"
                          verticalAlign="middle"
                        />
                      )}
                    </Group>
                  )
                })
              )}
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  )
}
