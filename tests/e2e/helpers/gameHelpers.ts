import { expect, type Page } from "@playwright/test";

import {
  ARCHERS_REVENGE_GAME_PATH,
  ARCHERS_REVENGE_SAMPLE_VOCABULARY,
  DRAGON_FLIGHT_GAME_PATH,
  DRAGON_FLIGHT_SAMPLE_VOCABULARY,
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
