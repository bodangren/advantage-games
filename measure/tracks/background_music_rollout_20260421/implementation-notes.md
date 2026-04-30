# Background Music Rollout Notes

## Shared Runtime

- Added a route-aware audio provider in `src/hooks/useGameMusic.tsx` and mounted it from `src/app/[locale]/layout.tsx`.
- The provider resolves the active game from the student game route, starts music after the first valid interaction, and stops audio on route change or end-state transitions.
- The controller now keeps a same-source playback lock so loop churn does not re-trigger the game audio path.
- Shared game start/end screens now re-arm or stop playback through the same controller instead of duplicating audio logic in each game.

## Catalog Briefs

- Per-game music briefs are recorded inline in `src/lib/audio/gameMusic.ts` alongside the catalog mapping.
- The catalog covers all 29 playable games from `src/lib/gameCards.ts`.
- Each brief captures fantasy/theme, pacing, tone, musical direction, BPM range, and loop length.

## Generation Tooling

- Added `scripts/generate_game_music_catalog.py` and a local audio venv + requirements file under `tools/audio/`.
- The generator reads the catalog briefs and renders one first-pass loop per playable game into `public/sounds/music/<game-id>.wav`.
- The render path now uses per-game blueprints for mode, chord motion, melody contour, register, and swing so the output is not a single shared harmony template.
- Added style presets and a broader synth library for pads, leads, basses, accents, and drum behaviors so games can diverge in timbre as well as harmony.
- The arrangement layer now varies percussion grids, accent cadence, ostinato behavior, and lead density by style family.
- The arranger now builds section-length harmonic timelines and motif variants instead of replaying the same 1-2 bar phrase through the full file.
- Section transitions now add phrase-end fills, partial dropouts, and cadence changes so 25-35 second renders do not feel like disguised 4-8 second loops.
- Example contrast:
  - `enchanted-library` uses sparse library percussion, celesta/music-box figures, and softer organ support.
  - `paladins-twin-soul` uses brighter arcade lead voicing, denser subdivision, and more aggressive shooter-style drums.

## Asset Status

- Each game now has a generated first-pass `wav` loop in `public/sounds/music/`.
- The runtime still prefers `mp3` first, then the generated `wav`, then the shared `wizard-vs-zombie-theme.wav` fallback.
- This keeps the catalog playable while preserving the future `mp3` export path for each game.
