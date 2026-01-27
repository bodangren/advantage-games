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

// Sprite sheet helpers (same as Wizard)
const buildSpriteGrid = (width: number, height: number) => {
  const fw = width / 3
  const fh = height / 3
  return { fw, fh }
}

const getSpriteCrop = (fw: number, fh: number, col: number, row: number) => ({
  x: col * fw,
  y: row * fh,
  width: fw,
  height: fh
})

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

  // Memoize sprite grids
  const grids = useMemo(() => {
    if (!assets) return null
    return {
      player: buildSpriteGrid(assets.player.width, assets.player.height),
    }
  }, [assets])

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
  // MAIN GAME RENDER
  // ============================================
  if (!gameState) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 touch-none md:aspect-video md:h-auto"
    >
      {/* KONVA STAGE */}
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}>
          {/* Floor background */}
          <Rect
            x={0}
            y={0}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            fillPatternImage={assets.floor}
            fillPatternRepeat="repeat"
            fillPatternScaleX={0.5}
            fillPatternScaleY={0.5}
          />

          {/* Base */}
          <Circle
            x={gameState.base.x}
            y={gameState.base.y}
            radius={gameState.base.radius}
            fill="#8B4513"
            stroke="#654321"
            strokeWidth={3}
          />
          <Text
            x={gameState.base.x - 25}
            y={gameState.base.y - 8}
            text="BASE"
            fontSize={16}
            fontStyle="bold"
            fill="white"
          />

          {/* Tower slots */}
          {gameState.towerSlots.map(slot => (
            <Circle
              key={slot.id}
              x={slot.x}
              y={slot.y}
              radius={slot.radius}
              fill="rgba(100, 100, 100, 0.5)"
              stroke="#666"
              strokeWidth={2}
              dash={[5, 5]}
            />
          ))}

          {/* Active towers */}
          {gameState.towers.map(tower => (
            <Group key={tower.id}>
              <Circle
                x={tower.x}
                y={tower.y}
                radius={tower.range}
                stroke="rgba(255, 200, 0, 0.3)"
                strokeWidth={1}
                dash={[10, 5]}
              />
              <KonvaImage
                image={assets.tower}
                x={tower.x}
                y={tower.y}
                width={50}
                height={50}
                offsetX={25}
                offsetY={25}
              />
            </Group>
          ))}

          {/* Projectiles */}
          {gameState.projectiles.map(proj => (
            <Circle
              key={proj.id}
              x={proj.x}
              y={proj.y}
              radius={proj.radius}
              fill="yellow"
              shadowColor="orange"
              shadowBlur={10}
            />
          ))}

          {/* Enemies */}
          {gameState.enemies.map(enemy => {
            const enemyImage = enemy.type === 'boss' ? assets.boss
              : enemy.type === 'tank' ? assets.tank
              : assets.soldier
            const size = enemy.type === 'boss' ? 60
              : enemy.type === 'tank' ? 48
              : 36

            return (
              <Group key={enemy.id}>
                <KonvaImage
                  image={enemyImage}
                  x={enemy.x}
                  y={enemy.y}
                  width={size}
                  height={size}
                  offsetX={size / 2}
                  offsetY={size / 2}
                />
                {/* HP bar background */}
                <Rect
                  x={enemy.x - 20}
                  y={enemy.y - size / 2 - 10}
                  width={40}
                  height={6}
                  fill="#333"
                  cornerRadius={2}
                />
                {/* HP bar fill */}
                <Rect
                  x={enemy.x - 20}
                  y={enemy.y - size / 2 - 10}
                  width={40 * (enemy.hp / enemy.maxHp)}
                  height={6}
                  fill={enemy.hp > enemy.maxHp * 0.5 ? '#22c55e' : '#ef4444'}
                  cornerRadius={2}
                />
              </Group>
            )
          })}

          {/* Words */}
          {gameState.words.filter(w => !w.isCollected).map(word => (
            <Group key={word.id}>
              <Circle
                x={word.x}
                y={word.y}
                radius={word.radius}
                fill={word.isCorrect ? '#22c55e' : '#ef4444'}
                stroke="white"
                strokeWidth={2}
                shadowColor={word.isCorrect ? 'green' : 'red'}
                shadowBlur={10}
              />
              <Text
                x={word.x}
                y={word.y}
                text={word.translation}
                fontSize={12}
                fontStyle="bold"
                fill="white"
                offsetX={word.translation.length * 3}
                offsetY={6}
              />
            </Group>
          ))}

          {/* Player */}
          {grids && (
            <KonvaImage
              image={assets.player}
              x={gameState.player.x}
              y={gameState.player.y}
              width={64}
              height={64}
              offsetX={32}
              offsetY={32}
              crop={getSpriteCrop(
                grids.player.fw,
                grids.player.fh,
                playerFrame,
                input.dx === 0 && input.dy === 0 ? 0 : 1
              )}
            />
          )}
        </Layer>
      </Stage>

      {/* HUD - Top left - lower z-index to not block gameplay */}
      <div className="absolute top-4 left-4 z-[5] space-y-2 pointer-events-none">
        <div className="bg-black/60 px-3 py-1 rounded text-white text-sm">
          Score: {gameState?.score || 0}
        </div>
        <div className="bg-black/60 px-3 py-1 rounded text-white text-sm">
          Base HP: {gameState?.base.hp || 0} / {gameState?.base.maxHp || 100}
        </div>
        <div className="bg-black/60 px-3 py-1 rounded text-white text-sm">
          Wave: {gameState?.wave || 1}
        </div>
      </div>

      {/* Target word - Top center - lower z-index */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
        <div className="bg-amber-600/90 px-4 py-2 rounded-lg text-white font-bold text-lg">
          Find: {gameState?.targetWord || ''}
        </div>
      </div>

      {/* Inventory - Top right - lower z-index */}
      <div className="absolute top-4 right-4 z-[5] pointer-events-none">
        <div className="bg-black/60 px-3 py-2 rounded text-white text-sm">
          <div className="font-bold mb-1">Inventory:</div>
          {gameState?.player.inventory.length ? (
            gameState.player.inventory.map((word, i) => (
              <div key={i} className="text-amber-300">{word}</div>
            ))
          ) : (
            <div className="text-gray-400">Empty</div>
          )}
        </div>
      </div>

      {/* D-Pad (REUSE from Wizard) */}
      <div className="absolute bottom-8 right-8 z-20">
        <VirtualDPad onInput={setVirtualInput} />
      </div>
    </div>
  )
}
