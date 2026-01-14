'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Group, Text } from 'react-konva'
import { useCastleDefenseStore } from '@/store/useCastleDefenseStore'
import { GAME_WIDTH, GAME_HEIGHT, MAP_CONFIG } from '@/lib/castleDefense'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { type VocabularyItem } from '@/store/useGameStore'

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

  // Input
  const { input } = useDirectionalInput()
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

  return (
    <div ref={containerRef} className="w-full max-w-[800px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
      <Stage width={dimensions.width} height={dimensions.height} scaleX={scale} scaleY={scale}>
        <Layer>
          {/* Background */}
          <Rect 
            width={GAME_WIDTH} 
            height={GAME_HEIGHT} 
            fill="#1e293b" // slate-800
          />
          
          {/* Map: Road */}
          {/* Visualizing path with simple lines/rects for now */}
          {MAP_CONFIG.path.map((point, index) => {
            if (index === 0) return null
            const prev = MAP_CONFIG.path[index - 1]
            return (
              <React_Line 
                key={`road-${index}`}
                points={[prev.x, prev.y, point.x, point.y]}
                stroke="#334155" // slate-700
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
              fill="#475569" // slate-600
              stroke="#64748b"
              strokeWidth={2}
            />
          ))}

          {/* Map: Base */}
          <Rect
            x={MAP_CONFIG.basePoint.x - 30}
            y={MAP_CONFIG.basePoint.y - 30}
            width={60}
            height={60}
            fill="#3b82f6" // blue-500
          />
          <Text 
            x={MAP_CONFIG.basePoint.x - 25} 
            y={MAP_CONFIG.basePoint.y - 10} 
            text="BASE" 
            fill="white" 
            fontStyle="bold"
          />

          {/* Map: Spawn */}
          <Circle
            x={MAP_CONFIG.spawnPoint.x}
            y={MAP_CONFIG.spawnPoint.y}
            radius={20}
            fill="#ef4444" // red-500
            opacity={0.5}
          />

          {/* Entities: Player */}
          <Group x={player.x} y={player.y}>
            <Circle 
              radius={player.radius} 
              fill="#fbbf24" // amber-400
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.3}
            />
            {/* Direction Indicator (Eyes) */}
            <Circle x={5} y={-5} radius={3} fill="black" />
            <Circle x={5} y={5} radius={3} fill="black" />
          </Group>

          {/* DEBUG TEXT */}
          <Text text="WASD to Move" x={10} y={10} fill="white" />

        </Layer>
      </Stage>
    </div>
  )
}

// Helper for Line since I can't import Konva Line easily in React-Konva sometimes without explicit import
// But React-Konva exports 'Line' so I should use that.
import { Line as React_Line } from 'react-konva'
