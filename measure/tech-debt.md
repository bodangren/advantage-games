# Technical Debt

## Griffin Sky-Joust Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added getEffectiveTextSize for all text
- Text size below 16px — increased base fontSize from 14 to 16px
- API routes — switched to createSentencesRoute / createCompleteRoute
- Missing i18n/session — added useScopedI18n, useCurrentLocale, useSession
- Difficulty tiers — created local GriffinSkyJoustDifficulty ('easy'|'medium'|'hard'), removed 'extreme'
- Hook dependencies — fixed gameState object in deps using refs and primitives
- Component tests — wrote GriffinSkyJoustGame.test.tsx (0% → 81.79%)
- SentenceItem typing — replaced VocabularyItem with local SentenceItem interface
- Assets — created asset directory and cover image symlink

### Remaining
- None

---

**Storm Castle Tower:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets. Remaining: none.

**Haunted Library:** Resolved rAF loop, fullscreen, accessibility, text sizes, API factories, i18n/session, calculateXP, component tests, state schema. Remaining: none.

**Abyssal Well:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, component tests, assets. Remaining: none.

**Labyrinth Goblin King:** Resolved fullscreen, accessibility, text sizes, hook deps, unused imports, i18n/session, component tests. Remaining: none.

**Gryphon Patrol:** Resolved rAF game loop, fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, component tests, assets. Remaining: difficulty presets not yet wired to logic, VocabularyItem[] vs SentenceItem[] naming.

**Griffin Riders Escape:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, cover image. Remaining: VocabularyItem[] vs SentenceItem[] naming only.
