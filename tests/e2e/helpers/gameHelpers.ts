import { expect, type Page } from "@playwright/test";

import {
  ARCHERS_REVENGE_GAME_PATH,
  ARCHERS_REVENGE_SAMPLE_VOCABULARY,
  DRAGON_FLIGHT_GAME_PATH,
  DRAGON_FLIGHT_SAMPLE_VOCABULARY,
  DRAGON_RIDER_GAME_PATH,
  DRAGON_RIDER_SAMPLE_VOCABULARY,
  ENCHANTED_LIBRARY_GAME_PATH,
  ENCHANTED_LIBRARY_SAMPLE_VOCABULARY,
  MAGIC_DEFENSE_GAME_PATH,
  MAGIC_DEFENSE_SAMPLE_VOCABULARY,
  PALADINS_TWIN_SOUL_GAME_PATH,
  PALADINS_TWIN_SOUL_SAMPLE_VOCABULARY,
  RPG_BATTLE_GAME_PATH,
  RPG_BATTLE_SAMPLE_VOCABULARY,
  RUNE_MATCH_GAME_PATH,
  RUNE_MATCH_SAMPLE_VOCABULARY,
} from "../fixtures/gameFixtures";

type ApiResponse = {
  status: number;
  message: string;
  vocabulary?: unknown[];
  xpEarned?: number;
  activityId?: string;
};

export async function mockArchersRevengeApis(
  page: Page,
  vocabulary = ARCHERS_REVENGE_SAMPLE_VOCABULARY
) {
  await page.route("**/api/v1/games/archers-revenge/vocabulary", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("**/api/v1/games/archers-revenge/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectArchersRevengeStartScreen(page: Page) {
  await expect(page.getByText(/loading vocabulary/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /draw your bow/i })).toBeVisible();
}

export function getArchersRevengeUrl() {
  return ARCHERS_REVENGE_GAME_PATH;
}

export async function mockDragonFlightApis(
  page: Page,
  vocabulary = DRAGON_FLIGHT_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/dragon-flight/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/dragon-flight/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectDragonFlightStartScreen(page: Page) {
  await expect(page.getByRole("button", { name: /start game/i })).toBeVisible({ timeout: 15000 });
}

export function getDragonFlightUrl() {
  return DRAGON_FLIGHT_GAME_PATH;
}

export async function mockDragonRiderApis(
  page: Page,
  vocabulary = DRAGON_RIDER_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/dragon-rider/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/dragon-rider/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectDragonRiderStartScreen(page: Page) {
  await expect(page.getByRole("button", { name: /start adventure/i })).toBeVisible({ timeout: 15000 });
}

export function getDragonRiderUrl() {
  return DRAGON_RIDER_GAME_PATH;
}

export async function mockEnchantedLibraryApis(
  page: Page,
  vocabulary = ENCHANTED_LIBRARY_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/enchanted-library/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/enchanted-library/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/enchanted-library/ranking", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ rankings: { easy: [], normal: [], hard: [], extreme: [] } }),
    });
  });
}

export async function expectEnchantedLibraryStartScreen(page: Page) {
  await expect(page.getByText(/Enchanted Library/i)).toBeVisible({ timeout: 15000 });
}

export function getEnchantedLibraryUrl() {
  return ENCHANTED_LIBRARY_GAME_PATH;
}

export async function mockMagicDefenseApis(
  page: Page,
  vocabulary = MAGIC_DEFENSE_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/magic-defense/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/magic-defense/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectMagicDefenseStartScreen(page: Page) {
  await expect(page.getByText(/Magic Defense/i)).toBeVisible({ timeout: 15000 });
}

export function getMagicDefenseUrl() {
  return MAGIC_DEFENSE_GAME_PATH;
}

export async function mockPaladinsTwinSoulApis(
  page: Page,
  vocabulary = PALADINS_TWIN_SOUL_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/paladins-twin-soul/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/paladins-twin-soul/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectPaladinsTwinSoulStartScreen(page: Page) {
  await expect(page.getByText(/Paladin/i)).toBeVisible({ timeout: 15000 });
}

export function getPaladinsTwinSoulUrl() {
  return PALADINS_TWIN_SOUL_GAME_PATH;
}

export async function mockRPGBattleApis(
  page: Page,
  vocabulary = RPG_BATTLE_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/rpg-battle/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/rpg-battle/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectRPGBattleStartScreen(page: Page) {
  await expect(page.getByText(/RPG Battle/i)).toBeVisible({ timeout: 15000 });
}

export function getRPGBattleUrl() {
  return RPG_BATTLE_GAME_PATH;
}

export async function mockRuneMatchApis(
  page: Page,
  vocabulary = RUNE_MATCH_SAMPLE_VOCABULARY
) {
  await page.route("/api/v1/games/rune-match/vocabulary", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Vocabulary retrieved successfully",
      vocabulary,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  await page.route("/api/v1/games/rune-match/complete", async (route) => {
    const response: ApiResponse = {
      status: 200,
      message: "Game completed successfully",
      xpEarned: 0,
      activityId: "mock-activity-playwright",
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function expectRuneMatchStartScreen(page: Page) {
  await expect(page.getByText(/Rune Match/i)).toBeVisible({ timeout: 15000 });
}

export function getRuneMatchUrl() {
  return RUNE_MATCH_GAME_PATH;
}
