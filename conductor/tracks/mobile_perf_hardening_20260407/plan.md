# Implementation Plan: Mobile Performance Hardening Pass

## Phase 1: Measure and Prioritize

- [ ] Task: Capture baseline performance traces for active games.
  - [ ] Record frame-time behavior for representative sessions.
  - [ ] Identify top hotspots by frequency and impact.
- [ ] Task: Define optimization targets and budgets.
  - [ ] Set acceptable frame-time thresholds.
  - [ ] Set memory allocation guardrails.
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

