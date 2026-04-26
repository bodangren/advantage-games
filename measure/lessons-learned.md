# Lessons Learned

## Track: Babel Architect Compliance Audit (2026-04-26)

### Summary
- Audited Babel Architect against 25 shared game specifications
- Result: 2/25 passing — only gameCards.ts entry and cover image exist
- 23 failures: missing component, logic, page, API routes, tests, and assets
- Full game implementation required to achieve compliance

### Key Learnings
- Compliance audits quickly surface total non-compliance for unimplemented games
- gameCards.ts status 'playable' incorrectly signals readiness when no code exists
- Audit tracks are diagnostic only — implementation requires dedicated build tracks
- Reusable compliance test pattern (babelArchitectCompliance.test.ts) verifies file existence

### Technical Debt Identified
- babel-architect: Complete game implementation missing (component, logic, page, API, tests, assets)

---

## Track: Astral Mage Compliance Audit (2026-04-26)

### Summary
- Audited Astral Mage against 25 shared game specifications
- Result: 0/25 passing — game has zero implementation
- Only artifacts: gameCards.ts entry (status: 'coming-soon'), cover image at wrong path

### Key Learnings
- Compliance audits on unimplemented games surface total non-compliance immediately
- Audit tracks cannot fix missing implementations — dedicated implementation tracks required
- Cover image path mismatch (cover-astral-mage.png vs astral-mage-cover.png) is a minor inconsistency

### Technical Debt Identified
- astral-mage: Complete game implementation missing
- astral-mage: Cover image at wrong filename path

---

## Track: Adaptive Difficulty Engine - Phase 4 (2026-04-25)

### Summary
- Completed calibration test suite with deterministic player session simulation
- Implemented session-start hint persistence with localStorage fallback
- Total: 100 tests across adaptive difficulty modules with 99.1% coverage

### Key Learnings
- Calibration tests should simulate realistic player profiles (accuracy, speed, streak)
- EMA convergence to flow zone depends heavily on player consistency
- Performance benchmarks in Jest need relaxed thresholds (50ms for 1000 ops)