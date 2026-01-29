'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Group } from 'react-konva'
import { motion, AnimatePresence } from 'framer-motion'

// Import shared components (REUSE from Wizard)
import { VirtualDPad } from '@/components/ui/VirtualDPad'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { useInterval } from '@/hooks/useInterval'
import { withBasePath } from '@/lib/basePath'

// Import game logic
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TILE_SIZE,
  GAME_TICK_MS,
  ANIMATION_FRAME_MS,
  createCastleDefenseState,
  advanceCastleDefenseTime,
  CastleDefenseState,
  WORD_RADIUS,
  inRange,
} from '@/lib/castleDefense'
import { BackgroundLayer } from './BackgroundLayer'
import type { VocabularyItem } from '@/store/useGameStore'

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
  towerBase: HTMLImageElement
  towerBuilt: HTMLImageElement
  base: HTMLImageElement
}

type Props = {
  vocabulary: VocabularyItem[]
  onComplete?: (results: { xp: number; accuracy: number }) => void
}

export function CastleDefenseGame({ vocabulary, onComplete }: Props) {
  // ============================================
  // STATE
  // ============================================
  const [gameState, setGameState] = useState<CastleDefenseState | null>(null)
  const [assets, setAssets] = useState<GameAssets | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })
  const [hasStarted, setHasStarted] = useState(false)
  const [buildEffects, setBuildEffects] = useState<
    { id: string; x: number; y: number; createdAt: number }[]
  >([])

  // Animation frames
  const [playerFrame, setPlayerFrame] = useState(0)
  const [enemyFrame, setEnemyFrame] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const previousTowerIds = useRef<string[]>([])

  // Input
  const { input, setVirtualInput, consumeCast } = useDirectionalInput()

  // ============================================
  // ASSET LOADING
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
        const [player, soldier, tank, boss, towerBase, towerBuilt, base] = await Promise.all([
          loadImage('/games/castle-defense/player_3x3_pose_sheet.png'),
          loadImage('/games/castle-defense/goblin_3x3_pose_sheet.png'),
          loadImage('/games/castle-defense/orc_3x3_pose_sheet.png'),
          loadImage('/games/castle-defense/troll_3x3_pose_sheet.png'),
          loadImage('/games/castle-defense/tower-base.png'),
          loadImage('/games/castle-defense/tower-built.png'),
          loadImage('/games/castle-defense/player-castle.png'),
        ])
        if (mounted) {
          setAssets({ player, soldier, tank, boss, towerBase, towerBuilt, base })
        }
      } catch (e) {
        console.error('Failed to load assets', e)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!gameState) return
    const currentIds = gameState.towers.map(tower => tower.id)
    const newTowers = gameState.towers.filter(tower => !previousTowerIds.current.includes(tower.id))

    if (newTowers.length > 0) {
      const now = Date.now()
      setBuildEffects(prev => [
        ...prev,
        ...newTowers.map(tower => ({
          id: `${tower.id}-${now}`,
          x: tower.x,
          y: tower.y,
          createdAt: now,
        })),
      ])
    }

    previousTowerIds.current = currentIds
  }, [gameState?.towers])

  // ============================================
  // RESPONSIVE CONTAINER
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
  }, [hasStarted]) // Re-run when game starts and container becomes available

  // ============================================
  // GAME INITIALIZATION
  // ============================================
  const startGame = useCallback(() => {
    setGameState(createCastleDefenseState(vocabulary))
    setHasStarted(true)
  }, [vocabulary])

  // ============================================
  // GAME LOOP
  // ============================================
  useInterval(() => {
    if (gameState && gameState.status === 'playing' && assets && hasStarted) {
      const nextState = advanceCastleDefenseTime(
        gameState, 
        GAME_TICK_MS, 
        { dx: input.dx, dy: input.dy, drop: input.cast }, 
        vocabulary
      )
      setGameState(nextState)

      if (input.cast) {
        consumeCast()
      }

      // Update camera
      if (dimensions.width > 0 && dimensions.height > 0) {
        const scaleX = dimensions.width / GAME_WIDTH
        const scaleY = dimensions.height / GAME_HEIGHT
        const scale = Math.max(scaleX, scaleY, 0.8)

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
      if (nextState.status === 'gameover' && onComplete) {
        onComplete({ xp: nextState.score, accuracy: 100 })
      }
    }
  }, gameState?.status === 'playing' && hasStarted ? GAME_TICK_MS : null)

  // Animation Loop
  useInterval(() => {
    if (hasStarted) {
      setPlayerFrame(f => (f + 1) % 3)
      setEnemyFrame(f => (f + 1) % 3)
    }
  }, ANIMATION_FRAME_MS)

  useInterval(() => {
    setBuildEffects(prev =>
      prev.filter(effect => Date.now() - effect.createdAt < 600)
    )
  }, buildEffects.length > 0 ? 100 : null)

  // Memoize sprite grids
  const grids = useMemo(() => {
    if (!assets) return null
    return {
      player: buildSpriteGrid(assets.player.width, assets.player.height),
      soldier: buildSpriteGrid(assets.soldier.width, assets.soldier.height),
      tank: buildSpriteGrid(assets.tank.width, assets.tank.height),
      boss: buildSpriteGrid(assets.boss.width, assets.boss.height),
    }
  }, [assets])

  const activeBuildSlot = useMemo(() => {
    if (!gameState || !gameState.sentenceCompleted) return null
    return gameState.towerSlots.find(slot => {
      const hasTower = gameState.towers.some(tower => tower.id === `tower-${slot.id}`)
      if (hasTower) return false
      return inRange(gameState.player.x, gameState.player.y, slot.x, slot.y, 50)
    })
  }, [gameState])

  // ============================================
  // RENDER HELPERS
  // ============================================
  if (!assets) {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <div className="text-white animate-pulse font-mono tracking-widest uppercase">
          Loading Defense...
        </div>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950" />
        <div className="relative text-center space-y-8 p-8">
          <div className="space-y-2">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-black text-white uppercase tracking-tighter md:text-7xl"
            >
              Castle <span className="text-amber-500">Defense</span>
            </motion.h2>
            <p className="text-blue-300 font-medium tracking-widest uppercase text-xs">Protect the heart of the kingdom</p>
          </div>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05, backgroundColor: '#f59e0b' }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-amber-600 text-white font-black rounded-2xl shadow-2xl shadow-amber-900/40 uppercase tracking-widest text-xl transition-colors"
          >
            Start Mission
          </motion.button>
        </div>
      </div>
    )
  }

  if (gameState?.status === 'gameover') {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center space-y-6 p-8 bg-slate-900/80 border border-red-500/30 rounded-[2.5rem] shadow-2xl backdrop-blur-md"
        >
          <div className="space-y-1">
            <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter">Defeated</h2>
            <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">The castle has fallen</p>
          </div>
          <div className="py-4">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-black block mb-1">Final Score</span>
            <span className="text-5xl font-black text-white">{gameState.score}</span>
          </div>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-white text-slate-950 font-black rounded-xl shadow-lg uppercase tracking-widest"
          >
            Retry Mission
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (gameState?.status === 'victory') {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto">
        <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center space-y-6 p-8 bg-slate-900/80 border border-emerald-500/30 rounded-[2.5rem] shadow-2xl backdrop-blur-md"
        >
          <div className="space-y-1">
            <h2 className="text-5xl font-black text-emerald-400 uppercase tracking-tighter">Victory!</h2>
            <p className="text-emerald-200 text-sm uppercase tracking-widest font-bold">The castle stands strong</p>
          </div>
          <div className="py-4">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-black block mb-1">Final Score</span>
            <span className="text-5xl font-black text-white">{gameState.score}</span>
          </div>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-white text-slate-950 font-black rounded-xl shadow-lg uppercase tracking-widest"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 touch-none md:aspect-video md:h-auto select-none"
    >
      {gameState && dimensions.width > 0 && dimensions.height > 0 && (
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}>
            <BackgroundLayer grassMap={gameState.grassMap} path={gameState.path} />

            {/* Tower slots */}
            {gameState.towerSlots.map(slot => (
              <Group key={slot.id}>
                {gameState.sentenceCompleted && !gameState.towers.some(tower => tower.id === `tower-${slot.id}`) && (
                  <Circle
                    x={slot.x}
                    y={slot.y}
                    radius={TILE_SIZE * 0.6}
                    stroke={activeBuildSlot?.id === slot.id ? '#22c55e' : 'rgba(250, 204, 21, 0.9)'}
                    strokeWidth={activeBuildSlot?.id === slot.id ? 4 : 2}
                    dash={activeBuildSlot?.id === slot.id ? [6, 4] : [4, 6]}
                  />
                )}
                <KonvaImage
                  image={assets.towerBase}
                  x={slot.x}
                  y={slot.y}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  offsetX={TILE_SIZE / 2}
                  offsetY={TILE_SIZE / 2}
                  opacity={gameState.towers.some(tower => tower.id === `tower-${slot.id}`) ? 0.3 : 0.8}
                />
              </Group>
            ))}

            {/* Active towers */}
            {gameState.towers.map(tower => (
              <Group key={tower.id}>
                <Circle
                  x={tower.x}
                  y={tower.y}
                  radius={tower.range}
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth={1}
                  dash={[10, 5]}
                />
                <KonvaImage
                  image={assets.towerBuilt}
                  x={tower.x}
                  y={tower.y}
                  width={TILE_SIZE * 1.2}
                  height={TILE_SIZE * 1.2}
                  offsetX={(TILE_SIZE * 1.2) / 2}
                  offsetY={(TILE_SIZE * 1.2) / 2}
                />
              </Group>
            ))}

            {/* Tower build effects */}
            {buildEffects.map(effect => {
              const age = Date.now() - effect.createdAt
              const progress = Math.min(age / 600, 1)
              const radius = TILE_SIZE * (0.6 + progress * 0.8)
              const opacity = 1 - progress
              return (
                <Circle
                  key={effect.id}
                  x={effect.x}
                  y={effect.y}
                  radius={radius}
                  stroke={`rgba(34, 197, 94, ${opacity})`}
                  strokeWidth={3}
                />
              )
            })}

            {/* Base (Castle) */}
            <KonvaImage
              image={assets.base}
              x={gameState.base.x}
              y={gameState.base.y}
              width={TILE_SIZE * 1.5}
              height={TILE_SIZE * 1.5}
              offsetX={(TILE_SIZE * 1.5) / 2}
              offsetY={(TILE_SIZE * 1.5) / 2}
            />

            {/* Projectiles */}
            {gameState.projectiles.map(proj => (
              <Circle
                key={proj.id}
                x={proj.x}
                y={proj.y}
                radius={proj.radius}
                fill="#fbbf24"
              />
            ))}

            {/* Enemies */}
            {gameState.enemies.map(enemy => {
              const enemyImage = enemy.type === 'boss' ? assets.boss
                : enemy.type === 'tank' ? assets.tank
                : assets.soldier
              const size = enemy.type === 'boss' ? 72
                : enemy.type === 'tank' ? 56
                : 40
              
              const grid = enemy.type === 'boss' ? grids?.boss
                : enemy.type === 'tank' ? grids?.tank
                : grids?.soldier

              return (
                <Group key={enemy.id}>
                  {grid && (
                    <KonvaImage
                      image={enemyImage}
                      x={enemy.x}
                      y={enemy.y}
                      width={size}
                      height={size}
                      offsetX={size / 2}
                      offsetY={size / 2}
                      crop={getSpriteCrop(grid.fw, grid.fh, enemyFrame, 1)}
                    />
                  )}
                  {/* HP bar background */}
                  <Rect
                    x={enemy.x - 15}
                    y={enemy.y - size / 2 - 10}
                    width={30}
                    height={4}
                    fill="#333"
                    cornerRadius={2}
                  />
                  {/* HP bar fill */}
                  <Rect
                    x={enemy.x - 15}
                    y={enemy.y - size / 2 - 10}
                    width={30 * (enemy.hp / enemy.maxHp)}
                    height={4}
                    fill={enemy.hp > enemy.maxHp * 0.5 ? '#22c55e' : '#ef4444'}
                    cornerRadius={2}
                  />
                </Group>
              )
            })}

            {/* Words */}
            {gameState.words.filter(w => !w.isCollected).map(word => (
              <Group key={word.term + word.x} x={word.x} y={word.y}>
                <Circle
                  radius={WORD_RADIUS}
                  fill="white"
                  stroke="#111"
                  strokeWidth={2}
                />
                <Text
                  text={word.translation}
                  fontSize={11}
                  fontStyle="bold"
                  fill="black"
                  offsetX={word.radius}
                  offsetY={word.radius}
                  width={word.radius * 2}
                  height={word.radius * 2}
                  align="center"
                  verticalAlign="middle"
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
                scaleX={input.dx < 0 ? -1 : 1}
              />
            )}
          </Layer>
        </Stage>
      )}

      {gameState?.currentSentenceThai && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[90vw]">
          <div className="bg-blue-900/90 border border-blue-400/40 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="text-white text-base font-black text-center md:text-xl">
              {gameState.currentSentenceThai}
            </div>
          </div>
        </div>
      )}

      {gameState && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 max-w-[90vw]">
          <div className="bg-slate-950/70 border border-white/10 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Progress</span>
            <div className="text-sm font-semibold text-white md:text-base">
              {gameState.sentenceWords.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  className={gameState.collectedWordIndices.includes(idx) ? 'text-emerald-300' : 'text-slate-400'}
                >
                  {gameState.collectedWordIndices.includes(idx) ? word : '___'}{' '}
                </span>
              ))}
            </div>
          </div>
          {gameState.sentenceCompleted && (
            <div className="bg-emerald-600/90 border border-emerald-300/60 px-4 py-1 rounded-full shadow-lg text-white text-[11px] font-black uppercase tracking-widest md:text-xs">
              Sentence Complete - Build Tower!
            </div>
          )}
          <div className="bg-slate-950/70 border border-white/10 px-3 py-1 rounded-full shadow-lg text-white text-[11px] font-bold uppercase tracking-widest md:text-xs">
            Wave {gameState.wave}/6 - Enemies: {gameState.enemiesKilledThisWave}/{gameState.totalEnemiesThisWave}
          </div>
        </div>
      )}

      {/* HUD - TOP */}
      <div className="absolute top-32 left-4 z-30 pointer-events-none md:top-4">
        <div className="bg-slate-900/90 border border-slate-700/50 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block leading-none mb-1">Score</span>
          <span className="text-xl font-black text-white leading-none">{gameState?.score || 0}</span>
        </div>
      </div>

      <div className="absolute top-32 right-4 z-30 pointer-events-none md:top-4">
        <div className="bg-slate-900/90 border border-slate-700/50 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md text-right">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block leading-none mb-1">Castle HP</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-rose-500 leading-none">{gameState?.base.hp || 0}</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-rose-500 transition-all duration-300" 
                style={{ width: `${(gameState?.base.hp || 0) / (gameState?.base.maxHp || 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {activeBuildSlot && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-emerald-600/90 border border-emerald-300/60 px-5 py-2 rounded-full shadow-lg text-white font-black uppercase tracking-widest text-xs">
            Build Tower
          </div>
        </div>
      )}

      {gameState?.waveMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-amber-500/90 border border-amber-200/60 px-6 py-2 rounded-full shadow-xl text-white font-black uppercase tracking-widest text-xs">
            {gameState.waveMessage}
          </div>
        </div>
      )}

      {/* D-Pad */}
      <div className="absolute bottom-8 right-8 z-20">
        <VirtualDPad onInput={setVirtualInput} />
      </div>
    </div>
  )
}
