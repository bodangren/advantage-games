import type { VocabularyItem, Difficulty } from "@/store/useGameStore";
import {
  ARCHERS_REVENGE_CONFIG,
  getDifficultySettings,
} from "./archersRevengeConfig";

export type Enemy = {
  id: string;
  x: number;
  y: number;
  term: string;
  translation: string;
  shieldUp: boolean;
  row: number;
  column: number;
};

export type Arrow = {
  id: string;
  x: number;
  y: number;
  vy: number;
};

export type Projectile = {
  id: string;
  x: number;
  y: number;
  vy: number;
};

export type ArchersRevengeState = {
  status: "playing" | "victory" | "defeat";
  difficulty: Difficulty;
  hp: number;
  maxHp: number;
  score: number;
  combo: number;
  wave: number;
  targetWord: VocabularyItem;
  enemies: Enemy[];
  arrows: Arrow[];
  enemyProjectiles: Projectile[];
  vocabulary: VocabularyItem[];
  playerX: number;
  lastFireTime: number;
  formationDirection: 1 | -1;
  gameTime: number;
  correctAnswers: number;
  totalAttempts: number;
};

export type ArchersRevengeResults = {
  score: number;
  accuracy: number;
  xp: number;
  correctAnswers: number;
  totalAttempts: number;
  wavesCompleted: number;
  timeTaken: number;
  difficulty: Difficulty;
};

export type ArchersRevengeConfig = {
  difficulty?: Difficulty;
  rng?: () => number;
};

const GAME_WIDTH = 390;
const GAME_HEIGHT = 844;

export { GAME_WIDTH, GAME_HEIGHT };

const generateId = () => Math.random().toString(36).substring(2, 9);

const createEnemyFormation = (
  vocabulary: VocabularyItem[],
  difficulty: Difficulty,
  rng: () => number
): { enemies: Enemy[]; targetIndex: number } => {
  const settings = getDifficultySettings(difficulty);
  const { columns, rows } = settings;
  const { enemySpacing, enemySize, formationTopMargin, formationMarginX } =
    ARCHERS_REVENGE_CONFIG.layout;

  const totalEnemies = columns * rows;

  if (vocabulary.length < totalEnemies) {
    throw new Error(
      `Need at least ${totalEnemies} vocabulary items for ${difficulty} difficulty`
    );
  }

  const shuffledVocab = [...vocabulary].sort(() => rng() - 0.5);
  
  const bottomRow = rows - 1;
  const targetColumn = Math.floor(rng() * columns);
  const targetIndex = bottomRow * columns + targetColumn;

  const enemies: Enemy[] = [];
  const startX = formationMarginX + enemySize.width / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const vocabItem = shuffledVocab[index];

      enemies.push({
        id: `enemy-${row}-${col}`,
        x: startX + col * enemySpacing.x,
        y: formationTopMargin + row * enemySpacing.y,
        term: vocabItem.term,
        translation: vocabItem.translation,
        shieldUp: index !== targetIndex,
        row,
        column: col,
      });
    }
  }

  return { enemies, targetIndex };
};

export const createArchersRevengeState = (
  vocabulary: VocabularyItem[],
  { difficulty = "normal", rng = Math.random }: ArchersRevengeConfig = {}
): ArchersRevengeState => {
  if (vocabulary.length === 0) {
    throw new Error("Vocabulary cannot be empty");
  }

  const settings = getDifficultySettings(difficulty);
  const { enemies, targetIndex } = createEnemyFormation(
    vocabulary,
    difficulty,
    rng
  );

  const targetVocab = {
    term: enemies[targetIndex].term,
    translation: enemies[targetIndex].translation,
  };

  return {
    status: "playing",
    difficulty,
    hp: settings.playerHp,
    maxHp: settings.playerHp,
    score: 0,
    combo: 0,
    wave: 1,
    targetWord: targetVocab,
    enemies,
    arrows: [],
    enemyProjectiles: [],
    vocabulary,
    playerX: GAME_WIDTH / 2,
    lastFireTime: 0,
    formationDirection: 1,
    gameTime: 0,
    correctAnswers: 0,
    totalAttempts: 0,
  };
};
