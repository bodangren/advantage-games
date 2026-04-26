# Implementation Plan: Enchanted Library Compliance Audit

## Phase 1: Discovery & Baseline
- [x] Task: Read game source files (EnchantedLibraryGame.tsx, enchantedLibrary.ts, page.tsx, API routes). [a1b2c3d]
- [x] Task: Run existing tests and record current coverage (84.81% overall, 78.14% components). [a1b2c3d]
- [x] Task: Record lint status (passes). [a1b2c3d]
- [x] Task: Check game registry entry in `src/lib/gameCards.ts` (registered, playable). [a1b2c3d]
- [x] Task: Verify asset and cover image existence (all present). [a1b2c3d]
- [x] Task: Measure - User Manual Verification 'Phase 1'

### Phase 1 Results
- **Initial Coverage:** 84.81% overall, 78.14% components, 96.9% lib
- **Lint:** Passes
- **Audit Preliminary:** 16/25 passing, 9 failures identified

## Phase 2: Architecture & Platform Fixes
- [~] Task: Add useGameFullscreen hook integration.
- [~] Task: Convert useInterval game loop to requestAnimationFrame with delta-time clamping.
- [ ] Task: Fix text sizes to ≥ 16px minimum.
- [ ] Task: Fix touch targets to ≥ 44×44px minimum.
- [ ] Task: Measure - User Manual Verification 'Phase 2'

## Phase 3: Input, Accessibility & Data Fixes
- [ ] Task: Add useAccessibilitySettings consumption.
- [ ] Task: Add useCurrentLocale and useSession to page.tsx.
- [ ] Task: Measure - User Manual Verification 'Phase 3'

## Phase 4: Game Systems Fixes
- [ ] Task: Implement standardized calculateEnchantedLibraryXP with 1-10 scale and bonuses.
- [ ] Task: Add off-screen indicators for books when camera is active.
- [ ] Task: Measure - User Manual Verification 'Phase 4'

## Phase 5: Code Quality & Testing Fixes
- [ ] Task: Add tests for RankingDisplay to improve component coverage.
- [ ] Task: Add tests for new fix code.
- [ ] Task: Run full test suite and verify coverage ≥ 80%.
- [ ] Task: Measure - User Manual Verification 'Phase 5'

## Phase 6: Compliance Report
- [ ] Task: Write final compliance report to `report.md`.
- [ ] Task: Update track metadata.json status to completed.
- [ ] Task: Commit all changes with `chore(audit): Enchanted Library compliance audit complete`.
- [ ] Task: Measure - User Manual Verification 'Phase 6'

## Phase 2: Architecture & Platform Audit
- [ ] Task: Verify React-Konva usage in EnchantedLibraryGame.tsx.
- [ ] Task: Verify mobile-first portrait (390×844) responsive scaling.
- [ ] Task: Verify pure state + tick function pattern in enchantedLibrary.ts.
- [ ] Task: Verify requestAnimationFrame with delta-time clamping.
- [ ] Task: Verify useGameFullscreen integration.
- [ ] Task: Measure - User Manual Verification 'Phase 2'

## Phase 3: Input, Accessibility & Data Audit
- [ ] Task: Verify touch targets ≥ 44×44px.
- [ ] Task: Verify text size ≥ 16px.
- [ ] Task: Verify accessibility settings consumption.
- [ ] Task: Verify VocabularyItem[] typing and API route factories.
- [ ] Task: Verify i18n and session hooks in page.tsx.
- [ ] Task: Measure - User Manual Verification 'Phase 3'

## Phase 4: Game Systems Audit
- [ ] Task: Verify XP/scoring 1–10 scale with bonuses.
- [ ] Task: Verify difficulty tiers (easy/medium/hard) with standardized presets.
- [ ] Task: Verify GameStartScreen and GameEndScreen usage.
- [ ] Task: Verify camera system (if applicable) and off-screen indicators.
- [ ] Task: Verify performance: delta-time clamping, no setState in loops.
- [ ] Task: Measure - User Manual Verification 'Phase 4'

## Phase 5: Code Quality & Testing Audit
- [ ] Task: Verify test coverage ≥ 80%.
- [ ] Task: Audit for `any` types and replace with proper types.
- [ ] Task: Audit hook dependency arrays for completeness.
- [ ] Task: Audit for unused variables/imports.
- [ ] Task: Run full test suite and lint after any fixes.
- [ ] Task: Measure - User Manual Verification 'Phase 5'

## Phase 6: Fixes & Regression Testing
- [ ] Task: Fix any failing compliance items from Phases 2–5.
- [ ] Task: Write tests for any new fix code.
- [ ] Task: Run full test suite to confirm no regressions.
- [ ] Task: Verify coverage ≥ 80% post-fix.
- [ ] Task: Measure - User Manual Verification 'Phase 6'

## Phase 7: Compliance Report
- [ ] Task: Write final compliance report to `report.md`.
- [ ] Task: Update track metadata.json status to completed.
- [ ] Task: Commit all changes with `chore(audit): Enchanted Library compliance audit complete`.
- [ ] Task: Measure - User Manual Verification 'Phase 7'
