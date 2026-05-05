# Implementation Plan: Background Music Rollout

## Phase 1: Shared Audio Foundation

- [x] Task: Audit current audio architecture and define the rollout contract
    - [x] Inventory all current music/SFX usage, entry points, and existing `useSound` assumptions
    - [x] Document autoplay-policy constraints and the default-start rules the shared music system must obey
    - [x] Produce the per-game research template that will be reused for all 29 titles
- [x] Task: Write tests for shared background music playback behavior
    - [x] Add failing tests for track selection, loop configuration, cleanup, and browser-safe startup timing
    - [x] Add failing tests covering interaction with existing short-form SFX playback
    - [x] Confirm the new tests fail before implementation
- [x] Task: Implement shared background music infrastructure
    - [x] Build a shared runtime or hook for game music playback with per-game asset mapping
    - [x] Support extension-aware asset resolution so shipped tracks are not hardcoded to the old SFX-only `mp3` path assumptions
    - [x] Integrate lifecycle cleanup for restart, unmount, and route transitions
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Audio Foundation' (Protocol in workflow.md)

## Phase 2: Vocabulary Game Music Pass

- [x] Task: Investigate, score, export, and wire core vocabulary fantasy games
    - [x] `wizard-vs-zombie`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `enchanted-library`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `rune-match`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `magic-defense`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `rpg-battle`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [x] Task: Investigate, score, export, and wire advanced vocabulary action games
    - [x] `dragon-flight`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `dragon-rider`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `archers-revenge`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `paladins-twin-soul`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [x] `alchemists-synthesis`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [x] Task: Conductor - User Manual Verification 'Phase 2: Vocabulary Game Music Pass' (Protocol in workflow.md)

## Phase 3: Sentence Strategy and Arena Music Pass

- [ ] Task: Investigate, score, export, and wire defense, maze, and survival sentence games
    - [ ] `castle-defense`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `dungeon-liberator`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `shadow-gate-dungeon`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `labyrinth-goblin-king`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `haunted-library`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `devourer-slime`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [ ] Task: Investigate, score, export, and wire sentence territory and construction games
    - [ ] `village-guardian`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `rune-forge-chamber`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `realm-carver`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `babel-architect`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `sorcerer-ziggurat`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Sentence Strategy and Arena Music Pass' (Protocol in workflow.md)

## Phase 4: Sentence Movement and Action Music Pass

- [ ] Task: Investigate, score, export, and wire runner, climbing, and shop-flow games
    - [ ] `potion-rush`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `spellweavers-run`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `storm-castle-tower`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `griffin-riders-escape`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `griffin-sky-joust`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [ ] Task: Investigate, score, export, and wire flight and cosmic sentence games
    - [ ] `gryphon-patrol`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `abyssal-well`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
    - [ ] `astral-mage`: investigate theme/pacing, create brief, export `mp3`, integrate default playback, verify
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Sentence Movement and Action Music Pass' (Protocol in workflow.md)

## Phase 5: Catalog QA and Rollout Hardening

- [ ] Task: Add automated regression coverage for catalog-wide music integration
    - [ ] Add or update tests around shared asset mapping and representative game integration points
    - [ ] Verify no regressions to existing `useSound`-driven effects
    - [ ] Confirm coverage remains above threshold for newly introduced audio modules
- [ ] Task: Execute full manual music verification across the playable catalog
    - [ ] Run the catalog verification matrix against all 29 games
    - [ ] Confirm track/theme fit, startup behavior, loop behavior, and cleanup behavior for each game
    - [ ] Capture follow-up notes for any track requiring a second composition pass
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Catalog QA and Rollout Hardening' (Protocol in workflow.md)
