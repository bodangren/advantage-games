# Implementation Plan: Griffin Rider's Escape

A Subway Surfers-style 3D endless runner sentence game with lane switching and gate collection.

## Phase 1: Foundation & Scaffolding [ ]
- [ ] Initialize track in `conductor/tracks.md`
- [ ] Create directory structure:
  - `src/app/[locale]/(student)/student/games/sentence/griffin-riders-escape/`
  - `src/components/games/sentence/griffin-riders-escape/`
  - `src/lib/games/`
  - `src/app/api/v1/games/griffin-riders-escape/`
- [ ] Scaffold files from templates:
  - [ ] `src/lib/games/griffinRidersEscape.ts` (Logic)
  - [ ] `src/components/games/sentence/griffin-riders-escape/GriffinRidersEscapeGame.tsx` (Component)
  - [ ] `src/app/[locale]/(student)/student/games/sentence/griffin-riders-escape/page.tsx` (Page)
  - [ ] API routes (sentences, complete)
- [ ] Add translations to `src/locales/en.ts`

## Phase 2: Core Game Logic (TDD) [ ]
- [ ] Define types: `GriffinRiderState`, `Gate`, `Obstacle`, `Lane`
- [ ] Implement `createGriffinRidersEscapeState(vocabulary, config)`
- [ ] Implement pseudo-3D math (scaling and projection)
- [ ] Implement `tickGriffinRidersEscape(state, delta)`
  - [ ] Object movement (forward/Z-depth)
  - [ ] Spawn logic for gates and obstacles
  - [ ] Collision detection (gates and obstacles)
- [ ] Implement `switchLane(state, direction)`
- [ ] Write unit tests for all logic functions in `src/lib/games/griffinRidersEscape.test.ts`
- [ ] **Verification:** `npm test griffinRidersEscape.test.ts` passes with >80% coverage

## Phase 3: Canvas Implementation & Visuals [ ]
- [ ] Implement `GriffinRidersEscapeGame` component using `React-Konva`
- [ ] Integrate `useGameLoop` and `useDirectionalInput` (lane switching)
- [ ] Render 3D environment:
  - [ ] Parallax cloud background
  - [ ] Flying Griffin (animated)
  - [ ] Magical gates with scaling/perspective
  - [ ] Obstacles (Storm clouds)
- [ ] Implement lane switching animations (interpolation)
- [ ] Add UI overlays: Translation banner, Health (Hearts), Progress, XP
- [ ] **Verification:** Manual check of rendering and lane switching

## Phase 4: Educational Mechanics & Polish [ ]
- [ ] Implement gate word assignment logic (correct word in sequence + decoys)
- [ ] Implement feedback effects:
  - [ ] Correct word: Sparkles, speed surge, chime
  - [ ] Collision/Wrong word: Screen shake, red flash, heart loss
- [ ] Implement difficulty scaling (speed, obstacle frequency)
- [ ] Integrate shared `GameStartScreen` and `GameEndScreen`
- [ ] **Verification:** Complete 3 full game sessions on different difficulties

## Phase 5: Final Integration & Cleanup [ ]
- [ ] Register game in `src/app/[locale]/(student)/student/games/page.tsx`
- [ ] Create cover image `public/games/cover/griffin-riders-escape-cover.png`
- [ ] Final build check: `npm run build`
- [ ] Conductor sync: Mark track completed and move to archive
