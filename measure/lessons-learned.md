# Lessons Learned

## Track: Three-Game Asset Rollout (2026-05-07)
- Result: All 5 phases complete. 23 assets generated, 4 game components wired, shared loadSprite helper extracted.
- Approach: Generate images with mmx, convert JPG→PNG, stitch into 3x3 sheets with PIL, wire with KonvaImage + primitive fallback.
- Key insight: mmx outputs JPG without transparency; convert to PNG and use uniform 3x3 sheets (same frame repeated) for consistent format.
- Key insight: Extract shared helpers early when duplicate code appears across 3+ files — loadSprite now used by 4 games.
- Build succeeds, lint clean (0 errors), dev server verified.

## Track: VocabularyItem vs SentenceItem Naming Consistency (2026-05-06)
- Result: All 3 games refactored (Griffin Riders Escape, Village Guardian, Gryphon Patrol)
- Approach: Define local SentenceItem type in each game lib file, replace VocabularyItem imports
- Key insight: GameStartScreen is a shared component that expects `vocabulary` prop — keep that prop name when passing to shared components even if local data is renamed to `sentences`
- No functional changes, all tests pass, lint clean

## Track: Shadow Gate Dungeon Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: fullscreen, accessibility, text sizes, API factories, useSession/useScopedI18n, hook deps, component tests, asset dir
- Coverage: 88.67% overall (from 0%)
- **Key Learnings:**
  - Game already had solid rAF + pure tick architecture; only missing platform hooks
  - Adding aria-labels to selects improves both accessibility and testability
  - 49 tests across 6 files reaches 88% coverage efficiently from zero baseline

## Track: Spellweaver's Run Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: fullscreen, accessibility, text sizes, calculateSpellweaversRunXP, difficulty tiers, SentenceItem typing, API factories, useSession, component tests, hook deps, unused imports, asset dir
- Coverage: 88.37% overall
- **Key Learnings:**
  - Adding useGameFullscreen + useAccessibilitySettings to an existing rAF game is straightforward
  - calculateSpellweaversRunXP reuses standard bonus pattern (accuracy + survival + speed + progression)
  - 6 component tests raise coverage from 0% to 80% efficiently

## Track: Rune Forge Chamber Compliance Audit (2026-04-26)
- Result: 25/25 passing (already compliant)
- Fixes: Accessibility labels on selects, page test i18n mock
- Coverage: 93.75% overall (100% logic, 90.72% component, 90% page)
- **Key Learnings:**
  - Well-architected games from previous work require minimal audit fixes
  - Label + htmlFor on selects improves both a11y and testability simultaneously
  - High baseline compliance means audit is primarily verification

## Track: Gameplay Usability Bug Fixes (2026-05-05)
- Fixed text readability violations: Potion Rush (12→16px), Spellweaver's Run (10-12→18px), Village Guardian (14→16/18px)
- All touched games now meet HUD ≥16px and words ≥18px minimums
- **Key Learning:** Code audit for fontSize values is faster than visual testing for catching sub-minimum text sizes

## Track: Background Music Rollout - Phase 5 (2026-05-06)
- Result: All 5 phases complete. 26 playable games wired, 29 music assets shipped.
- Fix: Spellweaver's Run was missing startMusic/stopMusic lifecycle calls - hook was declared but never invoked.
- Added catalog integration test (useBackgroundMusic.catalog.test.ts) verifying all 29 GameMusicId values have corresponding mp3 files.
- Coverage: 100% statements, 84.61% branches for useBackgroundMusic hook.
- **Key Learning:** Automated verification of asset-to-code mapping catches integration gaps that manual audits miss.

**Previous audits (condensed):** Rune Forge Chamber, Spellweaver's Run, Village Guardian, Dungeon Liberator, Potion Rush, Rune Match, Castle Defense, Alchemists Synthesis, Wizard vs Zombie, RPG Battle, Magic Defense, Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
