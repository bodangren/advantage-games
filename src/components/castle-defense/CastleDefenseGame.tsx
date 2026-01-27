'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Group, Text, Image as KonvaImage } from 'react-konva'
import { useCastleDefenseStore } from '@/store/useCastleDefenseStore'
import { GAME_WIDTH, GAME_HEIGHT, MAP_CONFIG, TILE_SIZE, type Enemy, type Player } from '@/lib/castleDefense'
import { CASTLE_DEFENSE_CONFIG } from '@/lib/castleDefenseConfig'
import { useDirectionalInput, type InputVector } from '@/hooks/useDirectionalInput'
import { type VocabularyItem } from '@/store/useGameStore'
import { DPad } from '@/components/ui/DPad'
import { BackgroundLayer } from './BackgroundLayer'
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation'
import { SpriteSheetConfig, SpriteState } from '@/lib/spriteAnimation'
import { withBasePath } from '@/lib/basePath'
import { CastleDefenseHUD } from './CastleDefenseHUD'

interface CastleDefenseGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: { xp: number; accuracy: number }) => void
}

const PLAYER_SPRITE_CONFIG: SpriteSheetConfig = {
  states: {
    idle: { row: 0, frames: 3, loop: true },
    walk: { row: 1, frames: 3, loop: true },
    attack: { row: 2, frames: 3, loop: true }
  },
  frameDuration: 150
}

const ENEMY_SPRITE_CONFIG: SpriteSheetConfig = {
  states: {
    walk: { row: 0, frames: 3, loop: true },
    attack: { row: 1, frames: 1, loop: false, startCol: 0 },
    death: { row: 2, frames: 2, loop: false, startCol: 0 }
  },
  frameDuration: 150
}

function PlayerSprite({ player, input, gameTime, image }: { 
  player: Player, 
  input: InputVector, 
  gameTime: number, 
  image?: HTMLImageElement 
}) {
  const state: SpriteState = input.dx === 0 && input.dy === 0 ? 'idle' : 'walk'
  const frame = useSpriteAnimation(state, gameTime, PLAYER_SPRITE_CONFIG)
  
  if (!image) {
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
        height: fh
      }}
      scaleX={input.dx < 0 ? -1 : 1}
    />
  )
}

function EnemySprite({ enemy, gameTime, image }: { 
  enemy: Enemy, 
  gameTime: number, 
  image?: HTMLImageElement 
}) {
  const state: SpriteState = 'walk' 
  const frame = useSpriteAnimation(state, gameTime, ENEMY_SPRITE_CONFIG)
  
  if (!image) {
     const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[enemy.type]
     return (
        <Group x={enemy.x} y={enemy.y}>
            <Circle 
              radius={enemy.radius} 
              fill={stats.color} 
              stroke={enemy.type === 'BOSS' ? '#fcd34d' : '#7f1d1d'} 
              strokeWidth={enemy.type === 'BOSS' ? 4 : 2}
            />
            <Rect 
              x={-15} 
              y={-25} 
              width={30} 
              height={4} 
              fill="#000" 
            />
            <Rect 
              x={-15} 
              y={-25} 
              width={(enemy.hp / enemy.maxHp) * 30} 
              height={4} 
              fill="#ef4444" 
            />
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
            height: fh
          }}
        />
        <Rect 
          x={-15} 
          y={-(size / 2) - 10} 
          width={30} 
          height={4} 
          fill="#000" 
        />
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

export function CastleDefenseGame({ vocabulary, onComplete }: CastleDefenseGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })

  // Asset Loading
  const [gameImages, setGameImages] = useState<Record<string, HTMLImageElement>>({})
  
  useEffect(() => {
    const assets = {
        base: withBasePath('/games/castle-defense/player-castle.png'),
        towerBase: withBasePath('/games/castle-defense/tower-base.png'),
        towerBuilt: withBasePath('/games/castle-defense/tower-built.png'),
        player: withBasePath('/games/castle-defense/player_3x3_pose_sheet.png'),
        goblin: withBasePath('/games/castle-defense/goblin_3x3_pose_sheet.png'),
        orc: withBasePath('/games/castle-defense/orc_3x3_pose_sheet.png'),
        troll: withBasePath('/games/castle-defense/troll_3x3_pose_sheet.png')
    }
    const loaded: Record<string, HTMLImageElement> = {}
    Object.entries(assets).forEach(([key, src]) => {
        const img = new window.Image()
        img.src = src
        img.onload = () => {
            loaded[key] = img
            if (Object.keys(loaded).length === Object.keys(assets).length) {
                setGameImages(loaded)
            }
        }
    })
  }, [])

  // Store
  const initialize = useCastleDefenseStore(state => state.initialize)
  const tick = useCastleDefenseStore(state => state.tick)
  const setPlayerInput = useCastleDefenseStore(state => state.setPlayerInput)
  const startGame = useCastleDefenseStore(state => state.startGame)
  
  // Game State for Rendering
  const player = useCastleDefenseStore(state => state.player)
  const status = useCastleDefenseStore(state => state.status)
  const words = useCastleDefenseStore(state => state.words)
  const towers = useCastleDefenseStore(state => state.towers)
  const enemies = useCastleDefenseStore(state => state.enemies)
  const projectiles = useCastleDefenseStore(state => state.projectiles)
  const score = useCastleDefenseStore(state => state.score)
  const grassMap = useCastleDefenseStore(state => state.grassMap)

  // Visual State
  const [shake, setShake] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{id: number, x: number, y: number, life: number}[]>([])
  const shakeIntensity = useRef(0)

  // Input
  const { input, setVirtualInput, consumeCast } = useDirectionalInput()
  const { dx, dy, cast } = input

  useEffect(() => {
    initialize(vocabulary)
  }, [initialize, vocabulary])

  const handleReset = () => {
    initialize(vocabulary)
  }

  useEffect(() => {
    setPlayerInput(dx, dy, cast)
    if (cast) {
        consumeCast()
    }
  }, [dx, dy, cast, setPlayerInput, consumeCast])

  useEffect(() => {
    if (status === 'gameover' || status === 'victory') {
      onComplete({ xp: score, accuracy: 100 })
    }
  }, [status, score, onComplete])

  // Game Loop
  useEffect(() => {
    let lastTime = performance.now()
    let animationFrameId: number

    const loop = (time: number) => {
      const dt = time - lastTime
      lastTime = time
      
      tick(dt)

      if (shakeIntensity.current > 0) {
          shakeIntensity.current = Math.max(0, shakeIntensity.current - dt * 0.05)
          setShake({
              x: (Math.random() - 0.5) * shakeIntensity.current,
              y: (Math.random() - 0.5) * shakeIntensity.current
          })
      } else {
          setShake({ x: 0, y: 0 })
      }

      setParticles(prev => prev.map(p => ({...p, life: p.life - dt * 0.002})).filter(p => p.life > 0))

      animationFrameId = requestAnimationFrame(loop)
    }

    if (status === 'playing' || status === 'cooldown') {
      animationFrameId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [status, tick])

  // Responsive Scaling & Camera
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const { clientWidth, clientHeight } = containerRef.current
      setDimensions({ width: clientWidth, height: clientHeight })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    let frameId: number
    const updateCamera = () => {
        if (dimensions.width === 0) return

        const fitScale = dimensions.width / GAME_WIDTH
        const minScale = 0.8 // Mobile zoom
        const targetScale = Math.max(fitScale, minScale)

        const player = useCastleDefenseStore.getState().player
        
        let camX = (dimensions.width / 2) - (player.x * targetScale)
        let camY = (dimensions.height / 2) - (player.y * targetScale)

        const mapW = GAME_WIDTH * targetScale
        const mapH = GAME_HEIGHT * targetScale
        
        const minX = dimensions.width - mapW
        const minY = dimensions.height - mapH
        
        if (minX > 0) camX = (dimensions.width - mapW) / 2
        else camX = Math.max(minX, Math.min(0, camX))

        if (minY > 0) camY = (dimensions.height - mapH) / 2
        else camY = Math.max(minY, Math.min(0, camY))

        setCamera({ x: camX, y: camY, scale: targetScale })
        frameId = requestAnimationFrame(updateCamera)
    }

    if (status === 'playing' || status === 'cooldown') {
        frameId = requestAnimationFrame(updateCamera)
    }

    return () => cancelAnimationFrame(frameId)
  }, [dimensions, status])


  return (
    <>
      <div ref={containerRef} className="relative w-full h-[60vh] md:h-auto md:aspect-video max-w-[800px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <Stage 
          width={dimensions.width} 
          height={dimensions.height} 
          x={shake.x}
          y={shake.y}
        >
          <BackgroundLayer grassMap={grassMap} />
          
          <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
            {/* Map: Tower Slots */}
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

            {/* Towers */}
            {towers.map((tower) => (
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

            {/* Projectiles */}
            {projectiles.map((proj) => (
              <Circle key={proj.id} x={proj.x} y={proj.y} radius={proj.radius} fill="#fbbf24" shadowColor="#fbbf24" shadowBlur={5} />
            ))}

            {/* Particles */}
            {particles.map((p) => (
              <Circle 
                  key={p.id} 
                  x={p.x} 
                  y={p.y} 
                  radius={3} 
                  fill="#fbbf24" 
                  opacity={p.life} 
              />
            ))}

            {/* Enemies */}
            {enemies.map((enemy) => {
               let assetKey = 'goblin'
               if (enemy.type === 'TANK') assetKey = 'orc'
               if (enemy.type === 'BOSS') assetKey = 'troll'
               
               return (
                  <EnemySprite 
                      key={enemy.id} 
                      enemy={enemy} 
                      gameTime={useCastleDefenseStore.getState().gameTime}
                      image={gameImages[assetKey]}
                  />
               )
            })}

            {/* Map: Base */}
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

            {/* Map: Spawn */}
            <Circle x={MAP_CONFIG.spawnPoint.x} y={MAP_CONFIG.spawnPoint.y} radius={20} fill="#ef4444" opacity={0.5} />

            {/* Words on Field */}
            {words.filter(w => !w.isCollected).map(word => (
              <Group key={word.id} x={word.x} y={word.y}>
                <Circle radius={word.radius} fill={word.isDistractor ? "#f87171" : "#f1f5f9"} stroke="#1e293b" strokeWidth={2} shadowColor="black" shadowOpacity={0.2} shadowBlur={5} />
                <Text text={word.text} align="center" verticalAlign="middle" offsetX={word.radius} offsetY={word.radius} width={word.radius * 2} height={word.radius * 2} fontSize={11} fontStyle="bold" fill="#0f172a" />
              </Group>
            ))}

            {/* Player */}
            <PlayerSprite 
              player={player} 
              input={input} 
              gameTime={useCastleDefenseStore.getState().gameTime}
              image={gameImages.player}
            />
          </Layer>
        </Stage>

        {/* HUD Overlay */}
        <CastleDefenseHUD />

        {/* Mobile Controls */}
        {status !== 'idle' && (
          <div className="fixed bottom-6 right-6 z-50 opacity-80 hover:opacity-100 transition-opacity">
            <DPad onInput={setVirtualInput} />
          </div>
        )}
      </div>

      {/* Start Screen */}
      {status === 'idle' && (
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
                onClick={() => startGame()}
                className="rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40 md:px-10 md:py-4 md:text-xl"
              >
                Start Defense
              </button>
            </div>
        </div>
      )}

      {/* Game Over / Victory */}
      {status !== 'playing' && status !== 'cooldown' && status !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl md:p-12">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {status === 'gameover' ? 'Game Over' : 'Victory!'}
            </h2>
            <p className="text-lg text-slate-400 md:text-xl">
              Final Score: <span className="font-bold text-amber-400">{score}</span>
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