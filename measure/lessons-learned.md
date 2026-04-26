# Lessons Learned

## Track: Wizard vs Zombie Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (18 at start, 7 failures)
- Fixes: useGameFullscreen, RAF game loop, GameStartScreen/GameEndScreen, difficulty tiers, useCurrentLocale, unused imports, tests
- Coverage: 89.05% overall
- **Key Learnings:**
  - Converting useInterval to requestAnimationFrame requires refs for gameState/input/assets
  - GameStartScreen children prop is the right place for difficulty selectors
  - Removing unused custom StartScreen.tsx (0% coverage) instantly raises overall coverage ~15%

---

## Track: Archer's Revenge Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (23 at start, 2 failures)
- Coverage: 93.14% overall
- **Key Learnings:**
  - gameState object in effect deps causes excessive re-renders; use refs or destructure primitives
  - Strong baseline coverage (91%+) means audits are quick

---

## Track: Griffin Sky-Joust Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (10 at start, 15 failures)
- Coverage: 88.81% overall
- **Key Learnings:**
  - Konva Text fontSize must be ≥ 16px; use getEffectiveTextSize(base)
  - Local difficulty type ('easy'|'medium'|'hard') preferred over 'normal'/'extreme'

---

## Track: Realm Carver Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Coverage: 91.01% overall
- **Key Learnings:**
  - Extracting primitives from gameState eliminates hook dep warnings cleanly
  - Writing 24 logic tests from scratch achieves 100% coverage

---

## Track: Paladin's Twin-Soul Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (18 at start, 7 failures)
- Coverage: 92.5% overall
- **Key Learnings:**
  - Game already had excellent test coverage (93% at start)
  - useSession integration should gate data fetching for auth compliance

**Previous audits (condensed):** Dragon Rider (88.78% component, 95.33% logic), Storm Castle Tower (89.26%), Abyssal Well (89.28%), Labyrinth Goblin King (87.71%), Gryphon Patrol (89.9%), Griffin Riders Escape (naming only).
