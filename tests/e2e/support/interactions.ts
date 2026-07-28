import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Clicks a control and waits for the thing it opens, retrying the pair.
 *
 * A click that lands before React has hydrated is simply lost: the element is in
 * the DOM and Playwright happily clicks it, but no handler is attached yet, so
 * nothing happens and the wait for the dialog times out. Retrying the click is
 * the reliable fix — `waitUntil: "load"` is not enough, because hydration
 * happens after the load event, and there is no event that marks it.
 *
 * Only needed under parallel load; alone these tests pass first time, which is
 * exactly what makes the flake worth handling rather than re-running.
 */
export async function openAndWaitFor(trigger: Locator, opened: Locator): Promise<void> {
  await expect(async () => {
    await trigger.click();
    await expect(opened).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
}

/**
 * Waits for every running CSS animation to finish.
 *
 * Anything measured off rendered pixels has to happen after the pixels have
 * stopped moving. The mobile nav items animate in over 240ms from `opacity: 0`,
 * and an axe scan that lands inside that window measures ivory text at partial
 * opacity against navy and reports a serious colour-contrast violation — for a
 * pair that is declared in lib/design-tokens.ts and passes at rest. It failed
 * about one full parallel run in five.
 *
 * Infinite animations are skipped, since waiting on one would never return.
 */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const running = document
      .getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity);

    // A cancelled animation rejects; that is still "no longer moving".
    await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)));
  });
}
