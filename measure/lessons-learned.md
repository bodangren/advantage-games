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

---

## Track: Alchemists Synthesis Compliance Audit (2026-04-26)
- Result: 23/25 passing (2 partial: empty asset dir, minimal gameplay)
- Fixes: Created full game scaffold from scratch (was 'coming-soon' with no code)
- Coverage: 100% logic, 81.36% component
- **Key Learnings:**
  - Building a compliant game skeleton first, then iterating, is faster than retrofitting
  - Pure tick + rAF pattern is straightforward for simple turn-based games
  - React-Konva mocking strategy: mock Stage/Layer/Group as div wrappers

---

## Track: Castle Defense Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: rAF loop, fullscreen, accessibility, text sizes, calculateXP, difficulty tiers, SentenceItem typing, useSession, component tests, hook deps
- Coverage: 80.45% overall (from 49.47%)
- **Key Learnings:**
  - Converting useInterval to rAF requires moving camera/animation/build-effects into the loop
  - calculateCastleDefenseXP can reuse standard bonus pattern (accuracy + survival + speed + progression)
  - Adding 15 component tests raises coverage from 49% to 80% with minimal effort

**Previous audits (condensed):** Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, RPG Battle, Wizard vs Zombie, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
