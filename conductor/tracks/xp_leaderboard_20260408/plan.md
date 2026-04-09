# Implementation Plan: XP Leaderboard & Session History

## Phase 1: Storage Layer

- [ ] Task: Define session record schema and localStorage key.
  - [ ] Create `types/leaderboard.ts` with `SessionRecord` and `LeaderboardState` types.
  - [ ] Write unit tests for serialization/deserialization round-trips.
- [ ] Task: Implement `useLeaderboard` hook.
  - [ ] `recordSession(gameId, score, xp, accuracy)` — prepends to history, caps at 20 entries, updates per-game high score.
  - [ ] `clearHistory()` — wipes all leaderboard data from localStorage.
  - [ ] `getLeaderboard()` — returns current state.
  - [ ] Write unit tests covering all three operations and the 20-entry cap.
- [ ] Task: Conductor — User Manual Verification 'Phase 1: Storage Layer' (Protocol in workflow.md)

## Phase 2: Leaderboard Page

- [ ] Task: Create `/leaderboard` route and page component.
  - [ ] Cumulative XP banner at top.
  - [ ] Per-game best score table (game name, best score, best XP, last played).
  - [ ] Recent sessions list (last 20 rows: date, game, score, XP, accuracy).
  - [ ] "Clear History" button with confirmation dialog.
- [ ] Task: Write component tests for leaderboard page.
  - [ ] Empty-state render (no sessions yet).
  - [ ] Populated-state render with fixture data.
  - [ ] Clear history flow.
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Leaderboard Page' (Protocol in workflow.md)

## Phase 3: End-Screen Integration

- [ ] Task: Wire `useLeaderboard.recordSession` into shared end-screen component.
  - [ ] Call `recordSession` after XP animation completes.
  - [ ] Add "View Leaderboard" link button on end screen.
- [ ] Task: Regression-test two representative end screens.
  - [ ] Confirm existing XP award flow is unaffected.
  - [ ] Confirm session is written to localStorage.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: End-Screen Integration' (Protocol in workflow.md)
