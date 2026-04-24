# Implementation Plan: Adaptive Difficulty Engine

## Phase 1: Performance Metrics Collection [checkpoint: c54a982]

- [x] Task: Define metrics types and interfaces. [af8b127]
  - [x] Create `types/adaptive-difficulty.ts` with `PerformanceMetrics`, `ResponseRecord`, and `DifficultyParams` types.
  - [x] Write unit tests for type construction and validation.
- [x] Task: Implement `usePerformanceMetrics` hook. [05e4c0d]
  - [x] Rolling window of last 20 responses (correctness, time-to-answer, streak).
  - [x] Composite performance score (0-100) with weighted formula: accuracy 50%, speed 30%, streak 20%.
  - [x] Expose `recordResponse(correct, timeMs)` and `getScore()` methods.
  - [x] Write unit tests: accuracy calculation, speed normalization, streak tracking, rolling window eviction.
- [x] Task: Implement `registerDifficultyParams` registration function. [c54a982]
  - [x] Games call `registerDifficultyParams(gameId, params)` to declare adjustable parameters with min/max bounds.
  - [x] Store parameter registry in a module-level Map.
  - [x] Write unit tests for parameter registration and retrieval.
- [x] Task: Conductor — User Manual Verification 'Phase 1: Performance Metrics Collection' (Protocol in workflow.md)

## Phase 2: Adjustment Algorithm [checkpoint: 272f8e9]

- [x] Task: Implement EMA-based adjustment engine. [272f8e9]
  - [x] Create `lib/adaptive-difficulty/adjustment-engine.ts`.
  - [x] Exponential moving average with configurable α (default 0.3).
  - [x] Threshold logic: score > 80 → increase, < 40 → decrease, 40-80 → hold.
  - [x] Parameter change capped at ±15% per adjustment cycle.
  - [x] Adjustment cycle triggers every 5 responses.
  - [x] Write unit tests: EMA smoothing, threshold triggers, rate limiting, cycle counting.
- [x] Task: Implement parameter modifier.
  - [x] Given current parameters and performance score, compute adjusted parameters.
  - [x] Respect min/max bounds from parameter registry.
  - [x] Return delta (what changed) for UI feedback.
  - [x] Write unit tests: boundary clamping, direction of change, delta calculation.
- [x] Task: Conductor — User Manual Verification 'Phase 2: Adjustment Algorithm' (Protocol in workflow.md)

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
