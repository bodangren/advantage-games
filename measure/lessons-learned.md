# Lessons Learned

## Track: Rune Match Compliance Audit (2026-04-26)
- Result: 20/25 passing after fixes (11 at start, 9 failures)
- Fixes: rAF loop, fullscreen, accessibility, text sizes, calculateXP, difficulty tiers, GameStartScreen/GameEndScreen, i18n/session, hook deps, unused imports, tests
- Coverage: 82.97% overall (from 69.44%)
- **Key Learnings:**
  - Removing dead code (StartScreen.tsx) instantly boosts coverage ~15%
  - Merging fullscreen ref with container ref prevents ResizeObserver silent failures
  - GameStartScreen children prop works well for MonsterSelection integration

---

## Track: Castle Defense Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: rAF loop, fullscreen, accessibility, text sizes, calculateXP, difficulty tiers, SentenceItem typing, useSession, component tests, hook deps, duplicate test file
- Coverage: 80.45% overall (from 49.47%)
- **Key Learnings:**
  - Converting useInterval to rAF requires moving camera/animation/build-effects into the loop
  - calculateCastleDefenseXP can reuse standard bonus pattern (accuracy + survival + speed + progression)
  - Adding 15 component tests raises coverage from 49% to 80% with minimal effort

---

## Track: Alchemists Synthesis Compliance Audit (2026-04-26)
- Result: 23/25 passing (2 partial: empty asset dir, minimal gameplay)
- Fixes: Created full game scaffold from scratch (was 'coming-soon' with no code)
- Coverage: 100% logic, 81.36% component
- **Key Learnings:**
  - Building a compliant game skeleton first, then iterating, is faster than retrofitting
  - Pure tick + rAF pattern is straightforward for simple turn-based games
  - React-Konva mocking strategy: mock Stage/Layer/Group as div wrappers
## Track: Potion Rush Compliance Audit (2026-04-26)
- Result: 24/25 passing after fixes (13 at start, 11 failures)
- Fixes: rAF loop, fullscreen, accessibility, text sizes, calculateXP, difficulty tiers, SentenceItem typing, useSession, component tests, touch targets
- Coverage: 85.58% overall (from 33.39%)
- **Key Learnings:**
  - jest coverage merging fails for paths with brackets ([locale]); verify isolation
  - Zustand store can host both state logic and calculateXP; no separate logic file needed
  - Adding 24 tests across 5 files raises coverage from 33% to 85% efficiently
## Track: Enchanted Library Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (16 at start, 9 failures)
- Fixes: rAF loop, useGameFullscreen, text sizes, touch targets, useAccessibilitySettings, useCurrentLocale, useSession, calculateEnchantedLibraryXP, off-screen indicators, RankingDisplay tests
- Coverage: 91.27% overall (from 84.81%), 88.31% components (from 78.14%)
- **Key Learnings:**
  - rAF conversion requires refs for callback dependencies (computeCamera, findCollectedBook) to avoid stale closures
  - Moving refs after function declarations prevents temporal dead zone errors
  - Adding 12 RankingDisplay tests raises component coverage ~10% instantly

**Previous audits (condensed):** Dungeon Liberator, Potion Rush, Rune Match, Castle Defense, Alchemists Synthesis, Wizard vs Zombie, RPG Battle, Magic Defense, Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
