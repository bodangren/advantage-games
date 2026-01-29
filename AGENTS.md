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
