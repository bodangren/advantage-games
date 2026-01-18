'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Group, Text, Image as KonvaImage } from 'react-konva'
import { useCastleDefenseStore } from '@/store/useCastleDefenseStore'
import { GAME_WIDTH, GAME_HEIGHT, MAP_CONFIG, TILE_SIZE } from '@/lib/castleDefense'
import { CASTLE_DEFENSE_CONFIG } from '@/lib/castleDefenseConfig'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { type VocabularyItem } from '@/store/useGameStore'
import { DPad } from '@/components/ui/DPad'
import { BackgroundLayer } from './BackgroundLayer'
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation'
import { SpriteSheetConfig, SpriteState } from '@/lib/spriteAnimation'

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

function PlayerSprite({ player, input, gameTime, image }: { 
  player: any, 
  input: any, 
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

export function CastleDefenseGame({ vocabulary, onComplete }: CastleDefenseGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT })
  const [scale, setScale] = useState(1)

  // Asset Loading
  const [gameImages, setGameImages] = useState<Record<string, HTMLImageElement>>({})
  
  useEffect(() => {
    const assets = {
        base: '/games/castle-defense/player-castle.png',
        towerBase: '/games/castle-defense/tower-base.png',
        towerBuilt: '/games/castle-defense/tower-built.png',
        player: '/games/castle-defense/player_3x3_pose_sheet.png'
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
  const reset = useCastleDefenseStore(state => state.reset)
  const startGame = useCastleDefenseStore(state => state.startGame)
  
  // Game State for Rendering
  const player = useCastleDefenseStore(state => state.player)
  const status = useCastleDefenseStore(state => state.status)
  const words = useCastleDefenseStore(state => state.words)
  const towers = useCastleDefenseStore(state => state.towers)
  const enemies = useCastleDefenseStore(state => state.enemies)
  const projectiles = useCastleDefenseStore(state => state.projectiles)
  const hearts = useCastleDefenseStore(state => state.hearts)
  const score = useCastleDefenseStore(state => state.score)
  const targetTranslation = useCastleDefenseStore(state => state.targetTranslation)
  const lastEvent = useCastleDefenseStore(state => state.lastEvent)
  const wave = useCastleDefenseStore(state => state.wave)
  const waveCooldownTimer = useCastleDefenseStore(state => state.waveCooldownTimer)
  const grassMap = useCastleDefenseStore(state => state.grassMap)

  // Visual State
  const [shake, setShake] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{id: number, x: number, y: number, life: number}[]>([])
  const shakeIntensity = useRef(0)

  // Input
  const { input, setVirtualInput, consumeCast } = useDirectionalInput()
  const { dx, dy, cast } = input

  // Init
  useEffect(() => {
    initialize(vocabulary)
  }, [initialize, vocabulary])

  // Handle Reset
  const handleReset = () => {
    initialize(vocabulary)
  }

  // Event Listener
  // ...

  // Input Sync
  useEffect(() => {
    setPlayerInput(dx, dy, cast)
    if (cast) {
        consumeCast()
    }
  }, [dx, dy, cast, setPlayerInput, consumeCast])

  // XP Integration & Game Over Handling
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

      // VFX Logic
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

    // Always run loop unless unmounted, but tick handles pause logic
    if (status === 'playing' || status === 'cooldown') {
      animationFrameId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [status, tick])

  // Responsive Scaling
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const newScale = Math.min(containerWidth / GAME_WIDTH, 1)
      setDimensions({
        width: GAME_WIDTH * newScale,
        height: GAME_HEIGHT * newScale
      })
      setScale(newScale)
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-[800px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        scaleX={scale} 
        scaleY={scale}
        x={shake.x}
        y={shake.y}
      >
        <BackgroundLayer grassMap={grassMap} />
        
        <Layer>
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
              {/* Range Indicator */}
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
             const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[enemy.type]
             return (
                <Group key={enemy.id} x={enemy.x} y={enemy.y}>
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

          {/* HUD Layer */}
          <Group x={GAME_WIDTH / 2} y={40}>
             {/* Background Panel */}
             <Rect 
               width={400} 
               height={80} 
               fill="#0f172a" 
               opacity={0.8} 
               cornerRadius={12} 
               offsetX={200} 
               offsetY={40}
               stroke="#3b82f6"
               strokeWidth={2}
             />
             
             {/* Wave Info */}
             <Text 
                text={`WAVE ${wave}`}
                fontSize={16}
                fill="#fbbf24"
                fontStyle="bold"
                align="center"
                width={400}
                offsetX={200}
                offsetY={35}
             />

             <Text 
                text="Translate to English:"
                fontSize={12}
                fill="#93c5fd"
                align="center"
                width={400}
                offsetX={200}
                offsetY={15}
             />
             <Text 
                text={targetTranslation} 
                fontSize={24} 
                fontStyle="bold"
                fill="white" 
                align="center"
                verticalAlign="middle" 
                width={380} 
                height={60}
                offsetX={190} 
                offsetY={-5}
             />

             {/* Hearts */}
             <Group x={210} y={-20}>
                <Text text={`❤️ ${hearts}`} fontSize={20} fill="#f43f5e" fontStyle="bold" />
             </Group>

             {/* Score */}
             <Group x={-270} y={-20}>
                <Text text={`SCORE: ${score}`} fontSize={20} fill="#fbbf24" fontStyle="bold" />
             </Group>
          </Group>
          
          {/* Wave Cooldown Overlay */}
          {status === 'cooldown' && (
             <Group x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2}>
                 <Rect width={300} height={100} fill="rgba(0,0,0,0.7)" cornerRadius={20} offsetX={150} offsetY={50} />
                 <Text 
                    text={`Next Wave in ${(waveCooldownTimer / 1000).toFixed(1)}s`} 
                    fontSize={24} 
                    fill="white" 
                    align="center" 
                    width={300} 
                    offsetX={150} 
                    offsetY={12}
                 />
             </Group>
          )}

          {/* Inventory / Queue */}
          <Group x={GAME_WIDTH / 2} y={110}>
            {player.inventory.map((word, i) => {
              const totalWidth = player.inventory.length * 50
              const startX = -totalWidth / 2
              return (
                <Group key={word.id} x={startX + i * 50 + 25} y={0}>
                  <Rect width={46} height={36} fill="#f1f5f9" cornerRadius={6} stroke="#3b82f6" strokeWidth={2} offsetX={23} offsetY={18} />
                  <Circle x={-18} y={-14} radius={6} fill="#3b82f6" />
                  <Text x={-20} y={-17} text={`${i + 1}`} fontSize={8} fill="white" width={10} align="center" />
                  <Text text={word.text} fontSize={10} fontStyle="bold" align="center" verticalAlign="middle" width={46} height={36} offsetX={23} offsetY={18} fill="#0f172a" />
                </Group>
              )
            })}
          </Group>

          {/* Player */}
          <PlayerSprite 
            player={player} 
            input={input} 
            gameTime={useCastleDefenseStore.getState().gameTime}
            image={gameImages.player}
          />
        </Layer>
      </Stage>

      {/* Mobile Controls */}
      {status !== 'idle' && (
        <div className="fixed bottom-6 right-6 z-50 opacity-80 hover:opacity-100 transition-opacity">
          <DPad onInput={setVirtualInput} />
        </div>
      )}

      {/* Start Screen */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm p-8 text-center overflow-hidden">
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
              Castle Defense
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-md">
              Collect words to build towers. Defend the base from the enemy horde!
            </p>

            <div className="w-full max-w-md bg-slate-900/50 rounded-xl border border-slate-700 p-6 mb-8 flex-1 overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Sentence Preview
                </h3>
                <div className="space-y-3">
                    {vocabulary.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-left border-b border-slate-800 pb-2 last:border-0">
                            <span className="font-medium text-white">{item.term}</span>
                            <span className="text-sm text-slate-400">{item.translation}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
              onClick={() => startGame()}
              className="rounded-full bg-blue-600 px-10 py-4 text-xl font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
            >
              Start Defense
            </button>
        </div>
      )}

      {/* Overlays */}
      {status !== 'playing' && status !== 'cooldown' && status !== 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center shadow-2xl">
            <h2 className="text-5xl font-bold tracking-tight text-white">
              {status === 'gameover' ? 'Game Over' : 'Victory!'}
            </h2>
            <p className="text-xl text-slate-400">
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
    </div>
  )
}
