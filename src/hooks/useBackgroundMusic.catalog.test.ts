import fs from 'fs'
import path from 'path'
import { GameMusicId } from './useBackgroundMusic'

describe('Music Catalog Integration', () => {
  const musicDir = path.join(process.cwd(), 'public', 'sounds', 'music')
  
  const allGameIds: GameMusicId[] = [
    'castle-defense', 'dragon-rider', 'magic-defense', 'rpg-battle',
    'dragon-flight', 'wizard-vs-zombie', 'enchanted-library', 'rune-match',
    'alchemists-synthesis', 'potion-rush', 'dungeon-liberator', 'spellweavers-run',
    'shadow-gate-dungeon', 'rune-forge-chamber', 'village-guardian',
    'labyrinth-goblin-king', 'abyssal-well', 'archers-revenge',
    'storm-castle-tower', 'griffin-sky-joust', 'realm-carver',
    'paladins-twin-soul', 'griffin-riders-escape', 'astral-mage',
    'devourer-slime', 'babel-architect', 'sorcerer-ziggurat',
    'haunted-library', 'gryphon-patrol'
  ]

  const playableGameIds: GameMusicId[] = allGameIds.filter(
    id => !['astral-mage', 'babel-architect', 'sorcerer-ziggurat'].includes(id)
  )

  it('has music assets for all defined game IDs', () => {
    allGameIds.forEach(gameId => {
      const musicPath = path.join(musicDir, `${gameId}.mp3`)
      expect(fs.existsSync(musicPath)).toBe(true)
    })
  })

  it('has non-placeholder assets for playable games', () => {
    const placeholderPath = path.join(musicDir, 'placeholder.mp3')
    const placeholderSize = fs.statSync(placeholderPath).size
    
    playableGameIds.forEach(gameId => {
      const musicPath = path.join(musicDir, `${gameId}.mp3`)
      const stats = fs.statSync(musicPath)
      
      // Each playable game should have a unique asset (not just a copy of placeholder)
      expect(stats.size).toBeGreaterThan(0)
      expect(stats.size).not.toBe(placeholderSize)
    })
  })

  it('maintains consistent file naming convention', () => {
    allGameIds.forEach(gameId => {
      const expectedPath = path.join(musicDir, `${gameId}.mp3`)
      expect(fs.existsSync(expectedPath)).toBe(true)
    })
  })

  it('has no orphaned music files without game IDs', () => {
    const files = fs.readdirSync(musicDir)
    const mp3Files = files.filter(f => f.endsWith('.mp3'))
    const expectedFiles = allGameIds.map(id => `${id}.mp3`)
    
    // Allow placeholder.mp3 as a shared fallback
    expectedFiles.push('placeholder.mp3')
    
    mp3Files.forEach(file => {
      expect(expectedFiles).toContain(file)
    })
  })
})
