# Implementation Plan: Realm Carver

This plan outlines the steps to build "Realm Carver" using **React-Konva (Canvas)** with strict TDD methodology.

---

## Phase 1: Setup & Infrastructure

- [ ] Task: Create configuration file `src/lib/games/realmCarverConfig.ts`.
- [ ] Task: Define game state types and interfaces in `src/lib/games/realmCarver.ts`.
- [ ] Task: Create page route `src/app/[locale]/(student)/student/games/sentence/realm-carver/page.tsx`.
- [ ] Task: Create API routes for sentences and complete.
- [ ] Task: Create `RealmCarverGame` container component.

---

## Phase 2: Grid & Territory Logic (TDD)

- [ ] Task: Implement grid initialization (100x100 occupancy map).
- [ ] Task: Implement player movement on claimed cells.
- [ ] Task: Implement trail drawing on wild cells.
- [ ] Task: Implement territory filling algorithm (Flood fill or Scanline).
- [ ] Task: Implement word containment check (is word inside new territory?).

---

## Phase 3: Core Gameplay (TDD)

- [ ] Task: Implement bouncing monsters logic.
- [ ] Task: Implement trail-monster collision detection.
- [ ] Task: Implement word collection in correct sentence sequence.
- [ ] Task: Implement HP and damage system.
- [ ] Task: Implement win/lose state transitions.

---

## Phase 4: Rendering

- [ ] Task: Render map grid with different colors for claimed/wild/trail.
- [ ] Task: Render player and trail line.
- [ ] Task: Render monsters (floating orbs or sparks).
- [ ] Task: Render words as floating runes.
- [ ] Task: Render HUD (HP, Sentence Progress).

---

## Phase 5: Input & Polish

- [ ] Task: Integrate Virtual DPad for movement.
- [ ] Task: Integrate `GameStartScreen` and `GameEndScreen`.
- [ ] Task: Add sound effects and visual feedback.
- [ ] Task: Final audit against fidelity checklist.

---

## Technical Notes
- Flood fill algorithm must be optimized for performance (60 FPS loop).
- Grid coordinates to screen coordinates mapping is critical.
- Use `requestAnimationFrame` for smooth trail rendering.
