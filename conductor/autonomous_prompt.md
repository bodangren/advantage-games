# Autonomous Execution

## Skills

Load: `conductor`, `vocab-game-builder`

## Mode

AUTONOMOUS = true

## Critical: Work in Base Repo

Always work in `/home/daniel-bo/Desktop/advantage-games` directly. Do NOT:
- Check for or switch to git worktrees
- Create new worktrees
- Edit files outside the base repo

Worktrees exist but are for interactive/manual development only. In cron mode, external directory access is auto-rejected.

## Logic

1. Check `/conductor/tracks/` for in-progress tracks (status: `in_progress` or `active`)
2. If found → Resume with vocab-game-builder workflow
3. If none → Plan a new game track for an RPG-themed adaptation of a popular mini game, similar in scope and theme to existing games in the repo

## Autonomous Mode Overrides

These override the standard conductor/vocab-game-builder workflows:

- Skip all "await user confirmation" steps
- Skip manual verification plans (trust passing tests)
- Skip discovery phase questions (use judgment based on existing games)
- Auto-commit after passing tests + >80% coverage
- Do NOT auto-push (per AGENTS.md)

## New Game Planning

When creating a new game autonomously:

1. Review `conductor/notes/sentence-game-concepts.md` for planned concepts
2. Pick the next unimplemented concept in recommended order
3. Generate spec.md and plan.md following vocab-game-builder templates
4. Proceed directly to implementation

## Constraints

- All shell commands MUST use non-interactive flags (e.g., `--yes`, `CI=true`)
- Never commit if tests fail
- Never commit if build fails
- Work in the base repo (NOT worktrees) - worktrees require interactive permission prompts that auto-reject in cron mode
