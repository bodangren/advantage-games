import { gameCards } from '@/lib/gameCards'
import fs from 'fs'
import path from 'path'

describe('Babel Architect Compliance Audit', () => {
  const projectRoot = process.cwd()
  const card = gameCards.find(g => g.id === 'babel-architect')

  describe('Project Integration', () => {
    it('should be registered in gameCards with correct metadata', () => {
      expect(card).toBeDefined()
      expect(card!.title).toBe("Babel's Architect")
      expect(card!.status).toBe('coming-soon')
      expect(card!.href).toBe('/en/student/games/sentence/babel-architect')
    })

    it('should have a cover image', () => {
      const coverPath = path.join(projectRoot, 'public/games/cover/cover-babel-architect.png')
      expect(fs.existsSync(coverPath)).toBe(true)
    })

    it('should have game assets directory when playable', () => {
      if (card?.status !== 'playable') {
        // Skip for coming-soon games
        return
      }
      const assetsDir = path.join(projectRoot, 'public/games/sentence/babel-architect')
      expect(fs.existsSync(assetsDir)).toBe(true)
    })
  })

  describe('Architecture & Platform', () => {
    beforeAll(() => {
      if (card?.status !== 'playable') {
        // Mark all tests in this describe as pending when coming-soon
      }
    })

    it('should have BabelArchitectGame.tsx component when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const componentPath = path.join(
        projectRoot,
        'src/components/games/sentence/babel-architect/BabelArchitectGame.tsx'
      )
      expect(fs.existsSync(componentPath)).toBe(true)
    })

    it('should have game logic module when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const logicPath = path.join(projectRoot, 'src/lib/games/babelArchitect.ts')
      expect(fs.existsSync(logicPath)).toBe(true)
    })

    it('should have page.tsx when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const pagePath = path.join(
        projectRoot,
        'src/app/[locale]/(student)/student/games/sentence/babel-architect/page.tsx'
      )
      expect(fs.existsSync(pagePath)).toBe(true)
    })
  })

  describe('Data & API Integration', () => {
    it('should have sentences API route when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const apiPath = path.join(
        projectRoot,
        'src/app/api/v1/games/babel-architect/sentence/route.ts'
      )
      expect(fs.existsSync(apiPath)).toBe(true)
    })

    it('should have complete API route when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const apiPath = path.join(
        projectRoot,
        'src/app/api/v1/games/babel-architect/complete/route.ts'
      )
      expect(fs.existsSync(apiPath)).toBe(true)
    })
  })

  describe('Code Quality & Testing', () => {
    it('should have game logic tests when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const testPath = path.join(projectRoot, 'src/lib/games/babelArchitect.test.ts')
      expect(fs.existsSync(testPath)).toBe(true)
    })

    it('should have component tests when playable', () => {
      if (card?.status !== 'playable') {
        return
      }
      const testPath = path.join(
        projectRoot,
        'src/components/games/sentence/babel-architect/BabelArchitectGame.test.tsx'
      )
      expect(fs.existsSync(testPath)).toBe(true)
    })
  })
})
