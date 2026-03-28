import fs from "node:fs/promises";
import path from "node:path";

import type { Page } from "@playwright/test";

import {
  ARCHERS_REVENGE_SCREENSHOT_DIR,
  ARCHERS_REVENGE_SCREENSHOT_FILE,
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
