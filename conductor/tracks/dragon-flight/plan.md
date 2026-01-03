# Plan: Dragon Flight Track

## Phase 1: Housekeeping & Deployment Prep [checkpoint: 9ecfc83]
- [x] Task: Configure Next.js for static export and add a GitHub Actions workflow to build a static site artifact. [commit: 8b7cbb8, b64facd]
- [x] Task: Add cover-based cards for all upcoming games to the main menu/choice screen using `public/games/cover/`. [commit: 8b7cbb8, b8c981c, b64facd]
- [x] Task: Update Magic Defense asset references to use `public/games/magic-defense/`. [commit: 8b7cbb8, b64facd]
- [x] Task: Add unit/component tests for the main menu card data and asset mapping updates. [commit: 8b7cbb8, b8c981c, b64facd]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Housekeeping & Deployment Prep' (Protocol in workflow.md) [commit: 9ecfc83]

## Phase 2: Dragon Flight Core Logic
- [ ] Task: Define Dragon Flight state/types and gate selection logic (timer, attempts, accuracy, dragon count).
- [ ] Task: Implement boss fight resolution and XP calculation using `src/lib/xp.ts`.
- [ ] Task: Add unit tests for gate selection, dragon count adjustments, boss outcome, and XP output.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dragon Flight Core Logic' (Protocol in workflow.md)

## Phase 3: Dragon Flight UI & Interaction
- [ ] Task: Build the Dragon Flight scene layout (prompt, gates, timer, dragon count).
- [ ] Task: Implement keyboard and touch input with success/failure feedback.
- [ ] Task: Add the boss fight/results screen UI and animation polish (Framer Motion).
- [ ] Task: Add component tests for key UI states (running, boss, results).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dragon Flight UI & Interaction' (Protocol in workflow.md)

## Phase 4: App Integration & Final Polish
- [ ] Task: Add the `/games/dragon-flight` route and integrate with `useGameStore` and XP completion flow.
- [ ] Task: Promote Dragon Flight to a playable card on the main menu once the route is live.
- [ ] Task: Final responsive tuning, accessibility checks, and mobile touch adjustments.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: App Integration & Final Polish' (Protocol in workflow.md)
