# Content Pack Rotation Runbook

## Overview

This runbook documents the weekly content rotation workflow for operators managing vocabulary and sentence packs in the Reading Advantage games platform.

## Prerequisites

- Access to the game content repository
- Understanding of content pack formats (v1-legacy and v2)
- Access to localStorage for rotation state management

## Content Pack Format

### v2 Format (Recommended)

```json
{
  "packId": "vocab-beginner-001",
  "version": "1.0.0",
  "name": "Beginner Vocabulary Set",
  "description": "Basic vocabulary for new learners",
  "gameType": "vocabulary",
  "difficulty": "easy",
  "active": true,
  "items": [
    { "term": "hello", "translation": "world" },
    { "term": "foo", "translation": "bar" }
  ]
}
```

### v1 Legacy Format (Auto-converted)

Legacy packs are arrays of `{term, translation}` objects and are auto-converted to v2 on validation.

## Rotation Workflow

### Step 1: Prepare New Content Pack

1. Create new pack file in `/src/lib/games/content/` directory
2. Ensure pack has minimum 5 items (recommended: 20+ items for variety)
3. Validate pack format using `validateContentPack()` utility
4. Update version number following semver convention

### Step 2: Review Current Active Packs

```typescript
import { createRotationManager } from '@/lib/games/packRotation'

const manager = createRotationManager()
const state = manager.getState()

console.log('Current active packs:', state.activePacks)
console.log('Last rotation:', state.lastRotation)
console.log('Rotation history:', state.rotationHistory)
```

### Step 3: Save Stable Backup

Before rotating, save current packs as stable for rollback:

```typescript
manager.saveStablePacks()
```

### Step 4: Activate New Packs

```typescript
// Set entirely new active packs
manager.setActivePacks(['new-pack-1', 'new-pack-2'], 'Weekly rotation: Spring 2026 Week 15')

// Or add/remove individual packs
manager.addActivePack('new-pack-3')
manager.removeActivePack('old-pack-1')
```

### Step 5: Verify Integration

1. Load game page and verify vocabulary/sentences load correctly
2. Play through a short session to confirm gameplay works
3. Check browser console for validation errors

### Step 6: Monitor and Confirm

- Watch error tracking for any content loading failures
- Confirm game completion flows work correctly
- Verify XP is awarded properly

## Rollback Procedure

If issues are detected after rotation:

```typescript
const manager = createRotationManager()

// Immediate rollback to previous state
const success = manager.rollback('Emergency rollback: content validation error')

if (success) {
  console.log('Rolled back to:', manager.getState().activePacks)
} else {
  console.log('No rollback available')
}
```

### Rollback to Stable

```typescript
const manager = createRotationManager()
const state = manager.getState()

// Restore stable packs if saved
if (state.stablePacks.length > 0) {
  manager.setActivePacks(state.stablePacks, 'Restored from stable backup')
}
```

## Content Validation Checklist

Before activating any pack, verify:

- [ ] Pack has minimum 5 vocabulary items
- [ ] All items have valid `term` and `translation` fields
- [ ] Version follows semver format (e.g., `1.0.0`)
- [ ] Pack ID is unique across all packs
- [ ] Difficulty level is appropriate for target audience

## Troubleshooting

### Pack Not Loading

1. Check browser console for validation errors
2. Verify pack ID matches exactly (case-sensitive)
3. Confirm pack exists in content directory

### Rollback Not Working

- Check that rotation history exists (`state.rotationHistory.length > 0`)
- Rollback only affects activation records, not stable packs

### Content Display Issues

- Verify `gameType` matches game expectations (`vocabulary` vs `sentence`)
- Check that difficulty level is supported by target game

## Rotation Schedule Template

| Week | Pack IDs | Notes |
|------|----------|-------|
| W01  | pack-001, pack-002 | Initial deployment |
| W02  | pack-001, pack-003 | Added variety pack |
| W03  | pack-004, pack-005 | Theme: Nature |
| ...  | ... | ... |

## Version Update Guidelines

- **MAJOR**: Breaking changes (removing items, changing semantics)
- **MINOR**: New items added (backward compatible)
- **PATCH**: Bug fixes (typos, incorrect translations)

## Contact

For issues or questions about content rotation, contact the platform team.