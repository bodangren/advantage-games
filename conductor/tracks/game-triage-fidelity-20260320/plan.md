# Implementation Plan: Game Triage and Fidelity Audit

This plan outlines the steps to audit and patch games developed after 'Spellweaver's Run' for fidelity with the `vocab-game-builder` skill and general quality.

## Phase 1: Fidelity Checklist & Prep
**Goal:** Establish the criteria for the audit and set up the triage tools.

- [ ] Task: Create `conductor/notes/game-fidelity-checklist.md` based on `vocab-game-builder` skill requirements.
- [ ] Task: Create a script/command to check test coverage across all game-specific directories.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Fidelity Checklist & Prep' (Protocol in workflow.md)

## Phase 2: Triage & Patch - Archived Games (Set 1)
**Goal:** Audit and fix 'Shadow Gate Dungeon', 'Rune Forge Chamber', and 'Village Guardian'.

- [ ] Task: Audit 'Shadow Gate Dungeon' against checklist and identify bugs.
- [ ] Task: Fix identified bugs in 'Shadow Gate Dungeon' (UI, Logic, Gameplay).
- [ ] Task: Verify >80% coverage and architectural fidelity for 'Shadow Gate Dungeon'.
- [ ] Task: Audit 'Rune Forge Chamber' against checklist and identify bugs.
- [ ] Task: Fix identified bugs in 'Rune Forge Chamber' (UI, Logic, Gameplay).
- [ ] Task: Verify >80% coverage and architectural fidelity for 'Rune Forge Chamber'.
- [ ] Task: Audit 'Village Guardian' against checklist and identify bugs.
- [ ] Task: Fix identified bugs in 'Village Guardian' (UI, Logic, Gameplay).
- [ ] Task: Verify >80% coverage and architectural fidelity for 'Village Guardian'.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Triage & Patch - Archived Games (Set 1)' (Protocol in workflow.md)

## Phase 3: Triage & Patch - Archived Games (Set 2)
**Goal:** Audit and fix 'Labyrinth of the Goblin King' and 'The Abyssal Well'.

- [ ] Task: Audit 'Labyrinth of the Goblin King' against checklist and identify bugs.
- [ ] Task: Fix identified bugs in 'Labyrinth of the Goblin King' (UI, Logic, Gameplay).
- [ ] Task: Verify >80% coverage and architectural fidelity for 'Labyrinth of the Goblin King'.
- [ ] Task: Audit 'The Abyssal Well' against checklist and identify bugs.
- [ ] Task: Fix identified bugs in 'The Abyssal Well' (UI, Logic, Gameplay).
- [ ] Task: Verify >80% coverage and architectural fidelity for 'The Abyssal Well'.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Triage & Patch - Archived Games (Set 2)' (Protocol in workflow.md)

## Phase 4: Triage & Patch - Active/Planned Games
**Goal:** Audit and fix 'Archer's Revenge', 'Griffin Sky-Joust', and 'Realm Carver'.

- [ ] Task: Audit 'Archer's Revenge' (Active Track) against checklist.
- [ ] Task: Fix/Ensure fidelity for 'Archer's Revenge' features.
- [ ] Task: Verify >80% coverage for 'Archer's Revenge'.
- [ ] Task: (If started) Audit 'Griffin Sky-Joust' and 'Realm Carver' specs and early code.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Triage & Patch - Active/Planned Games' (Protocol in workflow.md)

## Phase 5: Final Platform Verification
**Goal:** Ensure all audited games work harmoniously on the platform.

- [ ] Task: Run full test suite: `CI=true npm test`.
- [ ] Task: Perform build check: `CI=true npm run build`.
- [ ] Task: Verify mobile responsiveness for all 8 games on 390x844 viewport.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Platform Verification' (Protocol in workflow.md)
