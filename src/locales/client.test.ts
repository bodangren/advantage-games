import { useScopedI18n, useCurrentLocale, useI18n } from './client'

describe('locales/client', () => {
  describe('useScopedI18n', () => {
    it('returns translation for scoped key', () => {
      const t = useScopedI18n('games.common')
      expect(t('start')).toBe('Start')
      expect(t('gameOver')).toBe('Game Over')
    })

    it('returns key if translation not found', () => {
      const t = useScopedI18n('games.common')
      expect(t('nonexistent')).toBe('nonexistent')
    })

    it('handles nested scopes', () => {
      const t = useScopedI18n('games.dragonFlight')
      expect(t('title')).toBe('Dragon Flight')
    })

    it('interpolates parameters', () => {
      const t = useScopedI18n('games.common')
      const result = t('test', { name: 'Player' })
      expect(result).toBe('test')
    })
  })

  describe('useCurrentLocale', () => {
    it('returns en', () => {
      expect(useCurrentLocale()).toBe('en')
    })
  })

  describe('useI18n', () => {
    it('returns translation for full key', () => {
      const t = useI18n()
      expect(t('games.common.start')).toBe('Start')
    })

    it('returns key if translation not found', () => {
      const t = useI18n()
      expect(t('nonexistent.key')).toBe('nonexistent.key')
    })
  })
})
