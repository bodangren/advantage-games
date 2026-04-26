# Technical Debt

## Haunted Library Compliance Audit (2026-04-26)

### Resolved
- useInterval → requestAnimationFrame with 50ms delta clamping
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added getEffectiveTextSize for all text
- Text size below 16px — increased base fontSize from 12/14 to 16px
- API routes — switched to createSentencesRoute / createCompleteRoute
- Missing i18n/session — added useScopedI18n, useCurrentLocale, useSession
- calculateXP — added accuracy/speed/survival bonuses capped at 10
- Component tests — wrote HauntedLibraryGame.test.tsx (0% → 88.1%)
- State schema — added initialLives and difficulty to LibraryState

### Remaining
- None

---

## Previous Tracks (Condensed)

**Abyssal Well (2026-04-26):** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, component tests, assets. Remaining: none.

**Labyrinth Goblin King (2026-04-26):** Resolved fullscreen, accessibility, text sizes, hook deps, unused imports, i18n/session, component tests. Remaining: none.

**Griffin Riders Escape (2026-04-26):** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, cover image. Remaining: VocabularyItem[] vs SentenceItem[] naming only.
