# Implementation Plan: Gryphon Patrol

This plan outlines the steps to build "Gryphon Patrol" using **React-Konva (Canvas)** with strict TDD methodology.

---

## Phase 1: Setup & Infrastructure

- [ ] Task: Create configuration file `src/lib/games/gryphonPatrolConfig.ts`.
- [ ] Task: Define game state types and interfaces in `src/lib/games/gryphonPatrol.ts`.
- [ ] Task: Create page route `src/app/[locale]/(student)/student/games/sentence/gryphon-patrol/page.tsx`.
- [ ] Task: Create API routes for sentences and complete.
- [ ] Task: Create `GryphonPatrolGame` container component.

---

## Phase 2: World & Scrolling (TDD)

- [ ] Task: Implement wrap-around coordinate system (0 to mapWidth).
- [ ] Task: Implement player movement with momentum.
- [ ] Task: Implement camera system (scroll map based on player position).
- [ ] Task: Implement mini-map rendering logic.

---

## Phase 3: Enemies & Combat (TDD)

- [ ] Task: Implement enemy spawning across the map.
- [ ] Task: Implement enemy AI (flight patterns).
- [ ] Task: Implement shooting mechanics and collision detection.
- [ ] Task: Implement word orb dropping/collection.

---

## Phase 4: Gameplay Loop & Sequence (TDD)

- [ ] Task: Implement correct word order collection logic.
- [ ] Task: Implement HP, score, and XP calculation.
- [ ] Task: Implement win/lose state transitions.
- [ ] Task: Render parallax background and landscape.

---

## Phase 5: Polish & Fidelity

- [ ] Task: Integrate Virtual DPad for flight.
- [ ] Task: Integrate `GameStartScreen` and `GameEndScreen`.
- [ ] Task: Add sound effects and visual feedback (explosions, sparkles).
- [ ] Task: Final audit against fidelity checklist.

---

## Technical Notes
- Wrap-around logic: `nextX = (x + dx + mapWidth) % mapWidth`.
- Camera center: `cameraX = playerX - gameWidth / 2`.
- Mini-map scale: `gameWidth / mapWidth`.
