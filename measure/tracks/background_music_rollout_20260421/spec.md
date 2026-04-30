# Background Music Rollout

## Overview

Add original background music to every playable game in the catalog and wire those tracks into the runtime so music plays by default during normal gameplay. The rollout must be done game by game: investigate each game's fantasy, pacing, and interaction loop, compose a bespoke loop, export a shipped audio asset, and integrate it through a shared playback system instead of ad hoc per-game audio code.

Current catalog scope is the 29 playable games listed in [`src/lib/gameCards.ts`](../../../src/lib/gameCards.ts):

- `castle-defense`
- `dragon-rider`
- `magic-defense`
- `rpg-battle`
- `dragon-flight`
- `wizard-vs-zombie`
- `enchanted-library`
- `rune-match`
- `alchemists-synthesis`
- `potion-rush`
- `dungeon-liberator`
- `spellweavers-run`
- `shadow-gate-dungeon`
- `rune-forge-chamber`
- `village-guardian`
- `labyrinth-goblin-king`
- `abyssal-well`
- `archers-revenge`
- `storm-castle-tower`
- `griffin-sky-joust`
- `realm-carver`
- `paladins-twin-soul`
- `griffin-riders-escape`
- `astral-mage`
- `devourer-slime`
- `babel-architect`
- `sorcerer-ziggurat`
- `haunted-library`
- `gryphon-patrol`

## Functional Requirements

### 1. Shared Music System

- Create a shared background music runtime for games rather than hardcoding playback logic per component.
- The shared runtime must support:
  - per-game track selection
  - looped playback
  - browser-safe startup after the first valid user gesture
  - teardown/cleanup when the user leaves the game
  - coexistence with existing short sound effects
  - format flexibility so the asset layer is not locked to one extension forever
- The system must be usable by both vocabulary and sentence games.

### 2. Per-Game Research Workflow

- Every playable game must receive an individual music brief before composition.
- Each brief must be based on actual code/art review, not title-only guessing.
- Each brief must capture at minimum:
  - game fantasy/theme
  - pacing and pressure level
  - success/failure emotional tone
  - musical direction, BPM range, palette, and loop length
- The briefing work must be recorded in track artifacts or implementation notes so the reasoning is auditable.

### 3. Per-Game Music Creation

- Compose one original looping background track for each game.
- Export a shippable audio asset for each game as `mp3`.
- File naming and placement must follow a consistent convention under `public/sounds` or another shared public audio directory.
- The first shipped version for each game should be good enough to audition in-browser and revise later without changing integration architecture.

### 4. Runtime Integration

- Each game must be wired to start its assigned music by default during normal play.
- "By default" must respect browser autoplay policy:
  - if a game has a start button or other initial interaction, music should begin after that gesture
  - if a game enters gameplay only after user interaction elsewhere on the page, playback can begin at that first allowed point
- Music must stop or pause when the game session ends, unmounts, or the user navigates away.
- Existing SFX behavior must not regress.

### 5. Verification

- Add or update tests for the shared music layer and integration points.
- Perform manual verification across the game catalog to confirm:
  - the correct track loads
  - looping is seamless enough for first-pass production use
  - music starts in a browser-safe way
  - music does not continue leaking across route changes or repeated restarts

## Non-Functional Requirements

- Mobile-safe behavior is required because the project is mobile-first.
- The implementation should minimize duplicated audio logic across game components.
- The shared system should make later track replacement straightforward without component rewrites.
- Asset sizing should remain reasonable for web delivery.
- The rollout should preserve the option to add mute/volume preferences later without redesigning the whole system.

## Acceptance Criteria

- A new Conductor track exists that covers research, composition, export, integration, and verification for all 29 playable games.
- A shared background music mechanism exists and is used by the rollout.
- Every playable game has a mapped music asset and default playback path.
- All shipped tracks are original and intentionally matched to the individual game's theme and pacing.
- Shared music behavior is covered by automated tests and catalog-level manual verification.
- Existing sound-effect usage through the current audio hook continues to work.

## Out Of Scope

- Voice acting, narration, or spoken tutorials
- Dynamic adaptive music with layered stems that react to game state in real time
- A full end-user audio settings UI, unless required to keep the shared runtime viable
- Replacing all existing SFX assets
- Non-playable or future game entries that are not in the current catalog
