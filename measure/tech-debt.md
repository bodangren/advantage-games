# Technical Debt

## Dragon Flight Compliance Audit (2026-04-26)

### Resolved
- Infinite loop on mount — removed `resetGame()` from mount useEffect, stabilized `DIFFICULTY_SETTINGS` with `useState` lazy initializer
- Missing hook dependencies — fixed 5 react-hooks/exhaustive-deps warnings in DragonFlightGame.tsx
- Unused variables/imports — removed 6 eslint no-unused-vars warnings
- Missing test attributes — added data-testid, role="progressbar", aria-label for testability
- RankingDialog.tsx missing deps — wrapped `fetchRankings` in `useCallback` with `apiEndpoint` dep
- useSound JSDOM error — added mock in DragonFlightGame.test.tsx

### Remaining
- Missing useGameFullscreen integration — would require UI refactor to add fullscreen toggle
- Missing useAccessibilitySettings — would require touch target scaling and text size multiplier integration
- Custom start/end screens instead of shared GameStartScreen/GameEndScreen — major UI refactor needed
- Missing useCurrentLocale and useSession in page.tsx — low impact for single-locale deployment
- Uses useInterval (60ms) instead of requestAnimationFrame with delta-time clamping — architectural change

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
