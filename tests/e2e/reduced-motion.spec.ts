import { expect, test, type Page } from "@playwright/test";
import { openAndWaitFor } from "./support/interactions";

/**
 * With prefers-reduced-motion set, nothing on the site animates.
 *
 * Every motion in the system is gated behind Tailwind's motion-safe, which is
 * `@media (prefers-reduced-motion: no-preference)`. This asserts the gate holds
 * for each of them rather than trusting that the variant was remembered: the
 * count-up, the card lift, the nav stagger and the lightbox fade.
 *
 * emulateMedia, not `test.use({ reducedMotion })` — the fixture option was
 * observed not to reach the page in this suite, and a preference the page never
 * saw would make all of this pass while proving nothing.
 */

async function withReducedMotion(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path, { waitUntil: "load" });

  expect(
    await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
    "the preference reached the page",
  ).toBe(true);
}

/** Anything the browser is currently animating, anywhere in the document. */
const runningAnimations = (page: Page) =>
  page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === "running").length,
  );

test("the statistics do not count up", async ({ page }) => {
  await withReducedMotion(page, "/");

  // The figure is the paragraph beside its label, not simply the first
  // font-display paragraph on the page — that is the section eyebrow.
  const figure = page.getByText("Homes delivered").locator("..").locator("p").first();
  await expect(figure).toHaveText("340");

  await page.getByText("Homes delivered").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Final value from the first frame, and never a frame of animation.
  await expect(figure).toHaveText("340");
  expect(await runningAnimations(page)).toBe(0);
});

test("a project card does not lift or scale on hover", async ({ page }) => {
  await withReducedMotion(page, "/projects");

  // The listing hydrates into a client component, which replaces these nodes.
  // Locating before that finishes hands back an element that is already detached.
  await page.waitForLoadState("load");

  const card = page.getByRole("link").filter({ hasText: "Monterra Ridge" }).first();
  await card.scrollIntoViewIfNeeded();

  const before = await card.evaluate((element) => getComputedStyle(element).transform);
  await card.hover();
  await page.waitForTimeout(400);
  const after = await card.evaluate((element) => getComputedStyle(element).transform);

  expect(after).toBe(before);
  expect(await runningAnimations(page)).toBe(0);
});

test("the mobile nav links do not stagger in", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withReducedMotion(page, "/");

  await openAndWaitFor(
    page.getByRole("button", { name: "Open menu" }),
    page.getByRole("dialog", { name: "Main menu" }),
  );

  const links = page.getByRole("dialog").getByRole("link");
  await expect(links.first()).toBeVisible();

  // Present at full opacity immediately, with no keyframes attached.
  const states = await links.evaluateAll((elements) =>
    elements.map((element) => ({
      opacity: getComputedStyle(element.parentElement as HTMLElement).opacity,
      animationName: getComputedStyle(element.parentElement as HTMLElement).animationName,
    })),
  );

  for (const state of states) {
    expect(state.opacity).toBe("1");
    expect(state.animationName).toBe("none");
  }
  expect(await runningAnimations(page)).toBe(0);
});

test("the lightbox does not fade in", async ({ page }) => {
  await withReducedMotion(page, "/projects/the-larkin");

  const dialog = page.getByRole("dialog");
  await openAndWaitFor(page.getByRole("button", { name: /view larger/i }).first(), dialog);

  const style = await dialog.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { animationName: computed.animationName, opacity: computed.opacity };
  });

  expect(style).toEqual({ animationName: "none", opacity: "1" });
  expect(await runningAnimations(page)).toBe(0);
});
