# Lessons Learned

## Track: Unified Difficulty Curves and Spawn Tuning (2026-04-07)

### Summary
- Created shared difficulty model with canonical types and guardrails
- Inventory matrix captured across 25+ vocabulary and sentence games
- Published tuning playbook for future game development

### Successes
- Phase 1: Mapped difficulty knobs across all game types (speed, spawn, HP, timers)
- Phase 2: Created reusable difficulty.ts module with guardrail validation
- Published tuning_playbook.md for future tracks

### Key Findings
- Most games already follow easy/normal/hard/extreme pattern
- Guardrails needed: minSpawnInterval 500ms, maxSpeed 200px/s, maxWordCount 10
- Some games (devourerSlime) use non-standard difficulty levels (easy/medium/hard)

### Technical Debt Resolved
- None - this was new infrastructure work

---

## Track: QA/QC COMPLETE (2026-04-07)

### Summary
- All 26 games QA'd: 25 implemented + 1 skipped (squires-gauntlet)
- All E2E tests passing, all builds successful
- Screenshots captured for all implemented games
- Tech debt documented for future fixes

---

## Track: QA/QC Phase 20-26 - Autonomous Completion (2026-04-07)

### Successes
- Completed 7 phases autonomously in single run (Phases 20-26)
- All E2E tests passing for 6 implemented games
- All builds successful
- Screenshots captured for: realm-carver, rune-forge-chamber, shadow-gate-dungeon, spellweavers-run, storm-castle-tower, village-guardian

### Coverage Results
- realm-carver: 75.51% (below threshold, documented in tech-debt)
- rune-forge-chamber: 99.14% (exceeds threshold)
- shadow-gate-dungeon: 98.72% (exceeds threshold)
- spellweavers-run: 100% (exceeds threshold)
- storm-castle-tower: 95.52% (exceeds threshold)
- village-guardian: 97.04% (exceeds threshold)

### Challenges
- squires-gauntlet not implemented - only empty placeholder directory exists
- Mock API response format varies between games (some expect vocabulary, some expect sentences)

### Technical Debt Identified
- realm-carver: 75.51% coverage below 80% threshold (GameEndScreen, VirtualDPad, useSound not fully tested)
- realm-carver: TypeScript `any` usage in Konva mock (test files)

---

## Track: QA/QC Phase 19 - Potion Rush (2026-04-06)

### Successes
- Unit tests: 29 passed, 92.46% coverage exceeds 80% threshold.
- Fixed unused import `PotionRushGameResult` in page.tsx.
- E2E tests created and passing for both normal load and insufficient sentences warning.

### Challenges
- Build errors from missing `export const dynamic = "force-static"` in griffin-riders-escape and devourer-slime API routes.
- Potion-rush GameStartScreen uses "Start Brewing" button text, not generic "Start Game".

### Technical Debt Identified
- Pre-existing: Missing `dynamic = "force-static"` exports in multiple API routes (griffin-riders-escape, devourer-slime).

### Future Improvements
- Fix remaining API routes missing `export const dynamic` for `output: export` compatibility.

---

## Track: Mobile Performance Hardening Pass (2026-04-08)

### Summary
- Phase 1 complete: Baseline performance profile captured with hotspots identified
- Phase 2 started: Key remediations implemented (VirtualDPad, WizardZombieGame, DungeonLiberatorGame)

### Hotspots Identified
- Math.random() in Layer render causing re-renders (WizardZombieGame)
- VirtualDPad re-renders on touch move (missing memoization)
- DOM-based indicators using left/top positioning (causing layout reflow)
- Multiple setState calls in game loops

### Remediations Applied
- VirtualDPad: memo component, useCallback handlers, ref-based onInput callback
- WizardZombieGame: Pre-computed screen shake offset (deterministic, not random per frame)
- DungeonLiberatorGame: CSS transform-only positioning, useMemo for indicators

### Key Learnings
- CSS transform is compositor-only; left/top causes layout reflow
- useMemo prevents recalculation of expensive derived state
- memo() on frequently re-rendered components reduces unnecessary renders
- Math.random() in render = re-render on every frame
