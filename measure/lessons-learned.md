# Lessons Learned

## Track: Archer's Revenge Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (23 at start, 2 failures)
- Fixes: hook deps (gameState ref pattern), unused vars (locale/session)
- Coverage: 93.14% overall (logic 99.16%, component 88.72%)
- **Key Learnings:**
  - gameState object in effect deps causes excessive re-renders; use refs or destructure primitives
  - Removing unused hook return values (not the hooks themselves) cleans up lint without breaking side effects
  - Strong baseline coverage (91%+) means audits are quick — only code quality issues remain

---

## Track: Griffin Sky-Joust Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (10 at start, 15 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, SentenceItem typing, API factories, i18n/session, difficulty tiers, hook deps, component tests, assets
- Coverage: 88.81% overall
- **Key Learnings:**
  - Konva Text fontSize must be ≥ 16px; use getEffectiveTextSize(base) for accessibility scaling
  - Local difficulty type ('easy'|'medium'|'hard') preferred over global Difficulty with 'normal'/'extreme'
  - Adding 10 component tests raises coverage from 0% to ~82% with minimal effort

---

## Track: Realm Carver Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, API route factories, component tests, assets
- Coverage: 91.01% overall
- **Key Learnings:**
  - Extracting primitives from gameState eliminates hook dep warnings cleanly
  - Writing 24 logic tests from scratch achieves 100% coverage with clear behavioral specs
  - Asset directory + .gitkeep satisfies directory-structure compliance

---

## Track: Paladin's Twin-Soul Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (18 at start, 7 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, unused imports, component tests, assets
- Coverage: 92.5% overall
- **Key Learnings:**
  - Game already had excellent test coverage (93% at start) — only needed calculateXP tests
  - Asset directory + symlink pattern consistently satisfies directory-structure compliance
  - useSession integration should gate data fetching for auth compliance

**Previous audits (condensed):** Storm Castle Tower (89.26%), Abyssal Well (89.28%), Labyrinth Goblin King (87.71%), Gryphon Patrol (89.9%), Griffin Riders Escape (remaining: VocabularyItem[] vs SentenceItem[] naming only).
