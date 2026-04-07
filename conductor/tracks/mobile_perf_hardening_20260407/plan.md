# Implementation Plan: Mobile Performance Hardening Pass

## Phase 1: Measure and Prioritize

- [x] Task: Capture baseline performance traces for active games.
  - [x] Record frame-time behavior for representative sessions.
  - [x] Identify top hotspots by frequency and impact.
- [x] Task: Define optimization targets and budgets.
  - [x] Set acceptable frame-time thresholds.
  - [x] Set memory allocation guardrails.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Measure and Prioritize' (Protocol in workflow.md)

## Phase 2: Optimize and Verify

- [ ] Task: Implement hotspot remediations.
  - [ ] Reduce render/update loop overhead.
  - [ ] Remove avoidable allocations on hot paths.
- [ ] Task: Add/extend performance regression checks.
  - [ ] Add targeted tests or diagnostics assertions.
  - [ ] Run targeted suites and smoke verification.
- [ ] Task: Publish before/after performance notes.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Optimize and Verify' (Protocol in workflow.md)

