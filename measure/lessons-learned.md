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

## Track: Teacher Dashboard - Phase 1 (2026-05-07)
- Result: Data model types, auth store (Zustand), JWT utilities, login/signup pages with tests
- Removed Next.js middleware after discovering static export incompatibility
- Coverage: 96-100% on all new code
- **Key Learning:** Check `output: export` in next.config.ts before implementing server-side features like middleware
- **Key Learning:** Use `localStorage` for auth persistence in static export contexts; implement client-side route guards

## Track: Teacher Dashboard - Phase 2 (2026-05-08)
- Result: classStore with full CRUD, enrollment codes, soft delete; dashboard/new/detail pages; student enrollment flow with QR codes
- Coverage: 58 tests passing (21 classStore + 37 component tests)
- **Key Learning:** Next.js 15 dynamic route params are now Promises — destructure with `params.then(({ id }) => ...)` or React.use()
- **Key Learning:** `qrcode.react` and similar DOM-dependent libraries need `next/dynamic` with `{ ssr: false }` in static export builds
- **Key Learning:** `generateStaticParams()` is required for ALL dynamic routes with `output: export`; empty array `[]` won't work, need at least one placeholder

**Previous audits (condensed):** Rune Forge, Spellweaver's Run, Village Guardian, Dungeon Liberator, Potion Rush, Rune Match, Castle Defense, Alchemists Synthesis, Wizard vs Zombie, RPG Battle, Magic Defense, Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
