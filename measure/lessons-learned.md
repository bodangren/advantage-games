# Lessons Learned

## Track: Devourer Slime Compliance Audit (2026-04-26)

### Summary
- Audited devourer-slime against 25 shared game specifications
- Result: 21/25 passing, 3 failed, 1 N/A
- Fixes: GameStartScreen/GameEndScreen integration, calculateXP, useAccessibilitySettings, off-screen indicators, i18n/session hooks
- Final coverage: 92.66% overall (component 88.86%, logic 97.9%)

### Key Learnings
- E2E test mocks must match API route factory output shape (sentences, not vocabulary)
- GameStartScreen overlay covers full viewport but Header text remains visible above it
- Off-screen indicators only needed for target orb (next word), not all entities
- Shared calculateXP normalizes scores to 1-10 scale consistently across games

### Technical Debt Resolved
- devourer-slime: Missing GameStartScreen/GameEndScreen
- devourer-slime: Raw score XP replaced with shared calculateXP
- devourer-slime: Missing accessibility settings hook
- devourer-slime: E2E mock API returned wrong key (vocabulary → sentences)

---

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

## Track: Griffin Riders Escape Compliance Audit (2026-04-26)

### Summary
- Audited griffin-riders-escape against 25 shared game specifications
- Result: 24/25 passing after fixes (14 passing at start, 11 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, cover image
- Final coverage: 87.99% overall (logic 98.44%, component 79.11%)

### Key Learnings
- Game loops should avoid `gameState` in effect deps; use functional setState or refs
- `useGameFullscreen` integration pattern: enter on 'playing', exit on 'ended'/'start'
- Accessibility text scaling via `getEffectiveTextSize(base)` preserves base layout
- Difficulty naming inconsistency (`normal` vs `medium`) is easy to miss in config objects
- Cover image absence is a common compliance gap for games with existing assets

### Technical Debt Resolved
- griffin-riders-escape: Missing useGameFullscreen hook
- griffin-riders-escape: Missing useAccessibilitySettings hook
- griffin-riders-escape: text-xs labels below 16px minimum
- griffin-riders-escape: calculateXP not on 1-10 scale (added game-specific function)
- griffin-riders-escape: difficulty 'normal' instead of 'medium'
- griffin-riders-escape: ESLint hook dependency warnings
- griffin-riders-escape: Missing i18n/session hooks in page.tsx
- griffin-riders-escape: Missing cover image

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
