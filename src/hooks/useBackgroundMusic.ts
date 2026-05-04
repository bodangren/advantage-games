'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type GameMusicId =
  | 'castle-defense'
  | 'dragon-rider'
  | 'magic-defense'
  | 'rpg-battle'
  | 'dragon-flight'
  | 'wizard-vs-zombie'
  | 'enchanted-library'
  | 'rune-match'
  | 'alchemists-synthesis'
  | 'potion-rush'
  | 'dungeon-liberator'
  | 'spellweavers-run'
  | 'shadow-gate-dungeon'
  | 'rune-forge-chamber'
  | 'village-guardian'
  | 'labyrinth-goblin-king'
  | 'abyssal-well'
  | 'archers-revenge'
  | 'storm-castle-tower'
  | 'griffin-sky-joust'
  | 'realm-carver'
  | 'paladins-twin-soul'
  | 'griffin-riders-escape'
  | 'astral-mage'
  | 'devourer-slime'
  | 'babel-architect'
  | 'sorcerer-ziggurat'
  | 'haunted-library'
  | 'gryphon-patrol'

function getMusicPath(gameId: GameMusicId): string {
  return `/sounds/music/${gameId}.mp3`
}

export function useBackgroundMusic(gameId: GameMusicId) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(getMusicPath(gameId))
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio
    isPlayingRef.current = false
    setIsPlaying(false)

    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
      isPlayingRef.current = false
      setIsPlaying(false)
    }
  }, [gameId])

  const start = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || isPlayingRef.current) return

    isPlayingRef.current = true
    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      isPlayingRef.current = false
      // Autoplay policy may block; user gesture required
    }
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  return { start, stop, pause, isPlaying }
}
