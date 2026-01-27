'use client'

import { Layer, Image as KonvaImage } from 'react-konva'
import { useEffect, useState, useMemo, useRef } from 'react'
import { getRoadTileInfo, TILE_SIZE } from '@/lib/castleDefense'
import type { Layer as LayerType } from 'konva/lib/Layer'
import { withBasePath } from '@/lib/basePath'

const ASSETS = {
  grass: [
    withBasePath('/games/castle-defense/grass_A.png'),
    withBasePath('/games/castle-defense/grass_B.png'),
    withBasePath('/games/castle-defense/grass_C.png'),
    withBasePath('/games/castle-defense/grass-D.png')
  ],
  road: {
    EW: withBasePath('/games/castle-defense/road_EW.png'),
    NS: withBasePath('/games/castle-defense/road_NS.png'),
    CORNER: withBasePath('/games/castle-defense/road_corner.png')
  }
}

interface BackgroundLayerProps {
  grassMap: number[][]
}

export function BackgroundLayer({ grassMap }: BackgroundLayerProps) {
  const layerRef = useRef<LayerType>(null)
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const toLoad = [
      ...ASSETS.grass,
      ASSETS.road.EW,
      ASSETS.road.NS,
      ASSETS.road.CORNER
    ]
    
    let count = 0
    const loadedImgs: Record<string, HTMLImageElement> = {}

    toLoad.forEach(src => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        loadedImgs[src] = img
        count++
        if (count === toLoad.length) {
          setImages(loadedImgs)
          setLoaded(true)
        }
      }
      img.onerror = () => {
          // Fallback or just continue?
          console.error(`Failed to load image: ${src}`)
          // Treat as loaded to avoid blocking?
          count++
           if (count === toLoad.length) {
            setImages(loadedImgs)
            setLoaded(true)
          }
      }
    })
  }, [])

  useEffect(() => {
    if (loaded && layerRef.current) {
        try {
            // Clear previous cache if any
            layerRef.current.clearCache()
            // Cache the layer for performance
            layerRef.current.cache()
        } catch (e) {
            console.error('Failed to cache background layer', e)
        }
    }
  }, [loaded, grassMap])

  const tiles = useMemo(() => {
    if (!loaded) return null

    const grid: React.ReactNode[] = []
    
    // Rows = Y, Cols = X
    for(let r=0; r<grassMap.length; r++) {
        for(let c=0; c<grassMap[0].length; c++) {
            const x = c * TILE_SIZE
            const y = r * TILE_SIZE
            
            const grassIdx = grassMap[r][c]
            const grassSrc = ASSETS.grass[grassIdx]
            
            if (images[grassSrc]) {
                grid.push(
                    <KonvaImage 
                        key={`grass-${r}-${c}`}
                        image={images[grassSrc]}
                        x={x}
                        y={y}
                        width={TILE_SIZE}
                        height={TILE_SIZE}
                    />
                )
            }

            // Road
            const roadInfo = getRoadTileInfo(c, r)
            if (roadInfo) {
                const roadSrc = ASSETS.road[roadInfo.type]
                if (images[roadSrc]) {
                    // For rotation:
                    // Konva rotation rotates around the (x,y) point.
                    // We render at center (cx, cy) and set offset to center (half size)
                    // So it rotates around its center.
                    const cx = x + TILE_SIZE / 2
                    const cy = y + TILE_SIZE / 2
                    
                    grid.push(
                        <KonvaImage
                            key={`road-${r}-${c}`}
                            image={images[roadSrc]}
                            x={cx}
                            y={cy}
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                            offsetX={TILE_SIZE / 2}
                            offsetY={TILE_SIZE / 2}
                            rotation={roadInfo.rotation}
                        />
                    )
                }
            }
        }
    }
    return grid
  }, [loaded, images, grassMap])

  if (!loaded) return <Layer />

  return (
    <Layer ref={layerRef} listening={false}>
       {tiles}
    </Layer>
  )
}
