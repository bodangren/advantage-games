import type { VocabularyItem } from "@/store/useGameStore";
import {
  createArchersRevengeState,
  type ArchersRevengeState,
  type Enemy,
  type Arrow,
  type Projectile,
  GAME_WIDTH,
  GAME_HEIGHT,
} from "./archersRevenge";

describe("archersRevenge", () => {
  const mockVocabulary: VocabularyItem[] = [
    { term: "cat", translation: "แมว" },
    { term: "dog", translation: "หมา" },
    { term: "bird", translation: "นก" },
    { term: "fish", translation: "ปลา" },
    { term: "snake", translation: "งู" },
    { term: "mouse", translation: "หนู" },
    { term: "elephant", translation: "ช้าง" },
    { term: "tiger", translation: "เสือ" },
    { term: "lion", translation: "สิงโต" },
    { term: "bear", translation: "หมี" },
    { term: "rabbit", translation: "กระต่าย" },
    { term: "fox", translation: "จิ้งจอก" },
    { term: "wolf", translation: "หมาป่า" },
    { term: "deer", translation: "กวาง" },
    { term: "monkey", translation: "ลิง" },
    { term: "horse", translation: "ม้า" },
    { term: "cow", translation: "วัว" },
    { term: "pig", translation: "หมู" },
    { term: "sheep", translation: "แกะ" },
    { term: "goat", translation: "แพะ" },
    { term: "chicken", translation: "ไก่" },
    { term: "duck", translation: "เป็ด" },
    { term: "frog", translation: "กบ" },
    { term: "turtle", translation: "เต่า" },
    { term: "crocodile", translation: "จระเข้" },
  ];

  describe("createArchersRevengeState", () => {
    it("should create initial state with default settings (normal difficulty)", () => {
      const state = createArchersRevengeState(mockVocabulary);

      expect(state.status).toBe("playing");
      expect(state.hp).toBe(3);
      expect(state.score).toBe(0);
      expect(state.combo).toBe(0);
      expect(state.wave).toBe(1);
      expect(state.arrows).toEqual([]);
      expect(state.enemyProjectiles).toEqual([]);
    });

    it("should create enemy formation based on difficulty", () => {
      const easyState = createArchersRevengeState(mockVocabulary, {
        difficulty: "easy",
      });
      const normalState = createArchersRevengeState(mockVocabulary, {
        difficulty: "normal",
      });
      const hardState = createArchersRevengeState(mockVocabulary, {
        difficulty: "hard",
      });

      expect(easyState.enemies.length).toBe(10);
      expect(normalState.enemies.length).toBe(15);
      expect(hardState.enemies.length).toBe(20);
    });

    it("should assign shield down to exactly one enemy per wave", () => {
      const state = createArchersRevengeState(mockVocabulary);

      const shieldDownEnemies = state.enemies.filter((e) => !e.shieldUp);
      expect(shieldDownEnemies.length).toBe(1);
    });

    it("should set target word matching the shield-down enemy", () => {
      const state = createArchersRevengeState(mockVocabulary);

      const shieldDownEnemy = state.enemies.find((e) => !e.shieldUp);
      expect(shieldDownEnemy).toBeDefined();
      expect(state.targetWord.term).toBe(shieldDownEnemy!.term);
    });

    it("should place target enemy in the bottom row (visible to player)", () => {
      const state = createArchersRevengeState(mockVocabulary);

      const shieldDownEnemy = state.enemies.find((e) => !e.shieldUp);
      expect(shieldDownEnemy).toBeDefined();
      
      const bottomRow = Math.max(...state.enemies.map((e) => e.row));
      expect(shieldDownEnemy!.row).toBe(bottomRow);
    });

    it("should position enemies in a grid formation", () => {
      const state = createArchersRevengeState(mockVocabulary);

      state.enemies.forEach((enemy) => {
        expect(enemy.x).toBeGreaterThanOrEqual(0);
        expect(enemy.y).toBeGreaterThanOrEqual(0);
        expect(enemy.id).toBeDefined();
        expect(enemy.translation).toBeDefined();
      });
    });

    it("should leave room for formation to move horizontally", () => {
      const state = createArchersRevengeState(mockVocabulary);

      const maxX = Math.max(...state.enemies.map((e) => e.x));
      const minX = Math.min(...state.enemies.map((e) => e.x));
      
      expect(minX).toBeGreaterThan(20);
      expect(maxX).toBeLessThan(GAME_WIDTH - 20);
    });

    it("should throw error if vocabulary is empty", () => {
      expect(() => createArchersRevengeState([])).toThrow(
        "Vocabulary cannot be empty"
      );
    });

    it("should use custom rng if provided", () => {
      const fixedRng = () => 0.5;
      const state1 = createArchersRevengeState(mockVocabulary, {
        rng: fixedRng,
      });
      const state2 = createArchersRevengeState(mockVocabulary, {
        rng: fixedRng,
      });

      expect(state1.targetWord.term).toBe(state2.targetWord.term);
    });
  });

  describe("Enemy type", () => {
    it("should have correct enemy structure", () => {
      const enemy: Enemy = {
        id: "enemy-0-0",
        x: 100,
        y: 100,
        term: "cat",
        translation: "แมว",
        shieldUp: true,
        row: 0,
        column: 0,
      };

      expect(enemy.id).toBe("enemy-0-0");
      expect(enemy.shieldUp).toBe(true);
    });
  });

  describe("Arrow type", () => {
    it("should have correct arrow structure", () => {
      const arrow: Arrow = {
        id: "arrow-0",
        x: 200,
        y: 700,
        vy: -400,
      };

      expect(arrow.y).toBe(700);
      expect(arrow.vy).toBe(-400);
    });
  });

  describe("Projectile type", () => {
    it("should have correct projectile structure", () => {
      const projectile: Projectile = {
        id: "projectile-0",
        x: 150,
        y: 200,
        vy: 200,
      };

      expect(projectile.vy).toBe(200);
    });
  });
});
