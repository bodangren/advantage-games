'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Group, Text, Line as React_Line } from 'react-konva'
import { useCastleDefenseStore } from '@/store/useCastleDefenseStore'
import { GAME_WIDTH, GAME_HEIGHT, MAP_CONFIG } from '@/lib/castleDefense'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { type VocabularyItem } from '@/store/useGameStore'
import { DPad } from '@/components/ui/DPad'

interface CastleDefenseGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: { xp: number; accuracy: number }) => void
}

export function CastleDefenseGame({ vocabulary, onComplete }: CastleDefenseGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT })
  const [scale, setScale] = useState(1)

  // Store
  const initialize = useCastleDefenseStore(state => state.initialize)
  const tick = useCastleDefenseStore(state => state.tick)
  const setPlayerInput = useCastleDefenseStore(state => state.setPlayerInput)
  
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

  // Input
  const { input, setVirtualInput } = useDirectionalInput()
  const { dx, dy } = input

  // Init
  useEffect(() => {
    initialize(vocabulary)
  }, [initialize, vocabulary])

  // Input Sync
  useEffect(() => {
    setPlayerInput(dx, dy)
  }, [dx, dy, setPlayerInput])

  // Game Loop
  useEffect(() => {
    let lastTime = performance.now()
    let animationFrameId: number

    const loop = (time: number) => {
      const dt = time - lastTime
      lastTime = time
      
      tick(dt)
      animationFrameId = requestAnimationFrame(loop)
    }

    if (status === 'playing') {
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

  const handleReset = () => {
    initialize(vocabulary)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[800px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
      <Stage width={dimensions.width} height={dimensions.height} scaleX={scale} scaleY={scale}>
        <Layer>
          {/* Background */}
          <Rect 
            width={GAME_WIDTH} 
            height={GAME_HEIGHT} 
            fill="#1e293b" 
          />
          
          {/* Map: Road */}
          {MAP_CONFIG.path.map((point, index) => {
            if (index === 0) return null
            const prev = MAP_CONFIG.path[index - 1]
            return (
              <React_Line 
                key={`road-${index}`}
                points={[prev.x, prev.y, point.x, point.y]}
                stroke="#334155" 
                strokeWidth={40}
                lineCap="round"
                lineJoin="round"
              />
            )
          })}

          {/* Map: Tower Slots */}
          {MAP_CONFIG.towerSlots.map((slot, index) => (
            <Rect
              key={`slot-${index}`}
              x={slot.x - 20}
              y={slot.y - 20}
              width={40}
              height={40}
              fill="#475569" 
              stroke="#64748b"
              strokeWidth={2}
            />
          ))}

          {/* Towers */}
          {towers.map((tower) => (
            <Group key={tower.id} x={tower.x} y={tower.y}>
              <Rect x={-25} y={-25} width={50} height={50} fill="#1e293b" stroke="#3b82f6" strokeWidth={3} cornerRadius={4} />
              <Circle radius={15} fill="#3b82f6" stroke="#93c5fd" strokeWidth={2} />
              <Circle radius={tower.range} stroke="#3b82f6" strokeWidth={1} dash={[5, 5]} opacity={0.2} />
            </Group>
          ))}

          {/* Projectiles */}
          {projectiles.map((proj) => (
            <Circle key={proj.id} x={proj.x} y={proj.y} radius={proj.radius} fill="#fbbf24" shadowColor="#fbbf24" shadowBlur={5} />
          ))}

          {/* Enemies */}
          {enemies.map((enemy) => (
            <Group key={enemy.id} x={enemy.x} y={enemy.y}>
              <Circle radius={enemy.radius} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2} />
              <Rect x={-15} y={-25} width={30} height={4} fill="#7f1d1d" />
              <Rect x={-15} y={-25} width={(enemy.hp / enemy.maxHp) * 30} height={4} fill="#ef4444" />
            </Group>
          ))}

          {/* Map: Base */}
          <Rect x={MAP_CONFIG.basePoint.x - 30} y={MAP_CONFIG.basePoint.y - 30} width={60} height={60} fill="#3b82f6" />
          <Text x={MAP_CONFIG.basePoint.x - 25} y={MAP_CONFIG.basePoint.y - 10} text="BASE" fill="white" fontStyle="bold" />

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
            <Rect width={400} height={60} fill="#0f172a" opacity={0.8} cornerRadius={12} offsetX={200} offsetY={30} stroke="#3b82f6" strokeWidth={2} />
            <Text text="Translate to English:" fontSize={12} fill="#93c5fd" align="center" width={400} offsetX={200} offsetY={20} />
            <Text text={targetTranslation} fontSize={24} fontStyle="bold" fill="white" align="center" verticalAlign="middle" width={380} height={60} offsetX={190} offsetY={30} />
            <Group x={210} y={-10}>
              <Text text={`❤️ ${hearts}`} fontSize={20} fill="#f43f5e" fontStyle="bold" />
            </Group>
            <Group x={-270} y={-10}>
              <Text text={`SCORE: ${score}`} fontSize={20} fill="#fbbf24" fontStyle="bold" />
            </Group>
          </Group>

          {/* Inventory / Queue */}
          <Group x={GAME_WIDTH / 2} y={90}>
            {player.inventory.map((word, i) => {
              const totalWidth = player.inventory.length * 50
              const startX = -totalWidth / 2
              return (
                <Group key={word.id} x={startX + i * 50 + 25} y={0}>
                  <Rect width={46} height={36} fill="#f1f5f9" cornerRadius={6} stroke="#3b82f6" strokeWidth={2} offsetX={23} offsetY={18} />
                  <Text text={word.text} fontSize={10} fontStyle="bold" align="center" verticalAlign="middle" width={46} height={36} offsetX={23} offsetY={18} fill="#0f172a" />
                </Group>
              )
            })}
          </Group>

          {/* Player */}
          <Group x={player.x} y={player.y}>
            <Circle radius={player.radius} fill="#fbbf24" shadowColor="black" shadowBlur={10} shadowOpacity={0.3} />
            <Circle x={5} y={-5} radius={3} fill="black" />
            <Circle x={5} y={5} radius={3} fill="black" />
          </Group>
        </Layer>
      </Stage>

      {/* Mobile Controls */}
      <div className="absolute bottom-6 right-6 z-10 opacity-80 hover:opacity-100 transition-opacity">
        <DPad onInput={setVirtualInput} />
      </div>

      {/* Overlays */}
      {status !== 'playing' && (
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