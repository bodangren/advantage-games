# Implementation Plan: Babel Architect Compliance Audit

## Phase 1: Discovery & Baseline
- [x] Task: Read game source files (BabelArchitectGame.tsx, babelArchitect.ts, page.tsx, API routes). **FINDING: No source files exist.**
- [x] Task: Run existing tests and record current coverage. **FINDING: No tests exist. Coverage: 0%.**
- [x] Task: Record lint status. **FINDING: No files to lint.**
- [x] Task: Check game registry entry in `src/lib/gameCards.ts`. **FINDING: Registered as playable with correct metadata.**
- [x] Task: Verify asset and cover image existence. **FINDING: Cover image exists. Game assets directory missing.**
- [x] Task: Measure - User Manual Verification 'Phase 1'

## Phase 2: Architecture & Platform Audit
- [ ] Task: Verify React-Konva usage in BabelArchitectGame.tsx.
- [ ] Task: Verify mobile-first portrait (390×844) responsive scaling.
- [ ] Task: Verify pure state + tick function pattern in babelArchitect.ts.
- [ ] Task: Verify requestAnimationFrame with delta-time clamping.
- [ ] Task: Verify useGameFullscreen integration.
- [ ] Task: Measure - User Manual Verification 'Phase 2'

## Phase 3: Input, Accessibility & Data Audit
- [ ] Task: Verify touch targets ≥ 44×44px.
- [ ] Task: Verify text size ≥ 16px.
- [ ] Task: Verify accessibility settings consumption.
- [ ] Task: Verify SentenceItem[] typing and API route factories.
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
- [ ] Task: Commit all changes with `chore(audit): Babel Architect compliance audit complete`.
- [ ] Task: Measure - User Manual Verification 'Phase 7'
