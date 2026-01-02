# Spec: Magic Defense Refactor

## Overview
Transform the prototype into "Magic Defense," an RPG-themed typing game where a magician protects castles from falling monsters/dark spells. Restructure the app to support multiple games.

## Requirements

### Project Structure
- **Multi-game Architecture:**
    - Move current game logic to `src/app/games/magic-defense/`.
    - Create a Main Menu at `src/app/page.tsx` with navigation to the game.

### Theme & Assets (RPG Style)
- **Visuals:** Use Lucide icons and Tailwind/CSS to create:
    - **Castles:** Represent player health (3 Castles = 3 Lives).
    - **Enemies:** Skulls, Bombs, or Meteors (replaces Missiles).
    - **Magician:** Central avatar casting spells.
- **Feedback:**
    - **Explosions:** Visual particle/scaling effect when words are typed correctly.
    - **Damage:** Castles fade out/burn when enemies hit the "ground" (no shoot line).

### Gameplay Tuning
- **Speed:** Drastically reduce initial spawn rate (e.g., 5s) and fall speed (e.g., 15s duration) for beginners.
- **XP Calculation:** `(Score / 10) * Accuracy`.
- **HUD:**
    - Display Score prominently.
    - Display Accuracy.
    - Visual Health (The Castles themselves).

## Technical Details
- **Libraries:** Continue using `framer-motion` for animations and `lucide-react` for icons.
- **State:** Ensure `useGameStore` resets correctly when entering/leaving the game.
