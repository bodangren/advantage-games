# AGENTS

## Measure Workflow

Load the `measure` skill and read `measure/index.md` before starting work.

## Documentation Standards

Use JSDoc for all exported functions. Describe params and returns without repeating TypeScript types.

## Codebase Graph

This project uses `build-graph`. Load the `build-graph` skill for commands.

## Skills

This project uses two primary skills for all development:

- **measure** — Spec-driven development framework. All work is organized into tracks with specifications and phased implementation plans.
- **vocab-game-builder** — Build vocabulary learning games using React-Konva canvas architecture with strict TDD workflow.

## Game Development

All vocabulary/sentence games follow the `vocab-game-builder` skill patterns:
- React-Konva canvas architecture
- Mobile-first, portrait orientation (390×844 reference)
- Strict TDD workflow with >80% coverage
- Track-based development via measure

Reference existing games for patterns: Dragon Flight, Wizard vs Zombie, Rune Match, Potion Rush, Dungeon Liberator.
