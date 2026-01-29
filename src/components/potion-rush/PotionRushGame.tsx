'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { usePotionRushStore } from '@/store/usePotionRushStore'
import { VocabularyItem } from '@/store/useGameStore'
import { withBasePath } from '@/lib/basePath'
import { useGameLoop } from '@/hooks/useGameLoop'
import { AnimatePresence } from 'framer-motion'

// Components
import ConveyorBelt from './ConveyorBelt'
import CauldronStation from './CauldronStation'
import CustomerQueue from './CustomerQueue'
import TrashPortal from './TrashPortal'
import PotionRushEffectsLayer from './PotionRushEffectsLayer'
import PotionRushSoundController from './PotionRushSoundController'
import PotionRushStartScreen from './PotionRushStartScreen'

interface PotionRushGameProps {
  vocabList: VocabularyItem[]
}

export default function PotionRushGame({ vocabList }: PotionRushGameProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Image Loading State
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})

  useEffect(() => {
    const assets = {
      wall: withBasePath('/games/potion-rush/shop-wall.png'),
      floor: withBasePath('/games/potion-rush/shop-floor.png'),
      counter: withBasePath('/games/potion-rush/shop-counter.png')
    }
    
    const loadedImgs: Record<string, HTMLImageElement> = {}
    let count = 0
    const sources = Object.entries(assets)

    sources.forEach(([key, src]) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        loadedImgs[key] = img
        count++
        if (count === sources.length) {
          setImages(loadedImgs)
        }
      }
      img.onerror = () => {
        console.error(`Failed to load: ${src}`)
        count++
        if (count === sources.length) {
          setImages(loadedImgs)
        }
      }
    })
  }, [])

  // Store Actions
  const startGame = usePotionRushStore(state => state.startGame)
  const tick = usePotionRushStore(state => state.tick)
  const spawnCustomer = usePotionRushStore(state => state.spawnCustomer)
  const spawnIngredient = usePotionRushStore(state => state.spawnIngredient)
  const gameState = usePotionRushStore(state => state.gameState)
  const reset = usePotionRushStore(state => state.reset)
  const score = usePotionRushStore(state => state.score)
  const reputation = usePotionRushStore(state => state.reputation)
  const spawnRate = usePotionRushStore(state => state.spawnRate)

  // Layout Constants
  const isPortrait = dimensions.height > dimensions.width
  const VIRTUAL_WIDTH = isPortrait ? 720 : 1280
  const VIRTUAL_HEIGHT = isPortrait ? 1280 : 720
  
  // Calculate Scale to fit (Contain)
  const scaleX = dimensions.width / VIRTUAL_WIDTH
  const scaleY = dimensions.height / VIRTUAL_HEIGHT
  const scale = Math.min(scaleX, scaleY)
  
  // Center the Stage
  const stageX = (dimensions.width - VIRTUAL_WIDTH * scale) / 2
  const stageY = (dimensions.height - VIRTUAL_HEIGHT * scale) / 2

  const LAYOUT = isPortrait ? {
      wallH: 640,
      floorH: 640,
      counterY: 250,
      customerY: 252,
      cauldronY: 450, 
      beltY: 1150,
      trashX: 360, // Center
      trashY: 800, // Between Cauldrons and Belt
      isPortrait: true
  } : {
      wallH: 480,
      floorH: 240,
      counterY: 480 - 80, // 400
      customerY: 402, // 2px below counter top
      cauldronY: 540,
      beltY: 620,
      trashX: 1230,
      trashY: 540,
      isPortrait: false
  }

  // Initialization & Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Game Loop (fixed timestep to match other Konva games)
  const isRunning = gameState === 'PLAYING' && dimensions.width > 0 && dimensions.height > 0
  useGameLoop((dt) => tick(dt), isRunning, 50)

  // Spawners (Intervals)
  useEffect(() => {
      if (gameState !== 'PLAYING') return

      // Initial Spawn immediately
      spawnCustomer(vocabList)
      spawnIngredient(vocabList, dimensions.width)

      const customerInterval = setInterval(() => {
          spawnCustomer(vocabList)
      }, 4000) // Every 4 seconds try to spawn customer

      const ingredientInterval = setInterval(() => {
          spawnIngredient(vocabList, dimensions.width)
      }, spawnRate) 

      return () => {
          clearInterval(customerInterval)
          clearInterval(ingredientInterval)
      }
  }, [gameState, spawnCustomer, spawnIngredient, vocabList, dimensions.width, spawnRate])

  // Initial Start
  useEffect(() => {
      // startGame() // Don't start automatically anymore
      return () => reset()
  }, [reset]) // Removed startGame from here

  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full" />

  return (
    <div ref={containerRef} className="w-full h-full relative font-sans">
      <PotionRushSoundController />
      
      <AnimatePresence>
        {!hasStarted && (
          <PotionRushStartScreen 
            vocabulary={vocabList} 
            onStart={() => {
              setHasStarted(true)
              startGame()
            }} 
          />
        )}
      </AnimatePresence>

      {/* HUD Overlay (HTML is easier for text overlays than Canvas sometimes) */}
      {hasStarted && (
        <div className="absolute top-0 left-0 p-4 text-white z-10 pointer-events-none">
           <div className="text-xl font-bold text-purple-400 drop-shadow-lg">Score: {score}</div>
           <div className="text-sm text-slate-300 drop-shadow-md">Reputation: {reputation}%</div>
        </div>
      )}

      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        scaleX={scale} 
        scaleY={scale}
        x={stageX}
        y={stageY}
      >
        <Layer>
            {/* 1. Background Wall */}
            {images.wall && <KonvaImage image={images.wall} width={VIRTUAL_WIDTH} height={LAYOUT.wallH} />}
            
            {/* 2. Background Floor */}
            {images.floor && <KonvaImage image={images.floor} y={LAYOUT.wallH} width={VIRTUAL_WIDTH} height={LAYOUT.floorH} />}

            {/* 3. Customer Queue (Behind counter) */}
            <CustomerQueue y={LAYOUT.customerY} width={VIRTUAL_WIDTH} />
            
            {/* 4. Counter (In front of customers) */}
            {images.counter && <KonvaImage image={images.counter} y={LAYOUT.counterY} width={VIRTUAL_WIDTH} height={160} />}

            {/* 5. Active Stations */}
            <CauldronStation 
                y={LAYOUT.cauldronY} 
                width={VIRTUAL_WIDTH} 
                layout={LAYOUT}
            />

            <TrashPortal x={LAYOUT.trashX} y={LAYOUT.trashY} />
            
            <ConveyorBelt 
                y={LAYOUT.beltY} 
                width={VIRTUAL_WIDTH} 
                dragBoundFunc={(pos) => pos}
                layout={LAYOUT}
            />

            <PotionRushEffectsLayer />
        </Layer>
      </Stage>

      {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 text-white">
              <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Shop Closed!</h1>
                  <button 
                    onClick={() => startGame()}
                    className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 font-bold"
                  >
                      Open Again
                  </button>
              </div>
          </div>
      )}
    </div>
  )
}