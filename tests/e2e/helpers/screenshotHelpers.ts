import fs from "node:fs/promises";
import path from "node:path";

import type { Page } from "@playwright/test";

import {
  ARCHERS_REVENGE_SCREENSHOT_DIR,
  ARCHERS_REVENGE_SCREENSHOT_FILE,
  DRAGON_FLIGHT_SCREENSHOT_DIR,
  DRAGON_FLIGHT_SCREENSHOT_FILE,
  DRAGON_RIDER_SCREENSHOT_DIR,
  DRAGON_RIDER_SCREENSHOT_FILE,
  ENCHANTED_LIBRARY_SCREENSHOT_DIR,
  ENCHANTED_LIBRARY_SCREENSHOT_FILE,
  MAGIC_DEFENSE_SCREENSHOT_DIR,
  MAGIC_DEFENSE_SCREENSHOT_FILE,
  PALADINS_TWIN_SOUL_SCREENSHOT_DIR,
  PALADINS_TWIN_SOUL_SCREENSHOT_FILE,
  RPG_BATTLE_SCREENSHOT_DIR,
  RPG_BATTLE_SCREENSHOT_FILE,
} from "../fixtures/gameFixtures";

export async function captureArchersRevengeScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), ARCHERS_REVENGE_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, ARCHERS_REVENGE_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function captureDragonFlightScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), DRAGON_FLIGHT_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, DRAGON_FLIGHT_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function captureDragonRiderScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), DRAGON_RIDER_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, DRAGON_RIDER_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function captureEnchantedLibraryScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), ENCHANTED_LIBRARY_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, ENCHANTED_LIBRARY_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function captureMagicDefenseScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), MAGIC_DEFENSE_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, MAGIC_DEFENSE_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function capturePaladinsTwinSoulScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), PALADINS_TWIN_SOUL_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, PALADINS_TWIN_SOUL_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

export async function captureRPGBattleScreenshot(page: Page) {
  const screenshotDir = path.join(process.cwd(), RPG_BATTLE_SCREENSHOT_DIR);
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, RPG_BATTLE_SCREENSHOT_FILE);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}
