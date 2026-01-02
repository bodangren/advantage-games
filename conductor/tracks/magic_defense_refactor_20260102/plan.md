# Plan: Magic Defense Refactor

## Phase 1: Structural Refactor
- [x] Task: Create `src/app/games/magic-defense` and move game components [commit: 6ec4b3a]
- [ ] Task: Create Main Menu page with navigation to Magic Defense
- [ ] Task: Update `useGameStore` to support game resets and navigation
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Structural Refactor' (Protocol in workflow.md)

## Phase 2: RPG Theming and Assets
- [ ] Task: Update GameEngine to render Castles (Health) and Magician avatar
- [ ] Task: Replace Missile component with "Enemy" component (Skull/Meteor visual)
- [ ] Task: Implement explosion animations using Framer Motion
- [ ] Task: Conductor - User Manual Verification 'Phase 2: RPG Theming and Assets' (Protocol in workflow.md)

## Phase 3: Tuning and Logic
- [ ] Task: Tune difficulty: Slower initial spawn rate (5000ms) and longer fall duration (15s)
- [ ] Task: Implement new XP formula: `(Score / 10) * Accuracy`
- [ ] Task: Implement HUD for Score and Accuracy
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Tuning and Logic' (Protocol in workflow.md)
