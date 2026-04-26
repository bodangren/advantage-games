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

## Track: RPG Battle Compliance Audit (2026-04-26)
- Result: 22/25 passing (3 N/A by architecture), 3 failures fixed
- Fixes: useGameFullscreen, useCurrentLocale/useSession, text sizes, GameEndScreen, unused imports
- Coverage: 83.52% overall (92.64% components)
- **Key Learnings:**
  - DOM-based turn-based games cannot comply with React-Konva/canvas specs without rewrite
  - Replacing custom end screen with GameEndScreen is low-risk; replacing custom start screen is high-risk
  - page.tsx game logic (handleSubmit, triggerEnemyTurn) is hard to test with static mocks — extract to hook

---

## Track: Magic Defense Compliance Audit (2026-04-26)
- Result: 20/25 passing (3 architectural: Konva, pure tick, rAF), 2 N/A
- Fixes: useGameFullscreen, useAccessibilitySettings, useCurrentLocale, useSession, difficulty label, lint, asset dir, tests
- Coverage: 80.52% overall (from 35.06%)
- **Key Learnings:**
  - DOM-based games cannot meet Konva/pure-tick/rAF specs without complete rewrite
  - Adding 18 tests raises coverage from 35% to 80% with focused test files
  - Global Difficulty type ('normal') conflicts with 'medium' label; use translations for display

**Previous audits (condensed):** Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, RPG Battle, Wizard vs Zombie, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
