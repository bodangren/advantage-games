# Plan: Enchanted Library - Primary School Vocabulary Game

## Pre-Implementation Checklist

Before starting ANY phase, the implementer MUST:
1. Read `spec.md` in this directory completely
2. Review `src/lib/wizardZombie.ts` to understand the existing game architecture
3. Review `src/components/wizard-vs-zombie/WizardZombieGame.tsx` for component patterns
4. Understand the vocabulary learning flow from the Wizard vs Zombie game

---

## Phase 1: Core Game Logic and State Management

### Task 1.1: Create enchanted library game state module
- [x] Sub-task: Write tests for `createEnchantedLibraryState(vocabulary)` in `src/lib/enchantedLibrary.test.ts`
  - Test: Initializes with correct starting mana (50)
  - Test: Creates 4 books (1 correct, 3 decoys)
  - Test: Sets up vocabulary tracking (collect each word 2x)
  - Test: Initializes with 3 shield charges
  - Test: Player spawns at center (400, 300)
- [x] Sub-task: Create `src/lib/enchantedLibrary.ts` with state interface:
  ```typescript
  interface EnchantedLibraryState {
    status: 'playing' | 'gameover' | 'victory'
    player: Player  // position, shield charges, shield active status
    spirits: Spirit[]  // position, velocity, bounced flag
    books: Book[]  // position, word, translation, is correct
    targetWord: string
    mana: number  // serves as score
    vocabularyProgress: Map<string, number>  // word -> times collected correctly
    totalWords: number
    shieldActive: boolean
    shieldTimer: number  // countdown in ms
    gameTime: number
    spiritSpawnTimer: number
    spiritSpeed: number  // increases over time
  }
  ```
- [x] Sub-task: Implement `createEnchantedLibraryState()`
- [x] Sub-task: Run tests: `CI=true npm test src/lib/enchantedLibrary.test.ts` 24fb50b

**Verification**: All tests pass. ✅

### Task 1.2: Implement spirit spawning and movement
- [x] Sub-task: Write tests for `spawnSpirit(state)` function
  - Test: Spawns from random wall position
  - Test: Calculates point ahead of player trajectory
  - Test: Creates straight-line velocity vector through that point
  - Test: Only spawns one spirit at a time
  - Test: Respects spawn timer
- [x] Sub-task: Implement `spawnSpirit()` with predictive targeting:
  ```typescript
  // Calculate predicted player position
  const predictAhead = 100  // pixels
  const predictedPos = {
    x: player.x + (player.velocityX * predictAhead),
    y: player.y + (player.velocityY * predictAhead)
  }
  // Calculate straight line from spawn to predicted position
  ```
- [x] Sub-task: Write tests for `updateSpirits(state)`
  - Test: Spirits move along velocity vector
  - Test: Spirits despawn when exiting game bounds
  - Test: Spirit speed increases over time
- [x] Sub-task: Implement `updateSpirits()`
- [x] Sub-task: Run tests 76eac08

**Verification**: All tests pass. ✅

### Task 1.3: Implement main game loop
- [ ] Sub-task: Write tests for `advanceEnchantedLibraryTime(state, input, dt)`
  - Test: Updates player position based on input
  - Test: Clamps player to boundaries
  - Test: Updates spirits
  - Test: Spawns new spirit when timer expires and no spirit active
  - Test: Increments spirit speed over time
- [ ] Sub-task: Implement `advanceEnchantedLibraryTime()`
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Core Game Logic and State Management' (Protocol in workflow.md)

---

## Phase 2: Book Collection and Mana System

### Task 2.1: Implement book spawning
- [ ] Sub-task: Write tests for `spawnBooks(vocabulary, targetWord)`
  - Test: Creates 4 books (1 correct, 3 decoys)
  - Test: Books positioned in quadrants around arena
  - Test: Each book has translation label
  - Test: Correct book matches target word
- [ ] Sub-task: Implement `spawnBooks()` function
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 2.2: Implement book collection logic
- [ ] Sub-task: Write tests for `checkBookCollisions(state)`
  - Test: Detects collision when player near book (radius check)
  - Test: Correct book: +10 mana, +1 shield charge, progress incremented
  - Test: Incorrect book: -5 mana, no shield charge
  - Test: Respects max 3 shield charges
  - Test: Books despawn after collection
  - Test: New books spawn after collection
- [ ] Sub-task: Implement `checkBookCollisions()`
- [ ] Sub-task: Write tests for `selectNextTargetWord(state)`
  - Test: Selects word that hasn't been collected 2x yet
  - Test: Cycles through vocabulary appropriately
- [ ] Sub-task: Implement `selectNextTargetWord()`
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 2.3: Implement mana system
- [ ] Sub-task: Write tests for mana calculations
  - Test: Mana can go negative (no minimum)
  - Test: Mana displayed as score
  - Test: Correct book adds 10 mana
  - Test: Wrong book subtracts 5 mana
  - Test: Spirit collision subtracts 10 mana
- [ ] Sub-task: Integrate mana changes into collision handlers
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Book Collection and Mana System' (Protocol in workflow.md)

---

## Phase 3: Shield Mechanic

### Task 3.1: Implement shield activation
- [ ] Sub-task: Write tests for `activateShield(state)`
  - Test: Activates only if charges > 0
  - Test: Consumes 1 charge
  - Test: Sets shieldActive = true
  - Test: Sets shieldTimer = 2000ms
  - Test: Freezes player movement (set velocity to 0)
- [ ] Sub-task: Implement `activateShield()`
- [ ] Sub-task: Write tests for shield timer countdown
  - Test: Timer decrements by dt each tick
  - Test: Shield deactivates when timer reaches 0
  - Test: Player can move again after deactivation
- [ ] Sub-task: Implement shield timer logic in `advanceEnchantedLibraryTime()`
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 3.2: Implement spirit bounce mechanics
- [ ] Sub-task: Write tests for `checkSpiritCollisions(state)`
  - Test: No collision detection when shield inactive
  - Test: When shield active, detects spirit collision with player
  - Test: Bounces spirit at angle of incidence (reflection physics)
  - Test: Spirit continues in new direction after bounce
  - Test: No mana loss when shield active
  - Test: Normal mana loss (-10) when shield inactive
- [ ] Sub-task: Implement reflection physics:
  ```typescript
  // Calculate reflection vector
  const normal = normalize(playerPos - spiritPos)
  const reflection = velocity - 2 * dot(velocity, normal) * normal
  ```
- [ ] Sub-task: Implement `checkSpiritCollisions()`
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 3.3: Integrate shield into game loop
- [ ] Sub-task: Update `advanceEnchantedLibraryTime()` to:
  - Check shield input (Space/Enter)
  - Activate shield if requested and charges available
  - Update shield timer
  - Prevent player movement when shield active
- [ ] Sub-task: Write integration tests
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Shield Mechanic' (Protocol in workflow.md)

---

## Phase 4: Win Condition and Vocabulary Tracking

### Task 4.1: Implement vocabulary progress tracking
- [ ] Sub-task: Write tests for vocabulary tracking
  - Test: Each word starts with 0 completions
  - Test: Correct collection increments count for that word
  - Test: Wrong collection doesn't increment
  - Test: Track shows progress (e.g., "cat": 1/2, "dog": 2/2)
- [ ] Sub-task: Update `checkBookCollisions()` to track progress
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 4.2: Implement victory condition
- [ ] Sub-task: Write tests for `checkVictoryCondition(state)`
  - Test: Returns true when all words collected 2x
  - Test: Returns false if any word < 2x
  - Test: Sets status = 'victory' when complete
- [ ] Sub-task: Implement `checkVictoryCondition()`
- [ ] Sub-task: Update `advanceEnchantedLibraryTime()` to check victory
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

### Task 4.3: Calculate final score
- [ ] Sub-task: Write tests for final score calculation
  - Test: Final score = current mana value
  - Test: Score displayed on victory screen
- [ ] Sub-task: Implement score display logic
- [ ] Sub-task: Run tests

**Verification**: All tests pass. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Win Condition and Vocabulary Tracking' (Protocol in workflow.md)

---

## Phase 5: React Component and UI

### Task 5.1: Create Enchanted Library game component
- [ ] Sub-task: Create `src/components/enchanted-library/EnchantedLibraryGame.tsx`
- [ ] Sub-task: Set up Konva Stage and Layer (800×600)
- [ ] Sub-task: Implement asset loading for sprites:
  - Player sprite (student wizard)
  - Spirit sprite
  - Book sprite
  - Library floor tiles
- [ ] Sub-task: Create basic component structure with game loop
- [ ] Sub-task: Write component tests in `EnchantedLibraryGame.test.tsx`
- [ ] Sub-task: Run tests

**Verification**: Component renders without errors. ✅

### Task 5.2: Implement player rendering
- [ ] Sub-task: Render player using sprite sheet (64×64px)
- [ ] Sub-task: Implement sprite animation (3×3 pose sheet)
- [ ] Sub-task: Add directional facing based on movement
- [ ] Sub-task: Test player rendering

**Verification**: Player sprite animates smoothly. ✅

### Task 5.3: Implement spirit rendering
- [ ] Sub-task: Render spirits using sprite (48×48px)
- [ ] Sub-task: Add floating/ghostly animation
- [ ] Sub-task: Show bounce effect when reflecting off shield
- [ ] Sub-task: Test spirit rendering

**Verification**: Spirits render and animate correctly. ✅

### Task 5.4: Implement book rendering
- [ ] Sub-task: Render books as bright, colorful sprites with glow
- [ ] Sub-task: Add translation label below each book (large text)
- [ ] Sub-task: Add gentle rotation/floating animation
- [ ] Sub-task: Test book rendering

**Verification**: Books are visible and attractive. ✅

### Task 5.5: Implement shield visual effect
- [ ] Sub-task: Render shield as circular barrier around player
- [ ] Sub-task: Add glowing/pulsing animation
- [ ] Sub-task: Show only when shield is active
- [ ] Sub-task: Test shield rendering

**Verification**: Shield effect is clear and appealing. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 5: React Component and UI' (Protocol in workflow.md)

---

## Phase 6: HUD and Primary School UX

### Task 6.1: Create bright, friendly HUD
- [ ] Sub-task: Display target word prominently at top (large, yellow text)
- [ ] Sub-task: Display current mana/score in top-left:
  ```typescript
  <div className="text-3xl font-bold text-yellow-400">
    ✨ Mana: {gameState?.mana}
  </div>
  ```
- [ ] Sub-task: Display shield charges in top-right with shield icons (🛡️ × charges)
- [ ] Sub-task: Use bright, friendly colors (yellows, blues, greens)
- [ ] Sub-task: Test HUD readability

**Verification**: HUD is colorful, clear, and child-friendly. ✅

### Task 6.2: Create vocabulary progress display
- [ ] Sub-task: Show progress for each word (e.g., "cat ⭐⭐", "dog ⭐☆")
- [ ] Sub-task: Display in sidebar or bottom area
- [ ] Sub-task: Use stars or checkmarks for visual progress
- [ ] Sub-task: Test progress display

**Verification**: Progress is easy to understand for children. ✅

### Task 6.3: Implement start/intro screen
- [ ] Sub-task: Create friendly introduction with:
  - Game title with magical theme
  - Instructions in simple language
  - Colorful graphics
  - "Start Adventure" button
- [ ] Sub-task: Show vocabulary preview (words they'll learn)
- [ ] Sub-task: Test intro screen

**Verification**: Intro is engaging and clear. ✅

### Task 6.4: Implement victory screen
- [ ] Sub-task: Create celebration screen with:
  - "You're a Master Wizard!" message
  - Final score/mana display
  - Stars or achievement badges
  - Confetti or sparkle animations
  - "Play Again" and "Exit" buttons
- [ ] Sub-task: Test victory screen

**Verification**: Victory screen is celebratory and motivating. ✅

### Task 6.5: Add virtual controls for mobile
- [ ] Sub-task: Create D-pad for movement (bottom-left)
- [ ] Sub-task: Create Shield button (bottom-right)
- [ ] Sub-task: Style with bright, child-friendly colors
- [ ] Sub-task: Test touch responsiveness

**Verification**: Virtual controls work well on mobile. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 6: HUD and Primary School UX' (Protocol in workflow.md)

---

## Phase 7: Visual Theme and Assets

### Task 7.1: Create/integrate library background
- [ ] Sub-task: Design or source library floor tile texture
- [ ] Sub-task: Add bookshelves or library decorations in background
- [ ] Sub-task: Use warm, inviting colors (not dark/scary)
- [ ] Sub-task: Implement tiled background rendering

**Verification**: Background looks like a friendly library. ✅

### Task 7.2: Create/integrate sprite assets
- [ ] Sub-task: Create student wizard sprite (bright robes, friendly face)
- [ ] Sub-task: Create friendly spirit sprite (cartoon ghost, not scary)
- [ ] Sub-task: Create magic book sprite (colorful, glowing)
- [ ] Sub-task: Save sprites to `public/games/enchanted-library/`
- [ ] Sub-task: Implement 3×3 pose sheets for animations

**Verification**: All sprites are age-appropriate and appealing. ✅

### Task 7.3: Add visual polish
- [ ] Sub-task: Add particle effects for book collection (sparkles)
- [ ] Sub-task: Add glow effects on books and shield
- [ ] Sub-task: Add smooth transitions between screens
- [ ] Sub-task: Ensure all text is large and readable

**Verification**: Game looks polished and professional. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 7: Visual Theme and Assets' (Protocol in workflow.md)

---

## Phase 8: Page Integration and Routing

### Task 8.1: Create Next.js page route
- [ ] Sub-task: Create `src/app/games/enchanted-library/page.tsx`
- [ ] Sub-task: Import EnchantedLibraryGame component
- [ ] Sub-task: Load sample vocabulary if none provided
- [ ] Sub-task: Handle game completion callback
- [ ] Sub-task: Add navigation back to home
- [ ] Sub-task: Create page tests `page.test.tsx`

**Verification**: Page loads and game runs correctly. ✅

### Task 8.2: Update app navigation
- [ ] Sub-task: Add Enchanted Library to games list/menu
- [ ] Sub-task: Create game card/thumbnail
- [ ] Sub-task: Test navigation flow

**Verification**: Can navigate to game from main menu. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 8: Page Integration and Routing' (Protocol in workflow.md)

---

## Phase 9: Testing and Quality Assurance

### Task 9.1: Integration testing
- [ ] Sub-task: Test complete gameplay flow:
  1. Start game
  2. Collect correct book (verify mana +10, shield +1)
  3. Collect wrong book (verify mana -5)
  4. Get hit by spirit (verify mana -10)
  5. Activate shield (verify spirit bounces)
  6. Complete all vocabulary 2x
  7. See victory screen
- [ ] Sub-task: Test edge cases:
  - Activating shield with 0 charges
  - Spirit spawning and despawning
  - Mana going negative
  - All vocabulary words appearing

**Verification**: All gameplay flows work correctly. ✅

### Task 9.2: Performance testing
- [ ] Sub-task: Test on mobile emulation (iPhone 12)
- [ ] Sub-task: Verify 30+ FPS during gameplay
- [ ] Sub-task: Check memory usage over time
- [ ] Sub-task: Optimize if needed

**Verification**: Game maintains smooth performance. ✅

### Task 9.3: Accessibility and UX testing
- [ ] Sub-task: Test with primary school age group (if possible)
- [ ] Sub-task: Verify all text is readable
- [ ] Sub-task: Ensure instructions are clear
- [ ] Sub-task: Check color contrast for readability
- [ ] Sub-task: Test touch target sizes (44×44px minimum)

**Verification**: Game is accessible and age-appropriate. ✅

### Task 9.4: Cross-browser testing
- [ ] Sub-task: Test on Chrome
- [ ] Sub-task: Test on Firefox
- [ ] Sub-task: Test on Safari
- [ ] Sub-task: Test on mobile browsers

**Verification**: Game works across browsers. ✅

- [ ] Task: Conductor - User Manual Verification 'Phase 9: Testing and Quality Assurance' (Protocol in workflow.md)

---

## Summary

**Track Goals:**
1. Create new Enchanted Library game based on Wizard vs Zombie architecture ✓
2. Implement spirit enemies with predictive straight-line movement ✓
3. Replace HP with mana system (score) ✓
4. Implement shield mechanic with reflection physics ✓
5. Add win condition (collect all vocabulary 2x) ✓
6. Create bright, primary-school-friendly visual theme ✓
7. Ensure smooth performance (30+ FPS) ✓

**Key Files to Create:**
- `src/lib/enchantedLibrary.ts` - Core game logic
- `src/lib/enchantedLibrary.test.ts` - Unit tests
- `src/components/enchanted-library/EnchantedLibraryGame.tsx` - React component
- `src/components/enchanted-library/EnchantedLibraryGame.test.tsx` - Component tests
- `src/app/games/enchanted-library/page.tsx` - Next.js route
- `public/games/enchanted-library/*` - Sprite assets

**Success Criteria:**
- Spirits spawn one at a time and move predictively
- Shield mechanic bounces spirits with proper physics
- Mana system replaces HP (acts as score)
- Books grant mana and shield charges
- Game ends when all words collected 2x each
- Visual theme is bright and age-appropriate
- Performance is smooth on mobile
- All tests pass with >80% coverage
