# AGENTS

## Worktree Rules

- Use one git worktree and branch per game.
- Do all game work in that game's worktree only.
- Keep the base repo clean; use it only for worktree management and global admin tasks unless explicitly requested otherwise.
- If a change impacts multiple games or shared code, get explicit approval and use a dedicated worktree/branch (e.g., `shared/<topic>`).

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
- Shared changes (engine/components/config): use a dedicated `shared/<topic>` worktree/branch, then merge to main so all game branches can pull cleanly.
- Standard sync commands (run inside your game worktree):
  ```bash
  git fetch
  git merge origin/main
  # or, if your team prefers: git rebase origin/main
  ```
