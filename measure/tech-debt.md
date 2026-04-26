# Technical Debt

## The Abyssal Well Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added text scaling via getEffectiveTextSize
- Text size below 16px — updated all Konva Text to use getEffectiveTextSize(base ≥ 16)
- calculateXP not 1-10 scale — added game-specific function with accuracy/speed/survival bonuses
- Difficulty 'normal' instead of 'medium' — renamed in config, default state, and UI
- ESLint hook dependency warnings — added containerRef to useEffect/useCallback deps
- Missing i18n/session hooks — added useScopedI18n, useCurrentLocale, useSession
- Missing component tests — wrote AbyssalWellGame.test.tsx (9 tests, 0% → 80.91%)
- Missing asset directory — created /public/games/sentence/abyssal-well/
- Missing cover image symlink — linked abyssal-well-cover.png to existing asset

### Remaining
- None

---

## Labyrinth of the Goblin King Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added text scaling via getEffectiveTextSize
- Text size below 16px — increased Konva Text fontSize from 10/12/14 to 16px base
- Unstable hook deps — removed gameState object from effect deps, destructured primitives
- Unused imports/variables — removed Clock import, fixed _e parameter
- Missing i18n/session hooks — added useScopedI18n and useSession to page.tsx
- Component test coverage — wrote LabyrinthGoblinKingGame.test.tsx (13 tests, 0% → 91.04%)

### Remaining
- None

---

## Griffin Riders Escape Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added text scaling via getEffectiveTextSize
- Text size below 16px — changed text-xs to text-base with accessibility scaling
- calculateXP not 1-10 scale — added game-specific function with bonuses capped at 10
- Difficulty 'normal' instead of 'medium' — renamed in config and default state
- ESLint hook dependency warnings — fixed by restructuring effect conditions
- Missing i18n/session hooks — added useScopedI18n, useCurrentLocale, useSession
- Missing cover image — copied background asset to cover path

### Remaining
- SentenceItem[] typing: game uses VocabularyItem[] with identical {term, translation} shape. Type name differs from spec but runtime behavior is correct.
