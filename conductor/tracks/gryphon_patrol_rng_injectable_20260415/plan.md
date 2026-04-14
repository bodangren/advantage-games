# Implementation Plan: Gryphon Patrol RNG Injectable

## Task 1: Refactor Math.random() to Injectable RNG

- [ ] Read GryphonPatrolGame.tsx to identify all Math.random() usages
- [ ] Create rng parameter with default value Math.random
- [ ] Replace all Math.random() calls with rng()
- [ ] Write tests using deterministic mock RNG

## Task 2: Verify

- [ ] Run existing tests to ensure no regression
- [ ] Run full test suite and build
- [ ] Conductor — User Manual Verification