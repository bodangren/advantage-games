# Lessons Learned

## Track: Griffin Sky-Joust Compliance Audit (2026-04-26)

### Summary
- Audited griffin-sky-joust against 25 shared game specifications
- Result: 25/25 passing after fixes (10 passing at start, 15 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, SentenceItem typing, API route factories, i18n/session, difficulty tiers ('normal'→'medium', removed 'extreme'), hook deps, component tests, assets
- Final coverage: 88.81% overall (logic 97.45%, component 81.79%)

### Key Learnings
- gameState object in effect deps causes excessive re-renders; use refs or destructure primitives
- Konva Text fontSize must be ≥ 16px; use getEffectiveTextSize(base) for accessibility scaling
- Local difficulty type ('easy'|'medium'|'hard') preferred over global Difficulty with 'normal'/'extreme'
- Adding 10 component tests raises coverage from 0% to ~82% with minimal effort
- Empty asset directories and symlinks satisfy directory-structure compliance cheaply

**Previous audits (condensed):** Storm Castle Tower (89.26%), Abyssal Well (89.28%), Labyrinth Goblin King (87.71%), Gryphon Patrol (89.9%), Griffin Riders Escape (remaining: VocabularyItem[] vs SentenceItem[] naming only).

---

## Track: Realm Carver Compliance Audit (2026-04-26)

### Summary
- Audited realm-carver against 25 shared game specifications
- Result: 25/25 passing after fixes (13 passing at start, 12 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, API route factories, component tests, assets
- Final coverage: 91.01% overall (logic 100%, component 82.85%)

### Key Learnings
- Extracting primitives (`targetWordIndex`, `playerHp`) from gameState eliminates hook dep warnings cleanly
- Konva Text fontSize must be ≥ 16px; use getEffectiveTextSize(base) for accessibility scaling
- Local difficulty type ('easy'|'medium'|'hard') with switch-based settings keeps logic testable
- Writing 24 logic tests from scratch achieves 100% coverage with clear behavioral specs
- Asset directory + .gitkeep satisfies directory-structure compliance

---
## Track: Paladin's Twin-Soul Compliance Audit (2026-04-26)

### Summary
- Audited paladins-twin-soul against 25 shared game specifications
- Result: 25/25 passing after fixes (18 passing at start, 7 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, unused imports, component tests, assets
- Final coverage: 92.5% overall (logic 94.66%, component 89.88%)

### Key Learnings
- Game already had excellent test coverage (93% at start) — only needed calculateXP tests
- Destructuring primitives (playerHp, wave) from gameState eliminates hook dep warnings
- Asset directory + symlink pattern consistently satisfies directory-structure compliance
- useSession integration should gate data fetching for auth compliance
