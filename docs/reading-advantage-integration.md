# reading-advantage Integration Guide

This guide explains how to export games from advantage-games to reading-advantage for production deployment.

## Overview

The advantage-games repository serves as a development sandbox for educational browser games. When a game is ready for production, it's exported to reading-advantage where it integrates with:

- **Authentication** - NextAuth.js user sessions
- **Database** - Prisma with PostgreSQL (user progress, XP, rankings)
- **Vocabulary System** - UserWordRecord and UserSentenceRecord tables
- **Localization** - Multi-language support via i18n

## Export Checklist

Before exporting, verify in advantage-games:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] Game works with mock API data
- [ ] All imports use `@/` alias
- [ ] No hardcoded vocabulary (uses API)
- [ ] Translations added to `src/locales/en.ts`

## Step-by-Step Export

### Step 1: Copy Files

Copy from advantage-games to reading-advantage:

```bash
# Variables
GAME_NAME="dragon-flight"
GAME_TYPE="vocabulary"  # or "sentence"
GAME_CLASS="DragonFlight"

# Page component
cp src/app/\[locale\]/\(student\)/student/games/${GAME_TYPE}/${GAME_NAME}/page.tsx \
   ../reading-advantage/web/app/\[locale\]/\(student\)/student/games/${GAME_TYPE}/${GAME_NAME}/page.tsx

# Game components
cp -r src/components/games/${GAME_TYPE}/${GAME_NAME}/ \
      ../reading-advantage/web/components/games/${GAME_TYPE}/${GAME_NAME}/

# Game logic
cp src/lib/games/${GAME_NAME}.ts \
   ../reading-advantage/web/lib/games/${GAME_NAME}.ts

# Assets
cp -r public/games/${GAME_TYPE}/${GAME_NAME}/ \
      ../reading-advantage/web/public/games/${GAME_TYPE}/${GAME_NAME}/
```

### Step 2: Create Controller

Create `server/controllers/${GAME_NAME}-controller.ts` in reading-advantage:

```typescript
import { prisma } from "@/lib/prisma";
import type { ExtendedNextRequest } from "@/server/controllers/auth-controller";
import { NextResponse } from "next/server";
import { ActivityType, GameType } from "@prisma/client";

export class ${GAME_CLASS}Controller {
  static async getVocabulary(req: ExtendedNextRequest) {
    try {
      const userId = req.session?.user?.id;

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const records = await prisma.userWordRecord.findMany({
        where: {
          userId: userId,
          saveToFlashcard: true,
        },
        orderBy: [
          { due: "asc" },
          { stability: "asc" },
        ],
        take: 30,
      });

      if (records.length === 0) {
        return NextResponse.json({
          message: "No vocabulary found. Please learn some words first.",
          warning: "NO_VOCABULARY",
          vocabulary: [],
          status: 200,
        });
      }

      // Get locale from query or headers
      const url = new URL(req.url);
      const queryLocale = url.searchParams.get("locale");
      const acceptLanguage = req.headers.get("accept-language") || "";
      let locale = queryLocale || acceptLanguage.split(",")[0]?.split("-")[0] || "en";

      // Map locale codes
      let translationKey = locale;
      if (locale === "cn") translationKey = "zh-CN";
      else if (locale === "tw") translationKey = "zh-TW";

      const gameVocabulary = records
        .map((record) => {
          let translation = "";
          let term = "";
          try {
            const wordObj = record.word as any;

            if (typeof wordObj === "string") {
              term = wordObj;
              translation = wordObj;
            } else if (wordObj && typeof wordObj === "object") {
              term = wordObj.vocabulary || wordObj.word || "";

              const defObj = wordObj.definition;
              if (typeof defObj === "string") {
                translation = defObj;
              } else if (defObj && typeof defObj === "object") {
                translation =
                  defObj[translationKey] ||
                  defObj.th ||
                  defObj.en ||
                  term;
              }
            }
          } catch (e) {
            console.warn("Failed to parse word for record", record.id, e);
          }

          return {
            term: term,
            translation: translation,
          };
        })
        .filter((item) => item.term && item.translation);

      if (gameVocabulary.length < 5) {
        return NextResponse.json({
          message: `You need at least 5 words to play. You currently have ${gameVocabulary.length}.`,
          warning: "INSUFFICIENT_VOCABULARY",
          requiredCount: 5,
          currentCount: gameVocabulary.length,
          vocabulary: gameVocabulary,
          status: 200,
        });
      }

      return NextResponse.json({
        message: "Vocabulary retrieved successfully",
        vocabulary: gameVocabulary,
        status: 200,
      });
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }

  static async completeGame(req: ExtendedNextRequest) {
    try {
      const userId = req.session?.user?.id;

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const {
        xp,
        accuracy,
        correctAnswers,
        totalAttempts,
        difficulty = "normal",
      } = body;

      if (
        xp === undefined ||
        accuracy === undefined ||
        correctAnswers === undefined ||
        totalAttempts === undefined
      ) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            message: "xp, accuracy, correctAnswers, and totalAttempts are required",
          },
          { status: 400 },
        );
      }

      const uniqueTargetId = `${GAME_NAME}-${userId}-${Date.now()}`;

      const activity = await prisma.userActivity.create({
        data: {
          userId: userId,
          activityType: ActivityType.${GAME_CLASS_UPPER},
          targetId: uniqueTargetId,
          completed: true,
          details: {
            xp,
            accuracy,
            correctAnswers,
            totalAttempts,
            difficulty,
            gameSession: uniqueTargetId,
          },
        },
      });

      if (xp > 0) {
        await prisma.xPLog.create({
          data: {
            userId: userId,
            xpEarned: xp,
            activityId: activity.id,
            activityType: ActivityType.${GAME_CLASS_UPPER},
          },
        });

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: userId },
            data: { xp: user.xp + xp },
          });

          if (req.session?.user) {
            req.session.user.xp = user.xp + xp;
          }

          try {
            await prisma.gameRanking.upsert({
              where: {
                userId_gameType_difficulty: {
                  userId: userId,
                  gameType: GameType.${GAME_CLASS_UPPER},
                  difficulty: difficulty,
                },
              },
              update: {
                totalXp: {
                  increment: xp,
                },
              },
              create: {
                userId: userId,
                gameType: GameType.${GAME_CLASS_UPPER},
                difficulty: difficulty,
                totalXp: xp,
              },
            });
          } catch (rankingError) {
            console.warn("Failed to update ranking, but game activity saved.", rankingError);
          }
        }
      }

      return NextResponse.json({
        message: "Game completed successfully",
        xpEarned: xp,
        activityId: activity.id,
        status: 200,
      });
    } catch (error) {
      console.error("Error completing game:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }

  static async getRanking(req: ExtendedNextRequest) {
    try {
      const userId = req.session?.user?.id;

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { licenseId: true, schoolId: true },
      });

      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const gameRankings = await prisma.gameRanking.findMany({
        where: {
          gameType: GameType.${GAME_CLASS_UPPER},
          user: {
            licenseId: currentUser.licenseId || undefined,
            schoolId: !currentUser.licenseId ? currentUser.schoolId : undefined,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          totalXp: "desc",
        },
      });

      type RankingEntry = {
        userId: string;
        name: string;
        image: string | null;
        xp: number;
      };

      const sortedRankings: Record<string, RankingEntry[]> = {
        easy: [],
        normal: [],
        hard: [],
        extreme: [],
      };

      gameRankings.forEach((rank) => {
        const difficulty = rank.difficulty;
        if (sortedRankings[difficulty]) {
          if (sortedRankings[difficulty].length < 20) {
            sortedRankings[difficulty].push({
              userId: rank.userId,
              name: rank.user.name || "Unknown Player",
              image: rank.user.image,
              xp: rank.totalXp,
            });
          }
        }
      });

      return NextResponse.json({ rankings: sortedRankings });
    } catch (error) {
      console.error("Error fetching rankings:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }
}
```

### Step 3: Add Prisma Enums

Add to `prisma/schema.prisma`:

```prisma
enum ActivityType {
  // ... existing types
  DRAGON_FLIGHT
}

enum GameType {
  // ... existing types
  DRAGON_FLIGHT
}
```

Run migration:
```bash
npx prisma migrate dev --name add_dragon_flight_game
```

### Step 4: Create API Routes

Create in `app/api/v1/games/${GAME_NAME}/`:

**vocabulary/route.ts:**
```typescript
import { protect } from "@/server/controllers/auth-controller";
import { logRequest } from "@/server/middleware";
import { createEdgeRouter } from "next-connect";
import { type NextRequest } from "next/server";
import { DragonFlightController } from "@/server/controllers/dragon-flight-controller";

const router = createEdgeRouter<NextRequest, {}>();

router.use(logRequest);
router.use(protect);

const getVocabularyHandler = DragonFlightController.getVocabulary;
router.get(getVocabularyHandler as any);

export async function GET(request: NextRequest) {
  return router.run(request, {}) as Promise<Response>;
}
```

**complete/route.ts:**
```typescript
import { protect } from "@/server/controllers/auth-controller";
import { logRequest } from "@/server/middleware";
import { createEdgeRouter } from "next-connect";
import { type NextRequest } from "next/server";
import { DragonFlightController } from "@/server/controllers/dragon-flight-controller";

const router = createEdgeRouter<NextRequest, {}>();

router.use(logRequest);
router.use(protect);

const completeGameHandler = DragonFlightController.completeGame;
router.post(completeGameHandler as any);

export async function POST(request: NextRequest) {
  return router.run(request, {}) as Promise<Response>;
}
```

**ranking/route.ts:**
```typescript
import { protect } from "@/server/controllers/auth-controller";
import { logRequest } from "@/server/middleware";
import { createEdgeRouter } from "next-connect";
import { type NextRequest } from "next/server";
import { DragonFlightController } from "@/server/controllers/dragon-flight-controller";

const router = createEdgeRouter<NextRequest, {}>();

router.use(logRequest);
router.use(protect);

const getRankingHandler = DragonFlightController.getRanking;
router.get(getRankingHandler as any);

export async function GET(request: NextRequest) {
  return router.run(request, {}) as Promise<Response>;
}
```

### Step 5: Add Translations

Add to `locales/en.ts`:

```typescript
games: {
  dragonFlight: {
    title: 'Dragon Flight',
    description: 'Fly through gates to match vocabulary words.',
    loading: 'Loading...',
    start: 'Start Game',
    restart: 'Play Again',
    // Add game-specific keys
  },
}
```

### Step 6: Update Imports

In the copied page and component files, update imports:

| Old (advantage-games) | New (reading-advantage) |
|----------------------|-------------------------|
| `@/lib/games/basePath` | `@/lib/games/basePath` (same) |
| `@/lib/games/xp` | `@/lib/games/xp` (same) |
| `@/locales/client` | `@/locales/client` (same) |
| `@/hooks/useSession` | `@/hooks/useSession` (use real auth) |

### Step 7: Test

```bash
# In reading-advantage
npm run build
npm test
npm run dev

# Test game flow:
# 1. Login as test user
# 2. Add words to flashcard
# 3. Navigate to game
# 4. Play and complete
# 5. Verify XP earned
# 6. Check ranking
```

## API Response Formats

### Vocabulary GET Response

```typescript
{
  message?: string;
  warning?: "NO_VOCABULARY" | "INSUFFICIENT_VOCABULARY";
  vocabulary: Array<{ term: string; translation: string }>;
  requiredCount?: number;  // Only with INSUFFICIENT_VOCABULARY
  currentCount?: number;   // Only with INSUFFICIENT_VOCABULARY
  status: 200;
}
```

### Sentences GET Response

```typescript
{
  message?: string;
  warning?: "NO_SENTENCES" | "INSUFFICIENT_SENTENCES";
  sentences: Array<{ term: string; translation: string }>;
  requiredCount?: number;
  currentCount?: number;
  status: 200;
}
```

### Complete POST Request/Response

**Request:**
```typescript
{
  xp: number;
  accuracy: number;
  correctAnswers: number;
  totalAttempts: number;
  difficulty?: "easy" | "normal" | "hard" | "extreme";
}
```

**Response:**
```typescript
{
  message: string;
  xpEarned: number;
  activityId: string;
  status: 200;
}
```

### Ranking GET Response

```typescript
{
  rankings: {
    easy: Array<{ userId: string; name: string; image: string | null; xp: number }>;
    normal: Array<...>;
    hard: Array<...>;
    extreme: Array<...>;
  };
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unauthorized" error | Check `protect` middleware is applied |
| "NO_VOCABULARY" warning | User needs to add words to flashcard first |
| XP not updating | Check `xPLog` creation and `user.xp` update |
| Rankings empty | Check `GameRanking` upsert in `completeGame` |
| Locale not working | Check `accept-language` header and locale mapping |
| Build fails | Check all imports use `@/` alias |

## Reference Implementations

| Game | Type | Controller |
|------|------|------------|
| dragon-flight | vocabulary | `dragon-flight-controller.ts` |
| dragon-rider | vocabulary | `dragon-rider-controller.ts` |
| castle-defense | sentence | `castle-defense-controller.ts` |
| enchanted-library | vocabulary | `enchanted-library-controller.ts` |
| wizard-vs-zombie | vocabulary | `wizard-zombie-controller.ts` |
