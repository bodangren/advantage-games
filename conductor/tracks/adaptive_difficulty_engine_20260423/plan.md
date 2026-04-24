# Implementation Plan: Adaptive Difficulty Engine

## Phase 1: Performance Metrics Collection

- [~] Task: Define metrics types and interfaces.
  - [ ] Create `types/adaptive-difficulty.ts` with `PerformanceMetrics`, `ResponseRecord`, and `DifficultyParams` types.
  - [ ] Write unit tests for type construction and validation.
- [ ] Task: Implement `usePerformanceMetrics` hook.
  - [ ] Rolling window of last 20 responses (correctness, time-to-answer, streak).
  - [ ] Composite performance score (0-100) with weighted formula: accuracy 50%, speed 30%, streak 20%.
  - [ ] Expose `recordResponse(correct, timeMs)` and `getScore()` methods.
  - [ ] Write unit tests: accuracy calculation, speed normalization, streak tracking, rolling window eviction.
- [ ] Task: Implement `registerDifficultyParams` registration function.
  - [ ] Games call `registerDifficultyParams(gameId, params)` to declare adjustable parameters with min/max bounds.
  - [ ] Store parameter registry in a module-level Map.
  - [ ] Write unit tests for parameter registration and retrieval.
- [ ] Task: Conductor — User Manual Verification 'Phase 1: Performance Metrics Collection' (Protocol in workflow.md)

## Phase 2: Adjustment Algorithm

- [ ] Task: Implement EMA-based adjustment engine.
  - [ ] Create `lib/adaptive-difficulty/adjustment-engine.ts`.
  - [ ] Exponential moving average with configurable α (default 0.3).
  - [ ] Threshold logic: score > 80 → increase, < 40 → decrease, 40-80 → hold.
  - [ ] Parameter change capped at ±15% per adjustment cycle.
  - [ ] Adjustment cycle triggers every 5 responses.
  - [ ] Write unit tests: EMA smoothing, threshold triggers, rate limiting, cycle counting.
- [ ] Task: Implement parameter modifier.
  - [ ] Given current parameters and performance score, compute adjusted parameters.
  - [ ] Respect min/max bounds from parameter registry.
  - [ ] Return delta (what changed) for UI feedback.
  - [ ] Write unit tests: boundary clamping, direction of change, delta calculation.
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Adjustment Algorithm' (Protocol in workflow.md)

## Phase 3: Game Integration

- [ ] Task: Implement `useAdaptiveDifficulty` hook.
  - [ ] Combines `usePerformanceMetrics` + adjustment engine.
  - [ ] Exposes `recordResponse()`, `getCurrentParams()`, `isEnabled()`.
  - [ ] Accepts `adaptive` boolean prop and `gameId` for parameter lookup.
  - [ ] No-op mode: when `adaptive=false`, `recordResponse()` is a no-op and `getCurrentParams()` returns defaults.
  - [ ] Write unit tests: enabled vs disabled behavior, parameter updates after cycle.
- [ ] Task: Add `adaptive` prop to game canvas component.
  - [ ] Extend `<GameCanvas>` with optional `adaptive` prop (default: false).
  - [ ] Pass adaptive params to game-specific parameter consumers.
  - [ ] Write component tests: prop passthrough, no-op when disabled.
- [ ] Task: Integrate with 2 representative games (e.g., Dragon Flight, Wizard vs Zombie).
  - [ ] Register difficulty parameters for each game.
  - [ ] Wire `useAdaptiveDifficulty` into game loop.
  - [ ] Verify parameter changes are applied smoothly between frames.
  - [ ] Write integration tests for both games.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Game Integration' (Protocol in workflow.md)

## Phase 4: Testing & Calibration

- [ ] Task: Calibration test suite.
  - [ ] Simulate player sessions with known accuracy/speed patterns.
  - [ ] Verify engine converges to flow zone (score 40-80) within 20 responses.
  - [ ] Test edge cases: perfect accuracy, 0% accuracy, all fast, all slow.
  - [ ] Write calibration tests with assertion on convergence.
- [ ] Task: Optional session-start hint persistence.
  - [ ] Save last session's ending parameters to localStorage.
  - [ ] On next session start, load as initial parameters (if available).
  - [ ] Write unit tests for hint save/load and fallback to tier defaults.
- [ ] Task: Performance overhead verification.
  - [ ] Benchmark `recordResponse()` latency — must be <1ms.
  - [ ] Verify no frame drops when adaptive mode is enabled.
- [ ] Task: Conductor — User Manual Verification 'Phase 4: Testing & Calibration' (Protocol in workflow.md)
