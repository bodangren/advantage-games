#!/bin/bash
# check-game-coverage.sh
# Run test coverage for all game-specific logic files under audit.
# Usage: bash scripts/check-game-coverage.sh [game-slug]
#   e.g. bash scripts/check-game-coverage.sh shadow-gate-dungeon
#        bash scripts/check-game-coverage.sh          (runs all)

GAMES=(
  "shadowGateDungeon"
  "shadowGateDungeonConfig"
  "runeForgeChamber"
  "runeForgeChamberConfig"
  "villageGuardian"
  "villageGuardianConfig"
  "labyrinthGoblinKing"
  "labyrinthGoblinKingConfig"
  "abyssalWell"
  "abyssalWellConfig"
  "archersRevenge"
  "archersRevengeConfig"
)

if [ -n "$1" ]; then
  # Convert slug to camelCase pattern (simple heuristic)
  PATTERN="$1"
  echo "Running coverage for: $PATTERN"
  CI=true npx jest --coverage \
    --collectCoverageFrom="src/lib/games/${PATTERN}*.ts" \
    --testPathPatterns="src/lib/games/((__tests__/)?(${PATTERN}))" \
    2>&1
else
  echo "Running coverage for all audited games..."
  COLLECT_FROM=""
  for game in "${GAMES[@]}"; do
    COLLECT_FROM="${COLLECT_FROM}--collectCoverageFrom=src/lib/games/${game}.ts "
  done

  CI=true npx jest --coverage \
    --collectCoverageFrom="src/lib/games/shadowGateDungeon*.ts" \
    --collectCoverageFrom="src/lib/games/runeForgeChamber*.ts" \
    --collectCoverageFrom="src/lib/games/villageGuardian*.ts" \
    --collectCoverageFrom="src/lib/games/labyrinthGoblinKing*.ts" \
    --collectCoverageFrom="src/lib/games/abyssalWell*.ts" \
    --collectCoverageFrom="src/lib/games/archersRevenge*.ts" \
    --testPathPatterns="(shadowGateDungeon|runeForgeChamber|villageGuardian|labyrinthGoblinKing|abyssalWell|archersRevenge)" \
    2>&1
fi
