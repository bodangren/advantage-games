# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- VocabularyItem[] vs SentenceItem[] naming consistency (Griffin Riders Escape, Gryphon Patrol).

---

## Rune Match Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, MONSTER_DIFFICULTY mapping, GameStartScreen/GameEndScreen, useCurrentLocale, useSession, hook deps, unused imports, removed StartScreen.tsx, added 51 tests

### Remaining
- RuneMatchGame.tsx coverage at 73.33% (below 80% target) — Konva rendering branches hard to test
- page.tsx coverage at 71.15% — API error handling branches uncovered

---

## Castle Defense Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty naming, SentenceItem typing, useSession, component tests, hook deps, duplicate test file

### Remaining
- None

---

## Potion Rush Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, SentenceItem typing, useSession, component tests, touch targets

### Remaining
- TrashPortal.tsx still uses useInterval (cosmetic; deferred)
- PotionRushEffectsLayer.tsx coverage at 43.79% — particle rendering hard to mock

---
## Dungeon Liberator Compliance Audit (2026-04-26)

### Resolved
- rAF loop, text sizes, SentenceItem typing, API factories, useSession, calculateDungeonLiberatorXP, difficulty tiers, asset dir, tests, lint

### Remaining
- None

---

## Enchanted Library Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, text sizes, touch targets, useAccessibilitySettings, useCurrentLocale, useSession, calculateEnchantedLibraryXP, off-screen indicators, RankingDisplay tests

### Remaining
- None
