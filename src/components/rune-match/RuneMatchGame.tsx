'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva'
import { AnimatePresence, motion } from 'framer-motion'
import { createRuneMatchState, initializeGrid, swapRunes, findMatches, processMatches, applyMatchResult, type RuneMatchState, type GridPosition } from '@/lib/runeMatch'
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
  const [animFrame, setAnimFrame] = useState(0)

  // Layout constants
  const layout = useMemo(() => {
    const padding = 20
    const monsterAreaHeight = dimensions.height * 0.4
    const gridAreaHeight = dimensions.height * 0.5
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

  // Animation loop for runes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimFrame((f) => (f + 1) % 3) // Cycle top row (0, 1, 2)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Game loop for attack timers
  useEffect(() => {
    const tickRate = 100 // 10 ticks per second
    const interval = setInterval(() => {
      setGameState((current) => {
        if (!current || current.status !== 'playing') return current
        return advanceTime(current, tickRate)
      })
    }, tickRate)
    return () => clearInterval(interval)
  }, [])

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
        // Perform Swap
        const gridAfterSwap = swapRunes(prev.grid, selected, { row, col })
        const matches = findMatches(gridAfterSwap)

        if (matches.length > 0) {
          // Valid swap - process matches and cascades
          const result = processMatches(gridAfterSwap, prev.vocabulary, { rng: prev.rng })
          
          // Apply combat results
          const stateAfterCombat = applyMatchResult({ ...prev, grid: gridAfterSwap }, result)
          
          return { 
            ...stateAfterCombat, 
            selectedCell: null 
          }
        } else {
          // Invalid swap - show temporary swap then revert
          // We update the grid to show the swap, then set a timeout to revert it
          // Note: In a production app, we'd use a more robust animation system (framer-motion or similar)
          setTimeout(() => {
            setGameState(current => {
              if (!current || current.status !== 'playing') return current
              // Only revert if the grid hasn't changed in the meantime (safety)
              if (current.grid === gridAfterSwap) {
                return { ...current, grid: prev.grid }
              }
              return current
            })
          }, 400)

          return { 
            ...prev, 
            grid: gridAfterSwap,
            selectedCell: null 
          }
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

  const renderHealthBar = (
    x: number,
    y: number,
    width: number,
    current: number,
    max: number,
    color: string,
    label: string
  ) => {
    const height = 20
    const progress = Math.max(0, Math.min(1, current / max))
    return (
      <Group x={x} y={y}>
        {/* Background */}
        <Rect
          width={width}
          height={height}
          fill="rgba(0, 0, 0, 0.5)"
          cornerRadius={height / 2}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
        {/* Fill */}
        <Rect
          width={Math.max(height, width * progress)}
          height={height}
          fill={color}
          cornerRadius={height / 2}
        />
        {/* Text */}
        <Text
          text={`${label}: ${Math.ceil(current)}/${max}`}
          width={width}
          height={height}
          fontSize={12}
          fill="white"
          align="center"
          verticalAlign="middle"
          fontStyle="bold"
          fontFamily="Arial"
        />
      </Group>
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
          <KonvaImage 
            image={assets.background}
            width={dimensions.width}
            height={dimensions.height}
          />

          {/* Playing State HUD & Grid */}
          {gameState.status === 'playing' && (
            <Group>
              {/* HUD Area */}
              <Rect 
                x={0} 
                y={0} 
                width={dimensions.width} 
                height={layout.monsterAreaHeight} 
                fill="rgba(0, 0, 0, 0.2)"
              />
              
              {/* Monster HP */}
              {gameState.monster && (
                <Group>
                  {renderHealthBar(
                    dimensions.width / 2 - 150,
                    layout.monsterAreaHeight * 0.2,
                    300,
                    gameState.monster.hp,
                    gameState.monster.maxHp,
                    "#ef4444",
                    gameState.monster.type.toUpperCase()
                  )}
                  {/* Attack Timer Bar */}
                  <Rect
                    x={dimensions.width / 2 - 150}
                    y={layout.monsterAreaHeight * 0.2 + 25}
                    width={300 * (1 - gameState.attackTimer / RUNE_MATCH_CONFIG.combat.attackIntervalMs)}
                    height={4}
                    fill="#f87171"
                    opacity={0.6}
                  />
                </Group>
              )}

              {/* Player HP */}
              {renderHealthBar(
                dimensions.width / 2 - 150,
                layout.monsterAreaHeight * 0.7,
                300,
                gameState.player.hp,
                gameState.player.maxHp,
                "#22c55e",
                "PLAYER"
              )}

              {/* Shield Indicator */}
              {gameState.player.hasShield && (
                <Text
                  text="🛡️ SHIELD ACTIVE"
                  x={dimensions.width / 2 + 160}
                  y={layout.monsterAreaHeight * 0.7}
                  fontSize={14}
                  fill="#60a5fa"
                  fontStyle="bold"
                />
              )}

              {/* Grid Background */}
              <Rect
                x={layout.gridX - 8}
                y={layout.gridY - 8}
                width={layout.gridWidth + 16}
                height={layout.gridHeight + 16}
                fill="rgba(0, 0, 0, 0.4)"
                cornerRadius={12}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={2}
              />

              {/* Runes */}
              {gameState.grid.map((row, r) => 
                row.map((rune, c) => {
                  const isSelected = gameState.selectedCell?.row === r && gameState.selectedCell?.col === c
                  const runeSize = layout.cellSize - 4
                  
                  const spriteSheet = 
                    rune.type === 'vocabulary' ? assets.runes.base :
                    rune.type === 'heal' ? assets.runes.heal :
                    assets.runes.shield
                  
                  const fw = spriteSheet.width / 3
                  const fh = spriteSheet.height / 2
                  const crop = {
                    x: animFrame * fw,
                    y: 0,
                    width: fw,
                    height: fh
                  }

                  return (
                    <Group 
                      key={rune.id} 
                      x={layout.gridX + c * layout.cellSize + 2} 
                      y={layout.gridY + r * layout.cellSize + 2}
                      onClick={() => handleCellClick(r, c)}
                      onTap={() => handleCellClick(r, c)}
                    >
                      {/* Selection Glow */}
                      {isSelected && (
                        <Rect
                          width={runeSize + 8}
                          height={runeSize + 8}
                          x={-4}
                          y={-4}
                          fill="rgba(96, 165, 250, 0.3)"
                          cornerRadius={8}
                          stroke="#60a5fa"
                          strokeWidth={2}
                        />
                      )}

                      {/* Rune Asset */}
                      <KonvaImage
                        image={spriteSheet}
                        width={runeSize}
                        height={runeSize}
                        cornerRadius={6}
                        crop={crop}
                      />
                      
                      {rune.type === 'vocabulary' && (
                        <Text
                          text={(rune as any).text || (rune as any).translation}
                          width={runeSize - 12}
                          height={runeSize - 12}
                          x={6}
                          y={6}
                          fontSize={Math.max(12, layout.cellSize / 3.5)}
                          fill="#0f172a" // Black/Dark text for better contrast on light blue rune
                          align="center"
                          verticalAlign="middle"
                          fontFamily="Arial"
                          fontStyle="bold"
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
