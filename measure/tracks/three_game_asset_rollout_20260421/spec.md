# Specification: Three-Game Asset Rollout

## Overview

Create a coordinated art pass for three mature games that still rely on placeholder primitives for core scene rendering:

1. Labyrinth of the Goblin King
2. The Haunted Library
3. Gryphon Patrol

This track covers planning, generation, visual review, and integration of production image assets so the games match the existing house style already established in `public/games/`.

## Problem

These three games are functionally complete enough to benefit from art, but their current playfields and actors still render mainly as flat `Rect`, `Circle`, `Line`, and gradient placeholders. That creates three problems:

1. They look materially less finished than the rest of the catalog.
2. They do not yet participate in the repo's established painterly fantasy visual language.
3. Their pose sheets are an opportunity to standardize a clearer 3x3 grammar for future games.

## Goals

1. Give each game a dedicated production-ready asset set in `public/games/<game-id>/`.
2. Preserve gameplay readability on mobile portrait layouts.
3. Standardize new 3x3 pose sheets to use a consistent row grammar:
   - Row 1: `move`
   - Row 2: `attack`
   - Row 3: `defend`
4. Visually inspect every generated asset before accepting it for wiring.
5. Replace the most obvious placeholder primitives while keeping gameplay logic, hitboxes, and pacing unchanged.

## Visual Direction

- Match the repo's existing fantasy art direction: painterly, luminous, readable, and kid-safe.
- Favor strong silhouettes and broad value separation over busy micro-detail.
- Keep character sprites readable at small on-canvas sizes:
  - Labyrinth: ~28px actors
  - Haunted Library: ~48px actors
  - Gryphon Patrol: ~32-40px actors
- Preserve code-rendered text overlays where readability matters. Assets should not bake in gameplay text labels.

## 3x3 Pose-Sheet Standard

All new 3x3 character sheets produced under this track must follow the same semantic structure even when the exact animation beats differ by game:

- `move` row:
  - neutral / glide / stride
  - locomotion frame A
  - locomotion frame B
- `attack` row:
  - wind-up / aim
  - strike / cast / release
  - recovery / follow-through
- `defend` row:
  - brace / shield-up / dodge-prep
  - block / barrier / evasive peak
  - recover / stunned-guard / landing

For flying units, `defend` may read as evade, barrel-roll, wing-shield, or magical guard, but it must still communicate defense rather than movement or attack.

## Scope

Detailed asset specifications live in [conductor/notes/three-game-asset-rollout.md](/Users/daniel.bodanske/Desktop/advantage-games/advantage-games/conductor/notes/three-game-asset-rollout.md).

### Labyrinth of the Goblin King

Replace flat maze tiles and primitive actor rendering with:

- tiled maze floor and wall art
- readable orb art
- a paladin/player 3x3 sheet
- goblin enemy sheets for `scout`, `warrior`, and `elite`

### The Haunted Library

Replace the flat room, floors, doors, enemies, and player with:

- a full background and/or floor strip treatment that fits the 390x844 portrait stage
- door state sprites
- a player 3x3 sheet
- ghost and bat 3x3 enemy sheets
- trampoline art where it improves readability

### Gryphon Patrol

Replace the gradient sky and primitive air-combat actors with:

- three looping parallax layers
- a gryphon-rider player 3x3 sheet
- an airborne enemy 3x3 sheet
- orb and projectile art suitable for side-scrolling aerial combat

## Functional Requirements

1. Create and maintain a concrete asset brief with filenames, sizing guidance, and prompt constraints for all three games.
2. Generate the required PNG assets and save them into the correct `public/games/<game-id>/` folders.
3. Visually inspect every generated asset after creation and reject/regenerate outputs that do not fit the established style or gameplay readability needs.
4. Wire assets into the game components using existing React-Konva image/sprite patterns already used elsewhere in the repo.
5. Preserve current collision boxes, timing, and gameplay rules unless a visual integration issue forces a tightly scoped adjustment.
6. Add or update tests around asset loading, rendering, and fallback behavior as needed.

## Non-Functional Requirements

1. Mobile-first: all art must remain legible in portrait layouts.
2. Performance-safe: avoid asset dimensions that are unnecessary for the on-screen target size.
3. Transparent backgrounds for character/object sheets unless the asset is explicitly a background/parallax layer.
4. Tileable assets must be seam-safe.
5. New code should meet the project target of >80% coverage for the changed modules.

## Acceptance Criteria

- [ ] A live asset brief exists for all three games with concrete output filenames and visual constraints.
- [ ] `public/games/labyrinth-goblin-king/` contains the required tiles and sprite sheets.
- [ ] `public/games/haunted-library/` contains the required backgrounds, props, and sprite sheets.
- [ ] `public/games/gryphon-patrol/` contains the required parallax layers and sprite sheets.
- [ ] Every new 3x3 character sheet follows the `move` / `attack` / `defend` row convention.
- [ ] Every generated asset has been visually reviewed before wiring.
- [ ] The three games render with production assets instead of core placeholder primitives.
- [ ] Automated tests for affected code pass, and changed modules stay at or above the track coverage target.

## Out of Scope

- New gameplay mechanics or balance changes unrelated to visual integration.
- New cover art, marketing art, or store thumbnails.
- Reworking shared start/end screen UI themes.
- Re-illustrating older games that already have acceptable asset sets.
