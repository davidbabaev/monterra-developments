import { expect, type Locator } from "@playwright/test";

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
