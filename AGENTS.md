# AGENTS

## Worktree Rules

- Use one git worktree and branch per game for single-game changes.
- Do all single-game work in that game's worktree only.
- For cross-game or shared changes that touch multiple games, work in the base repo unless explicitly requested otherwise.

## Naming and Paths

- Worktrees root: `/home/daniel-bo/Downloads/vocabulary-worktrees`
- Branch naming: `game/<slug>` (example: `game/castle-defense`)
- Worktree naming: match the game slug (example path: `/home/daniel-bo/Downloads/vocabulary-worktrees/castle-defense`)

## Common Commands

```bash
# Create a new game worktree
git worktree add -b game/<slug> /home/daniel-bo/Downloads/vocabulary-worktrees/<slug>

# List worktrees
git worktree list

# Remove a worktree (after you're done and branch is merged or no longer needed)
git worktree remove /home/daniel-bo/Downloads/vocabulary-worktrees/<slug>

# Prune stale metadata
git worktree prune
```

## Notes

- Each worktree should run its own installs/builds/tests.
- Never edit another game's files from a different game’s worktree.

## Sync & Integration

- Sync cadence: pull main at least daily, before starting new tasks, and before opening a PR or merge.
- Standard sync commands (run inside your game worktree):
  ```bash
  git fetch
  git merge origin/main
  # or, if your team prefers: git rebase origin/main
  ```

## Game Development

All vocabulary/sentence games follow the `vocab-game-builder` skill patterns:
- React-Konva canvas architecture
- Mobile-first, portrait orientation (390×844 reference)
- Strict TDD workflow with >80% coverage
- Track-based development via conductor

Reference existing games for patterns: Dragon Flight, Wizard vs Zombie, Rune Match, Potion Rush, Dungeon Liberator.
