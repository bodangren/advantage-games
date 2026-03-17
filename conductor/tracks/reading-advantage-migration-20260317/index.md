# Track: Reading Advantage Games Migration

## Files

- [Specification](./spec.md) - Requirements and acceptance criteria
- [Implementation Plan](./plan.md) - Phased task breakdown

## Overview

Import all games from the reading-advantage repository, restructuring advantage-games to match reading-advantage's architecture for seamless two-way synchronization.

## Status

**Current Phase:** Not started
**Next Task:** Phase 1, Task 1.1 - Create directory structure

## Key Decisions

1. **Directory split** - Adopt vocabulary/sentence structure to match reading-advantage
2. **Mock API routes** - Create `/api/v1/games/{game}/vocabulary` routes for same interface
3. **i18n stubs** - Add `useScopedI18n` and `useCurrentLocale` hooks
4. **Session stub** - Add `useSession` hook returning mock authenticated user
