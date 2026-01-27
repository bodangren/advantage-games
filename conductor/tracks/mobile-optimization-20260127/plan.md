# Plan: Mobile Optimization (Portrait Mode)

## Phase 1: Investigation & Analysis [checkpoint: ae412cf]
- [x] Task: Use Chrome DevTools to audit **Rune Match** in mobile portrait mode.
    - [x] Sub-task: Identify specific CSS/Layout issues causing unreadable text.
    - [x] Sub-task: Take screenshots or log specific element dimensions needing change.
- [x] Task: Use Chrome DevTools to audit **Castle Defense** in mobile portrait mode.
    - [x] Sub-task: Inspect the Start Screen and identify why the button is cut off.
    - [x] Sub-task: Analyze the main game canvas scaling.
- [x] Task: Use Chrome DevTools to audit **Wizard vs Zombie** in mobile portrait mode.
    - [x] Sub-task: Measure the overlap between the D-pad and the translation text.
- [x] Task: Use Chrome DevTools to audit **Magic Defense** in mobile portrait mode.
    - [x] Sub-task: Determine the exact canvas dimensions vs. viewport width causing the cutoff.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Investigation & Analysis' (Protocol in workflow.md)

## Phase 2: Castle Defense Optimization
- [ ] Task: Refactor Start Screen for Castle Defense.
    - [ ] Sub-task: Implement adaptive styles to ensure the Start button is always visible.
- [ ] Task: Optimize Castle Defense Main Game Layout.
    - [ ] Sub-task: Adjust canvas sizing logic to fit mobile width.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Castle Defense Optimization' (Protocol in workflow.md)

## Phase 3: Wizard vs Zombie Optimization
- [ ] Task: Relocate UI Elements.
    - [ ] Sub-task: Move Translation/Target text to the top of the screen.
    - [ ] Sub-task: Ensure no overlap with the bottom D-pad area.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Wizard vs Zombie Optimization' (Protocol in workflow.md)

## Phase 4: Magic Defense Optimization
- [ ] Task: Implement Responsive Canvas.
    - [ ] Sub-task: Update game logic to calculate canvas size based on window width.
    - [ ] Sub-task: Ensure assets scale or reposition correctly within the new bounds.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Magic Defense Optimization' (Protocol in workflow.md)

## Phase 5: Rune Match Optimization
- [ ] Task: Improve Text & Grid Visibility.
    - [ ] Sub-task: Adjust font sizes and grid cell dimensions for narrow screens.
    - [ ] Sub-task: Ensure contrast and padding are sufficient for readability.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Rune Match Optimization' (Protocol in workflow.md)

## Phase 6: Final Verification
- [ ] Task: Perform a final pass on all optimized games using DevTools mobile emulation to ensure consistency.
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Final Verification' (Protocol in workflow.md)
