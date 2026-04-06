# Lessons Learned

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
