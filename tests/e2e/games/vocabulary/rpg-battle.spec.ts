import { expect, test } from "@playwright/test";

import { RPG_BATTLE_SAMPLE_VOCABULARY } from "../../fixtures/gameFixtures";
import { captureRPGBattleScreenshot } from "../../helpers/screenshotHelpers";
import {
  expectRPGBattleStartScreen,
  getRPGBattleUrl,
  mockRPGBattleApis,
} from "../../helpers/gameHelpers";

test.describe("rpg-battle", () => {
  test("loads rpg-battle with the shared sample vocabulary and captures gameplay", async ({
    page,
  }) => {
    await mockRPGBattleApis(page);

    await page.goto(getRPGBattleUrl(), { waitUntil: "domcontentloaded" });

    await expectRPGBattleStartScreen(page);
    await expect(page.getByText(RPG_BATTLE_SAMPLE_VOCABULARY[0].term)).toBeVisible();
    await expect(page.getByText(RPG_BATTLE_SAMPLE_VOCABULARY[0].translation)).toBeVisible();

    await page.getByRole("button", { name: /start battle/i }).click();

    await expect(page.locator("canvas")).toBeVisible();

    const screenshotPath = await captureRPGBattleScreenshot(page);
    expect(screenshotPath).toContain(
      "/public/games/rpg-battle/rpg-battle-gameplay.png"
    );
  });
});
