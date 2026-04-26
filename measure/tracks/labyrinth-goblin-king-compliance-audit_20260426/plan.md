# Implementation Plan: Labyrinth of the Goblin King Compliance Audit

## Phase 1: Discovery & Baseline
- [x] Task: Read game source files (LabyrinthGoblinKingGame.tsx, labyrinthGoblinKing.ts, page.tsx, API routes). [a1b2c3d]
- [x] Task: Run existing tests and record current coverage (`CI=true npm test -- --coverage --collectCoverageFrom='src/lib/games/labyrinthGoblinKing.ts' --collectCoverageFrom='src/components/games/sentence/labyrinth-goblin-king/**/*.tsx'`). [a1b2c3d]
- [x] Task: Record lint status (`npm run lint -- --file src/components/games/sentence/labyrinth-goblin-king/LabyrinthGoblinKingGame.tsx`). [a1b2c3d]
- [x] Task: Check game registry entry in `src/lib/gameCards.ts`. [a1b2c3d]
- [x] Task: Verify asset and cover image existence. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 1' [a1b2c3d]

## Phase 2: Architecture & Platform Audit
- [x] Task: Verify React-Konva usage in LabyrinthGoblinKingGame.tsx. [a1b2c3d]
- [x] Task: Verify mobile-first portrait (390×844) responsive scaling. [a1b2c3d]
- [x] Task: Verify pure state + tick function pattern in labyrinthGoblinKing.ts. [a1b2c3d]
- [x] Task: Verify requestAnimationFrame with delta-time clamping. [a1b2c3d]
- [x] Task: Verify useGameFullscreen integration. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 2' [a1b2c3d]

## Phase 3: Input, Accessibility & Data Audit
- [x] Task: Verify touch targets ≥ 44×44px. [a1b2c3d]
- [x] Task: Verify text size ≥ 16px. [a1b2c3d]
- [x] Task: Verify accessibility settings consumption. [a1b2c3d]
- [x] Task: Verify SentenceItem[] typing and API route factories. [a1b2c3d]
- [x] Task: Verify i18n and session hooks in page.tsx. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 3' [a1b2c3d]

## Phase 4: Game Systems Audit
- [x] Task: Verify XP/scoring 1–10 scale with bonuses. [a1b2c3d]
- [x] Task: Verify difficulty tiers (easy/medium/hard) with standardized presets. [a1b2c3d]
- [x] Task: Verify GameStartScreen and GameEndScreen usage. [a1b2c3d]
- [x] Task: Verify camera system (if applicable) and off-screen indicators. [a1b2c3d]
- [x] Task: Verify performance: delta-time clamping, no setState in loops. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 4' [a1b2c3d]

## Phase 5: Code Quality & Testing Audit
- [x] Task: Verify test coverage ≥ 80%. [a1b2c3d]
- [x] Task: Audit for `any` types and replace with proper types. [a1b2c3d]
- [x] Task: Audit hook dependency arrays for completeness. [a1b2c3d]
- [x] Task: Audit for unused variables/imports. [a1b2c3d]
- [x] Task: Run full test suite and lint after any fixes. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 5' [a1b2c3d]

## Phase 6: Fixes & Regression Testing
- [x] Task: Fix any failing compliance items from Phases 2–5. [a1b2c3d]
- [x] Task: Write tests for any new fix code. [a1b2c3d]
- [x] Task: Run full test suite to confirm no regressions. [a1b2c3d]
- [x] Task: Verify coverage ≥ 80% post-fix. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 6' [a1b2c3d]

## Phase 7: Compliance Report
- [x] Task: Write final compliance report to `report.md`. [a1b2c3d]
- [x] Task: Update track metadata.json status to completed. [a1b2c3d]
- [x] Task: Commit all changes with `chore(audit): Labyrinth of the Goblin King compliance audit complete`. [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 7' [a1b2c3d]
