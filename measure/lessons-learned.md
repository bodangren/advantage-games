# Lessons Learned

## Track: Teacher Dashboard Phase 3 (2026-05-09)
- Result: Assignment badges integrated into MainMenu with dynamic import (ssr: false) for Zustand store compatibility
- Coverage: 8 new tests (6 AssignmentBadge + 2 page integration)
- **Key Learning:** Zustand stores in Next.js static export require `next/dynamic` with `{ ssr: false }` to avoid `useSyncExternalStore` errors during prerendering
- **Key Learning:** Client wrapper components are needed when dynamic imports with ssr: false are used in server components

## Track: Teacher Dashboard - Phase 2 (2026-05-08)
- Result: classStore with full CRUD, enrollment codes, soft delete; dashboard/new/detail pages; student enrollment flow with QR codes
- Coverage: 58 tests passing (21 classStore + 37 component tests)
- **Key Learning:** Next.js 15 dynamic route params are now Promises — destructure with `params.then(({ id }) => ...)` or React.use()
- **Key Learning:** `qrcode.react` and similar DOM-dependent libraries need `next/dynamic` with `{ ssr: false }` in static export builds
- **Key Learning:** `generateStaticParams()` is required for ALL dynamic routes with `output: export`; empty array `[]` won't work, need at least one placeholder

## Track: Teacher Dashboard - Phase 1 (2026-05-07)
- Result: Data model types, auth store (Zustand), JWT utilities, login/signup pages with tests
- Removed Next.js middleware after discovering static export incompatibility
- Coverage: 96-100% on all new code
- **Key Learning:** Check `output: export` in next.config.ts before implementing server-side features like middleware
- **Key Learning:** Use `localStorage` for auth persistence in static export contexts; implement client-side route guards

## Previous Tracks (condensed)
- **Background Music Rollout:** Automated asset-to-code mapping catches integration gaps; all 26 games wired, 29 assets shipped
- **Gameplay Usability Bug Fixes:** Code audit for fontSize values is faster than visual testing for catching sub-minimum text sizes
- **VocabularyItem vs SentenceItem:** Keep shared component prop names (e.g., `vocabulary`) even when local data is renamed
- **Three-Game Asset Rollout:** Extract shared helpers early when duplicate code appears across 3+ files
- **Rune Forge Chamber Audit:** Well-architected games require minimal audit fixes; label + htmlFor improves a11y and testability
- **Previous audits (all complete):** Rune Forge, Spellweaver's Run, Village Guardian, Dungeon Liberator, Potion Rush, Rune Match, Castle Defense, Alchemists Synthesis, Wizard vs Zombie, RPG Battle, Magic Defense, Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
