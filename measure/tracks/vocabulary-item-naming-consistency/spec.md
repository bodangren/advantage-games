# Specification: VocabularyItem vs SentenceItem Naming Consistency

## Overview

Sentence games Griffin Riders Escape, Gryphon Patrol, and Village Guardian use `VocabularyItem` imported from `@/store/useGameStore` to type sentence data. This is semantically incorrect — these are sentence-level games and should use `SentenceItem` typing for consistency with other sentence games.

## Problem

1. **Semantic mismatch**: Sentence games using `VocabularyItem` is confusing. `VocabularyItem` is intended for vocabulary/word games, while `SentenceItem` is for sentence games.
2. **Inconsistency with other sentence games**: Games like Dungeon Liberator, Spellweaver's Run, Realm Carver, etc. define their own `SentenceItem` type or use sentence-specific typing.
3. **Type confusion**: Developers reading the code may incorrectly assume these are vocabulary games.

## Goals

1. Replace `VocabularyItem` usage with `SentenceItem` in Griffin Riders Escape, Gryphon Patrol, and Village Guardian.
2. Ensure `SentenceItem` type is consistently defined/used across all three games.
3. Maintain full test coverage and passing tests after the rename.
4. No functional changes — purely a type naming refactor.

## Scope

### In Scope
- Rename type imports from `VocabularyItem` to `SentenceItem` in game logic files.
- Rename variable names from `vocabulary` to `sentences` or `sentence` where appropriate.
- Update test files to use the corrected type names.
- Update any game component files that reference these types.

### Out of Scope
- Functional changes to game logic.
- Changes to the actual store type definitions.
- Changes to vocabulary games that correctly use `VocabularyItem`.

## Acceptance Criteria

- [ ] Griffin Riders Escape uses `SentenceItem` instead of `VocabularyItem`.
- [ ] Gryphon Patrol uses proper sentence typing (currently uses `string[]`, may need `SentenceItem`).
- [ ] Village Guardian uses `SentenceItem` instead of `VocabularyItem`.
- [ ] All tests pass after the rename.
- [ ] Test coverage remains ≥ 80% for affected files.
- [ ] No lint errors introduced.
