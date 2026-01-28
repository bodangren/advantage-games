'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Stage, Layer, Rect, Circle, Group, Text, Image as KonvaImage } from 'react-konva'
import { useDirectionalInput, type InputVector } from '@/hooks/useDirectionalInput'
import { useInterval } from '@/hooks/useInterval'
import { DPad } from '@/components/ui/DPad'
import { BackgroundLayer } from '@/components/castle-defense/BackgroundLayer'
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation'
import { SpriteSheetConfig, SpriteState } from '@/lib/spriteAnimation'
import { withBasePath } from '@/lib/basePath'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TILE_SIZE,
  MAP_CONFIG,
  GAME_TICK_MS,
  createInitialState,
  advanceCastleDefenseTime,
  type CastleDefenseState,
  type Player,
  type Enemy,
} from '@/lib/castleDefenseV2'
import { CASTLE_DEFENSE_CONFIG } from '@/lib/castleDefenseConfig'
import type { VocabularyItem } from '@/store/useGameStore'

interface CastleDefenseGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: { xp: number; accuracy: number }) => void
}

const PLAYER_SPRITE_CONFIG: SpriteSheetConfig = {
  states: {
    idle: { row: 0, frames: 3, loop: true },
    walk: { row: 1, frames: 3, loop: true },
    attack: { row: 2, frames: 3, loop: true },
  },
  frameDuration: 150,
}

const ENEMY_SPRITE_CONFIG: SpriteSheetConfig = {
  states: {
    walk: { row: 0, frames: 3, loop: true },
    attack: { row: 1, frames: 1, loop: false, startCol: 0 },
    death: { row: 2, frames: 2, loop: false, startCol: 0 },
  },
  frameDuration: 150,
}

function PlayerSprite({
  player,
  input,
  gameTime,
  image,
}: {
  player: Player
  input: InputVector
  gameTime: number
  image?: HTMLImageElement
}) {
  const state: SpriteState = input.dx === 0 && input.dy === 0 ? 'idle' : 'walk'
  const frame = useSpriteAnimation(state, gameTime, PLAYER_SPRITE_CONFIG)

  if (!image || image.width === 0 || image.height === 0) {
    return (
      <Group x={player.x} y={player.y}>
        <Circle radius={player.radius} fill="#fbbf24" shadowColor="black" shadowBlur={10} shadowOpacity={0.3} />
        <Circle x={5} y={-5} radius={3} fill="black" />
        <Circle x={5} y={5} radius={3} fill="black" />
      </Group>
    )
  }

  const fw = image.width / 3
  const fh = image.height / 3

  return (
    <KonvaImage
      image={image}
      x={player.x}
      y={player.y}
      width={64}
      height={64}
      offsetX={32}
      offsetY={32}
      crop={{
        x: frame.col * fw,
        y: frame.row * fh,
        width: fw,
        height: fh,
      }}
      scaleX={input.dx < 0 ? -1 : 1}
    />
  )
}

function EnemySprite({
  enemy,
  gameTime,
  image,
}: {
  enemy: Enemy
  gameTime: number
  image?: HTMLImageElement
}) {
  const state: SpriteState = 'walk'
  const frame = useSpriteAnimation(state, gameTime, ENEMY_SPRITE_CONFIG)

  if (!image || image.width === 0 || image.height === 0) {
    const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[enemy.type]
    return (
      <Group x={enemy.x} y={enemy.y}>
        <Circle
          radius={enemy.radius}
          fill={stats.color}
          stroke={enemy.type === 'BOSS' ? '#fcd34d' : '#7f1d1d'}
          strokeWidth={enemy.type === 'BOSS' ? 4 : 2}
        />
        <Rect x={-15} y={-25} width={30} height={4} fill="#000" />
        <Rect x={-15} y={-25} width={(enemy.hp / enemy.maxHp) * 30} height={4} fill="#ef4444" />
      </Group>
    )
  }

  const fw = image.width / 3
  const fh = image.height / 3

  let size = 48
  if (enemy.type === 'TANK') size = 72
  if (enemy.type === 'BOSS') size = 96

  return (
    <Group x={enemy.x} y={enemy.y}>
      <KonvaImage
        image={image}
        width={size}
        height={size}
        offsetX={size / 2}
        offsetY={size / 2}
        crop={{
          x: frame.col * fw,
          y: frame.row * fh,
          width: fw,
          height: fh,
        }}
      />
      <Rect x={-15} y={-(size / 2) - 10} width={30} height={4} fill="#000" />
      <Rect
        x={-15}
        y={-(size / 2) - 10}
        width={(enemy.hp / enemy.maxHp) * 30}
        height={4}
        fill="#ef4444"
      />
    </Group>
  )
}

function CastleDefenseHUDV2({ state }: { state: CastleDefenseState }) {
  const { wave, targetTranslation, hearts, score, status, waveCooldownTimer, player } = state

  if (status === 'idle') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
      <div className="flex justify-between items-start">
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-amber-400 font-bold shadow-lg backdrop-blur-sm">
          SCORE: {score}
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-rose-500 font-bold shadow-lg backdrop-blur-sm">
          ❤️ {hearts}
        </div>
      </div>

      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <div className="bg-slate-900/90 border border-blue-500/50 rounded-xl p-3 text-center shadow-xl backdrop-blur-md">
          <div className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-1">
            Wave {wave} • Translate:
          </div>
          <div className="text-2xl font-bold text-white leading-none pb-1">
            {targetTranslation}
          </div>
        </div>
      </div>

      {status === 'cooldown' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-slate-900/90 border border-blue-500 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Next Wave In</div>
            <div className="text-5xl font-black text-white font-mono">
              {(waveCooldownTimer / 1000).toFixed(1)}s
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6 flex gap-2 items-end">
        {player.inventory.map((word, i) => (
          <div
            key={word.id}
            className="relative bg-slate-100 border-2 border-blue-500 rounded-lg w-12 h-10 flex items-center justify-center shadow-lg"
          >
            <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {i + 1}
            </div>
            <span className="text-[10px] font-bold text-slate-900 text-center leading-tight px-1 overflow-hidden">
              {word.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CastleDefenseGameV2({ vocabulary, onComplete }: CastleDefenseGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const [gameState, setGameState] = useState<CastleDefenseState>(() => createInitialState(vocabulary))
  const [gameImages, setGameImages] = useState<Record<string, HTMLImageElement>>({})

  const [shake, setShake] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; life: number }[]>([])
  const shakeIntensity = useRef(0)

  const { input, setVirtualInput, consumeCast } = useDirectionalInput()
  const { dx, dy, cast } = input

  useEffect(() => {
    setGameState(createInitialState(vocabulary))
  }, [vocabulary])

  const startGame = useCallback(() => {
    setGameState(prev => (prev ? { ...prev, status: 'playing' } : prev))
  }, [])

  const handleReset = useCallback(() => {
    setGameState(createInitialState(vocabulary))
  }, [vocabulary])

  useEffect(() => {
    if (gameState && (gameState.status === 'gameover' || gameState.status === 'victory')) {
      onComplete({ xp: gameState.score, accuracy: 100 })
    }
  }, [gameState, onComplete])

  useInterval(
    () => {
      if (gameState.status === 'playing' || gameState.status === 'cooldown') {
        const nextState = advanceCastleDefenseTime(
          gameState,
          GAME_TICK_MS,
          { dx, dy, drop: cast },
          vocabulary
        )
        setGameState(nextState)

        if (cast) {
          consumeCast()
        }

        if (shakeIntensity.current > 0) {
          shakeIntensity.current = Math.max(0, shakeIntensity.current - GAME_TICK_MS * 0.05)
          setShake({
            x: (Math.random() - 0.5) * shakeIntensity.current,
            y: (Math.random() - 0.5) * shakeIntensity.current,
          })
        } else {
          setShake({ x: 0, y: 0 })
        }

        setParticles(prev => prev.map(p => ({ ...p, life: p.life - GAME_TICK_MS * 0.002 })).filter(p => p.life > 0))
      }
    },
    gameState && (gameState.status === 'playing' || gameState.status === 'cooldown') ? GAME_TICK_MS : null
  )

  useEffect(() => {
    const assets = {
      base: withBasePath('/games/castle-defense/player-castle.png'),
      towerBase: withBasePath('/games/castle-defense/tower-base.png'),
      towerBuilt: withBasePath('/games/castle-defense/tower-built.png'),
      player: withBasePath('/games/castle-defense/player_3x3_pose_sheet.png'),
      goblin: withBasePath('/games/castle-defense/goblin_3x3_pose_sheet.png'),
      orc: withBasePath('/games/castle-defense/orc_3x3_pose_sheet.png'),
      troll: withBasePath('/games/castle-defense/troll_3x3_pose_sheet.png'),
    }
    const loaded: Record<string, HTMLImageElement> = {}
    let settled = 0
    const total = Object.keys(assets).length

    Object.entries(assets).forEach(([key, src]) => {
      const img = new window.Image()
      img.onload = () => {
        loaded[key] = img
        settled += 1
        if (settled === total) {
          setGameImages(loaded)
        }
      }
      img.onerror = () => {
        settled += 1
        if (settled === total) {
          setGameImages(loaded)
        }
      }
      img.src = src
    })
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => {
      const { clientWidth, clientHeight } = element
      setDimensions(prev =>
        prev.width === clientWidth && prev.height === clientHeight ? prev : { width: clientWidth, height: clientHeight }
      )
    }

    updateSize()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => updateSize())
      observer.observe(element)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const camera = useMemo(() => {
    if (!gameState || dimensions.width === 0 || dimensions.height === 0) {
      return { x: 0, y: 0, scale: 1 }
    }

    const fitScale = dimensions.width / GAME_WIDTH
    const minScale = 0.8
    const targetScale = Math.max(fitScale, minScale)

    let camX = (dimensions.width / 2) - (gameState.player.x * targetScale)
    let camY = (dimensions.height / 2) - (gameState.player.y * targetScale)

    const mapW = GAME_WIDTH * targetScale
    const mapH = GAME_HEIGHT * targetScale

    const minX = dimensions.width - mapW
    const minY = dimensions.height - mapH

    if (minX > 0) camX = (dimensions.width - mapW) / 2
    else camX = Math.max(minX, Math.min(0, camX))

    if (minY > 0) camY = (dimensions.height - mapH) / 2
    else camY = Math.max(minY, Math.min(0, camY))

    return { x: camX, y: camY, scale: targetScale }
  }, [dimensions, gameState])

  const stagePixelRatio = useMemo(() => {
    if (typeof window === 'undefined') return 1
    const dpr = window.devicePixelRatio || 1
    if (dimensions.width === 0 || dimensions.height === 0) return dpr
    const isMobileViewport = dimensions.width < GAME_WIDTH || dimensions.height < GAME_HEIGHT
    return isMobileViewport ? 1 : dpr
  }, [dimensions])

  const isStageReady = dimensions.width > 0 && dimensions.height > 0

  return (
    <>
      <div ref={containerRef} className="relative w-full h-[60vh] md:h-auto md:aspect-video max-w-[800px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        {isStageReady ? (
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            x={shake.x}
            y={shake.y}
            pixelRatio={stagePixelRatio}
          >
            <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
              <BackgroundLayer grassMap={gameState.grassMap} />

              {MAP_CONFIG.towerSlots.map((slot, index) => (
                gameImages.towerBase ? (
                  <KonvaImage
                    key={`slot-${index}`}
                    image={gameImages.towerBase}
                    x={slot.x}
                    y={slot.y}
                    width={TILE_SIZE}
                    height={TILE_SIZE}
                    offsetX={TILE_SIZE / 2}
                    offsetY={TILE_SIZE / 2}
                    opacity={0.8}
                  />
                ) : (
                  <Rect
                    key={`slot-${index}`}
                    x={slot.x - 20}
                    y={slot.y - 20}
                    width={40}
                    height={40}
                    fill="#475569"
                  />
                )
              ))}

              {gameState.towers.map((tower) => (
                <Group key={tower.id} x={tower.x} y={tower.y}>
                  {gameImages.towerBuilt ? (
                    <KonvaImage
                      image={gameImages.towerBuilt}
                      width={TILE_SIZE * 1.2}
                      height={TILE_SIZE * 1.2}
                      offsetX={(TILE_SIZE * 1.2) / 2}
                      offsetY={(TILE_SIZE * 1.2) / 2}
                    />
                  ) : (
                    <Rect x={-25} y={-25} width={50} height={50} fill="#1e293b" stroke="#3b82f6" strokeWidth={3} cornerRadius={4} />
                  )}
                  <Circle radius={tower.range} stroke="#3b82f6" strokeWidth={1} dash={[5, 5]} opacity={0.2} />
                </Group>
              ))}

              {gameState.projectiles.map((proj) => (
                <Circle key={proj.id} x={proj.x} y={proj.y} radius={proj.radius} fill="#fbbf24" shadowColor="#fbbf24" shadowBlur={5} />
              ))}

              {particles.map((p) => (
                <Circle key={p.id} x={p.x} y={p.y} radius={3} fill="#fbbf24" opacity={p.life} />
              ))}

              {gameState.enemies.map((enemy) => {
                let assetKey = 'goblin'
                if (enemy.type === 'TANK') assetKey = 'orc'
                if (enemy.type === 'BOSS') assetKey = 'troll'

                return (
                  <EnemySprite
                    key={enemy.id}
                    enemy={enemy}
                    gameTime={gameState.gameTime}
                    image={gameImages[assetKey]}
                  />
                )
              })}

              {gameImages.base ? (
                <KonvaImage
                  image={gameImages.base}
                  x={MAP_CONFIG.basePoint.x}
                  y={MAP_CONFIG.basePoint.y}
                  width={TILE_SIZE * 1.5}
                  height={TILE_SIZE * 1.5}
                  offsetX={(TILE_SIZE * 1.5) / 2}
                  offsetY={(TILE_SIZE * 1.5) / 2}
                />
              ) : (
                <Rect x={MAP_CONFIG.basePoint.x - 30} y={MAP_CONFIG.basePoint.y - 30} width={60} height={60} fill="#3b82f6" />
              )}

              <Text x={MAP_CONFIG.basePoint.x - 25} y={MAP_CONFIG.basePoint.y - 40} text="BASE" fill="white" fontStyle="bold" stroke="black" strokeWidth={3} fillAfterStrokeEnabled />
              <Text x={MAP_CONFIG.basePoint.x - 25} y={MAP_CONFIG.basePoint.y - 40} text="BASE" fill="white" fontStyle="bold" />

              <Circle x={MAP_CONFIG.spawnPoint.x} y={MAP_CONFIG.spawnPoint.y} radius={20} fill="#ef4444" opacity={0.5} />

              {gameState.words.filter(w => !w.isCollected).map(word => (
                <Group key={word.id} x={word.x} y={word.y}>
                  <Circle radius={word.radius} fill={word.isDistractor ? "#f87171" : "#f1f5f9"} stroke="#1e293b" strokeWidth={2} shadowColor="black" shadowOpacity={0.2} shadowBlur={5} />
                  <Text text={word.text} align="center" verticalAlign="middle" offsetX={word.radius} offsetY={word.radius} width={word.radius * 2} height={word.radius * 2} fontSize={11} fontStyle="bold" fill="#0f172a" />
                </Group>
              ))}

              <PlayerSprite player={gameState.player} input={input} gameTime={gameState.gameTime} image={gameImages.player} />
            </Layer>
          </Stage>
        ) : null}

        <CastleDefenseHUDV2 state={gameState} />

        {gameState.status !== 'idle' && (
          <div className="fixed bottom-6 right-6 z-50 opacity-80 hover:opacity-100 transition-opacity">
            <DPad onInput={setVirtualInput} />
          </div>
        )}
      </div>

      {gameState.status === 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 text-center overflow-y-auto">
          <div className="flex min-h-full w-full flex-col items-center justify-center py-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 md:text-5xl">
              Castle Defense
            </h1>
            <p className="text-base text-slate-400 mb-6 max-w-md md:text-xl">
              Collect words to build towers. Defend the base!
            </p>

            <div className="w-full max-w-sm bg-slate-900/50 rounded-xl border border-slate-700 p-4 mb-8 flex-1 max-h-[40vh] overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Sentence Preview
              </h3>
              <div className="space-y-2">
                {vocabulary.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-left border-b border-slate-800 pb-2 last:border-0">
                    <span className="text-sm font-medium text-white">{item.term}</span>
                    <span className="text-xs text-slate-400">{item.translation}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40 md:px-10 md:py-4 md:text-xl"
            >
              Start Defense
            </button>
          </div>
        </div>
      )}

      {gameState.status !== 'playing' && gameState.status !== 'cooldown' && gameState.status !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl md:p-12">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {gameState.status === 'gameover' ? 'Game Over' : 'Victory!'}
            </h2>
            <p className="text-lg text-slate-400 md:text-xl">
              Final Score: <span className="font-bold text-amber-400">{gameState.score}</span>
            </p>
            <button
              onClick={handleReset}
              className="mt-4 rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  )
}
