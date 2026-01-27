'use client'

import { Group, Image as KonvaImage } from 'react-konva'
import { useEffect, useState, useMemo, useRef } from 'react'
import { getRoadTileInfo, TILE_SIZE } from '@/lib/castleDefense'
import type { Group as GroupType } from 'konva/lib/Group'
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
  const groupRef = useRef<GroupType>(null)
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
          console.error(`Failed to load image: ${src}`)
          count++
           if (count === toLoad.length) {
            setImages(loadedImgs)
            setLoaded(true)
          }
      }
    })
  }, [])

  useEffect(() => {
    if (!loaded || !groupRef.current) return

    const node = groupRef.current
    const applyCache = () => {
      try {
        const { width, height } = node.getClientRect()
        if (width > 0 && height > 0) {
          node.clearCache()
          node.cache({ pixelRatio: 1 })
        }
      } catch (e) {
        console.error('Failed to cache background layer', e)
      }
    }

    const frameId = requestAnimationFrame(applyCache)
    return () => cancelAnimationFrame(frameId)
  }, [loaded, grassMap])

  const tiles = useMemo(() => {
    if (!loaded) return null

    const grid: React.ReactNode[] = []
    
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

            const roadInfo = getRoadTileInfo(c, r)
            if (roadInfo) {
                const roadSrc = ASSETS.road[roadInfo.type]
                if (images[roadSrc]) {
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

  if (!loaded) return <Group />

  return (
    <Group ref={groupRef} listening={false}>
       {tiles}
    </Group>
  )
}
