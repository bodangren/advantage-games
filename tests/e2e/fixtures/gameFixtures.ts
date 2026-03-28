import type { VocabularyItem } from "../../../src/store/useGameStore";
import { SAMPLE_VOCABULARY } from "../../../src/lib/games/sampleVocabulary";

export const ARCHERS_REVENGE_GAME_PATH =
  "/en/student/games/vocabulary/archers-revenge";

export const ARCHERS_REVENGE_SCREENSHOT_DIR = "public/games/archers-revenge";

export const ARCHERS_REVENGE_SCREENSHOT_FILE =
  "archers-revenge-gameplay.png";

export const ARCHERS_REVENGE_SAMPLE_VOCABULARY: VocabularyItem[] =
  SAMPLE_VOCABULARY;

export const ARCHERS_REVENGE_COMPLETION_RESPONSE = {
  message: "Game completed successfully",
  xpEarned: 0,
  activityId: "mock-activity-playwright",
  status: 200,
};
