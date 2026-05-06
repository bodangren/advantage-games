# Implementation Plan: Three-Game Asset Rollout

## Phase 1: Asset Brief and Prompt Package

- [x] Task: Audit the current render trees and target sprite sizes for all three games.
  - [x] Confirm the on-canvas target sizes and cropping expectations for Labyrinth of the Goblin King, The Haunted Library, and Gryphon Patrol.
  - [x] Identify which placeholder primitives should remain code-rendered for readability or simplicity.
- [x] Task: Publish the detailed asset brief in `conductor/notes/three-game-asset-rollout.md`.
  - [x] Finalize filenames, asset types, and target dimensions.
  - [x] Lock the shared 3x3 `move` / `attack` / `defend` row grammar.
  - [x] Capture the visual-review checklist for generated outputs.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Asset Brief' (Protocol in workflow.md)

## Phase 2: Labyrinth of the Goblin King Assets

- [x] Task: Create the Labyrinth asset set in `public/games/sentence/labyrinth-goblin-king/`.
  - [x] Generate and visually review `maze-floor-tile.png`.
  - [x] Generate and visually review `maze-wall-tile.png`.
  - [x] Generate and visually review `word-orb.png`.
  - [x] Generate and visually review `paladin_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_scout_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_warrior_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_elite_3x3_pose_sheet.png`.
- [x] Task: Wire the Labyrinth assets into `LabyrinthGoblinKingGame.tsx`.
  - [x] Replace wall/floor rectangles with tile images where appropriate.
  - [x] Replace player, goblin, and orb placeholder shapes with image-backed rendering.
  - [x] Keep word labels and heroic-aura HUD/readability cues code-rendered if that remains clearer.
- [x] Task: Add or update automated tests for Labyrinth asset loading/rendering.
  - [x] Added KonvaImage mock to test file for compatibility.
  - [x] Build succeeds; pre-existing page.test.tsx failures unrelated.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Labyrinth Assets' (Protocol in workflow.md)

## Phase 3: The Haunted Library Assets

- [x] Task: Create the Haunted Library asset set in `public/games/sentence/haunted-library/`.
  - [x] Generate and visually review `library-background.png`.
  - [x] Generate and visually review `floor-strip.png`.
  - [x] Generate and visually review `trampoline.png`.
  - [x] Generate and visually review `door-closed.png`.
  - [x] Generate and visually review `door-open-correct.png`.
  - [x] Generate and visually review `door-open-trap.png`.
  - [x] Generate and visually review `player_3x3_pose_sheet.png`.
  - [x] Generate and visually review `ghost_3x3_pose_sheet.png`.
  - [x] Generate and visually review `bat_3x3_pose_sheet.png`.
- [x] Task: Wire the Haunted Library assets into `HauntedLibraryGame.tsx`.
  - [x] Replace the flat background and floor rendering with production art.
  - [x] Replace door, player, ghost, and bat placeholder primitives with image-backed rendering.
  - [x] Preserve gameplay word rendering on opened doors.
- [x] Task: Add or update automated tests for Haunted Library asset loading/rendering.
  - [x] Added KonvaImage mock to test file for compatibility.
  - [x] Build succeeds; pre-existing page.test.tsx failures unrelated.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Haunted Library Assets' (Protocol in workflow.md)

## Phase 4: Gryphon Patrol Assets

- [ ] Task: Create the Gryphon Patrol asset set in `public/games/sentence/gryphon-patrol/`.
  - [ ] Generate and visually review `parallax-top-tiling.png`.
  - [ ] Generate and visually review `parallax-middle-tiling.png`.
  - [ ] Generate and visually review `parallax-bottom-tiling.png`.
  - [ ] Generate and visually review `player_gryphon_rider_3x3_pose_sheet.png`.
  - [ ] Generate and visually review `sky_raider_3x3_pose_sheet.png`.
  - [ ] Generate and visually review `word-orb.png`.
  - [ ] Generate and visually review `feather-bolt.png`.
- [ ] Task: Wire the Gryphon Patrol assets into `GryphonPatrolGame.tsx`.
  - [ ] Replace the placeholder sky/landscape treatment with looping parallax art.
  - [ ] Replace player, enemy, orb, and projectile primitives with image-backed rendering.
  - [ ] Keep HUD and minimap elements code-rendered unless art materially improves them.
- [ ] Task: Add or update automated tests for Gryphon Patrol asset loading/rendering.
  - [ ] Cover parallax/image-loading success and safe fallback behavior where needed.
  - [ ] Run the targeted Gryphon Patrol test suite and coverage command.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Gryphon Patrol Assets' (Protocol in workflow.md)

## Phase 5: Shared Verification and Cleanup

- [ ] Task: Consolidate shared image/sprite loading helpers if duplicate wiring code emerges.
  - [ ] Reuse existing loader patterns from image-backed games where possible.
  - [ ] Avoid introducing a new abstraction unless at least two games benefit clearly.
- [ ] Task: Perform final cross-game visual QA.
  - [ ] Confirm every accepted generation was visually inspected before integration.
  - [ ] Confirm pose-sheet row semantics are consistent across all newly generated character sheets.
  - [ ] Capture any rejected-generation notes or follow-up fixes in the asset brief.
- [ ] Task: Run final automated verification.
  - [ ] Run targeted tests for all three games with `CI=true`.
  - [ ] Run any affected lint/build checks required by the changed code paths.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final QA' (Protocol in workflow.md)
