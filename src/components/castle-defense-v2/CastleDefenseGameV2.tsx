'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Group } from 'react-konva'
import { motion } from 'framer-motion'

// Import shared components (REUSE from Wizard)
import { VirtualDPad } from '@/components/ui/VirtualDPad'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { useInterval } from '@/hooks/useInterval'
import { withBasePath } from '@/lib/basePath'

// Import game logic
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_TICK_MS,
  ANIMATION_FRAME_MS,
  createInitialState,
  advanceCastleDefenseTime,
  CastleDefenseState,
  InputState,
} from '@/lib/castleDefenseV2'

// Types
type GameAssets = {
  player: HTMLImageElement
  soldier: HTMLImageElement
  tank: HTMLImageElement
  boss: HTMLImageElement
  tower: HTMLImageElement
  floor: HTMLImageElement
}

type Props = {
  vocabulary: { term: string; translation: string }[]
  onGameOver?: (score: number) => void
}

export function CastleDefenseGameV2({ vocabulary, onGameOver }: Props) {
  // ============================================
  // STATE (same pattern as Wizard)
  // ============================================
  const [gameState, setGameState] = useState<CastleDefenseState | null>(null)
  const [assets, setAssets] = useState<GameAssets | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })
  const [hasStarted, setHasStarted] = useState(false)

  // Animation frames
  const [playerFrame, setPlayerFrame] = useState(0)
  const [enemyFrame, setEnemyFrame] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)

  // Input (REUSE from Wizard)
  const { input, setVirtualInput } = useDirectionalInput()

  // ============================================
  // ASSET LOADING (same pattern as Wizard)
  // ============================================
  useEffect(() => {
    let mounted = true

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const img = new Image()
        img.src = withBasePath(src)
        img.onload = () => res(img)
        img.onerror = rej
      })

    const load = async () => {
      try {
        // PARALLEL loading with Promise.all
        const [player, soldier, tank, boss, tower, floor] = await Promise.all([
          loadImage('/games/wizard-vs-zombie/player_3x3_pose_sheet.png'), // Reuse Wizard sprite
          loadImage('/games/castle-defense/goblin.png'),
          loadImage('/games/castle-defense/orc.png'),
          loadImage('/games/castle-defense/troll.png'),
          loadImage('/games/castle-defense/tower.png'),
          loadImage('/games/wizard-vs-zombie/tile-ruins.png'), // Reuse Wizard floor
        ])
        if (mounted) {
          setAssets({ player, soldier, tank, boss, tower, floor })
        }
      } catch (e) {
        console.error('Failed to load assets', e)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  // ============================================
  // RESPONSIVE CONTAINER (same pattern as Wizard)
  // ============================================
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // ============================================
  // GAME INITIALIZATION
  // ============================================
  const startGame = useCallback(() => {
    setGameState(createInitialState(vocabulary))
    setHasStarted(true)
  }, [vocabulary])

  // ============================================
  // GAME LOOP (same pattern as Wizard - useInterval, not RAF)
  // ============================================
  useInterval(() => {
    if (gameState && gameState.status === 'playing' && assets && hasStarted) {
      // Advance game state
      const nextState = advanceCastleDefenseTime(gameState, GAME_TICK_MS, input, vocabulary)
      setGameState(nextState)

      // Update camera (INSIDE game loop, not useMemo)
      if (dimensions.width > 0 && dimensions.height > 0) {
        const scaleY = dimensions.height / GAME_HEIGHT
        const scale = Math.max(scaleY, 0.8)

        let camX = (dimensions.width / 2) - (nextState.player.x * scale)
        let camY = (dimensions.height / 2) - (nextState.player.y * scale)

        const minX = dimensions.width - (GAME_WIDTH * scale)
        const minY = dimensions.height - (GAME_HEIGHT * scale)

        if (minX > 0) camX = (dimensions.width - GAME_WIDTH * scale) / 2
        else camX = Math.max(minX, Math.min(0, camX))

        if (minY > 0) camY = (dimensions.height - GAME_HEIGHT * scale) / 2
        else camY = Math.max(minY, Math.min(0, camY))

        setCamera({ x: camX, y: camY, scale })
      }

      // Check for game over
      if (nextState.status === 'gameover' && onGameOver) {
        onGameOver(nextState.score)
      }
    }
  }, gameState?.status === 'playing' && hasStarted ? GAME_TICK_MS : null)

  // ============================================
  // ANIMATION LOOP (separate from game loop)
  // ============================================
  useInterval(() => {
    if (hasStarted) {
      setPlayerFrame(f => (f + 1) % 3)
      setEnemyFrame(f => (f + 1) % 3)
    }
  }, ANIMATION_FRAME_MS)

  // ============================================
  // LOADING STATE
  // ============================================
  if (!assets) {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <div className="text-white animate-pulse font-mono tracking-widest uppercase">
          Loading Castle Defense...
        </div>
      </div>
    )
  }

  // ============================================
  // START SCREEN
  // ============================================
  if (!hasStarted) {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg"
        >
          Start Game
        </motion.button>
      </div>
    )
  }

  // ============================================
  // GAME OVER SCREEN
  // ============================================
  if (gameState?.status === 'gameover') {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 p-8"
        >
          <h2 className="text-4xl font-bold text-red-500">Game Over</h2>
          <p className="text-2xl text-white">Score: {gameState.score}</p>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // ============================================
  // MAIN GAME RENDER (placeholder - will be implemented in Phase 5)
  // ============================================
  return (
    <div
      ref={containerRef}
      className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 touch-none md:aspect-video md:h-auto"
    >
      {/* Stage will be added in Phase 5 */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        Game canvas coming in Phase 5...
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div>Score: {gameState?.score || 0}</div>
        <div>Base HP: {gameState?.base.hp || 0}</div>
        <div>Inventory: {gameState?.player.inventory.join(', ') || 'empty'}</div>
      </div>

      {/* D-Pad (REUSE from Wizard) */}
      <div className="absolute bottom-8 right-8 z-20">
        <VirtualDPad onInput={setVirtualInput} />
      </div>
    </div>
  )
}
