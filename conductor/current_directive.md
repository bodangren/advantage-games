# Current Directive

## Status: IN PROGRESS

## Active Track: Difficulty Guardrail Fix

### Issue
- File: `src/lib/games/difficulty.ts`
- extreme tier wordCount.max=12 exceeded DIFFICULTY_GUARDRAILS.maxWordCount=10

### Fix Applied
- Added DIFFICULTY_TIERS compliance test to difficulty.test.ts
- Changed extreme.wordCount.max from 12 to 10
- Tests: 13/13 passing

## Completed Tracks (Recent)
- Difficulty Guardrail Fix (2026-04-13) - FIXED
- Live Content Rotation and Pack Management (2026-04-13) - COMPLETE
- Shared Accessibility and Input Assist Layer (2026-04-11)
- XP Leaderboard & Session History (2026-04-09)
