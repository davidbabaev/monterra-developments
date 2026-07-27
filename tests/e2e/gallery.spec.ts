import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * The lightbox's keyboard and focus behaviour cannot be proved in jsdom — the
 * focus trap filters candidates by `offsetParent`, which needs layout. This is
 * where it is actually verified.
 */

const LARKIN = "/projects/the-larkin";

const dialog = (page: Page) => page.getByRole("dialog");
const counter = (page: Page) => page.getByText(/^\d+ \/ \d+$/);
const thumbnails = (page: Page) => page.getByRole("button", { name: /view larger/i });

/** The third thumbnail, deliberately: opening the first would hide an off-by-one. */
async function openThird(page: Page): Promise<Locator> {
  await page.goto(LARKIN);
  const third = thumbnails(page).nth(2);
  await third.click();
  await expect(dialog(page)).toBeVisible();
  return third;
}

test("the grid shows one thumbnail per image and no dialog until asked", async ({ page }) => {
  await page.goto(LARKIN);

  await expect(thumbnails(page)).toHaveCount(4);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("clicking the third thumbnail opens that image, not the first", async ({ page }) => {
  await openThird(page);

  await expect(counter(page)).toHaveText("3 / 4");
  await expect(dialog(page).getByRole("img")).toHaveAttribute("src", /gallery%2F03|gallery\/03/);
});

test("arrow keys navigate and the counter tracks, wrapping at the end", async ({ page }) => {
  await openThird(page);

  await page.keyboard.press("ArrowRight");
  await expect(counter(page)).toHaveText("4 / 4");

  await page.keyboard.press("ArrowRight");
  await expect(counter(page)).toHaveText("1 / 4");

  await page.keyboard.press("ArrowLeft");
  await expect(counter(page)).toHaveText("4 / 4");
});

test("focus lands inside the dialog on open", async ({ page }) => {
  await openThird(page);

  const focusIsInside = await page.evaluate(() => {
    const element = document.querySelector('[role="dialog"]');
    return element !== null && element.contains(document.activeElement);
  });
  expect(focusIsInside).toBe(true);
});

test("Escape closes and focus returns to the thumbnail that opened it", async ({ page }) => {
  const third = await openThird(page);
  const label = await third.getAttribute("aria-label");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Identity, not position: the exact element must have focus back.
  await expect(third).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe(label);
});

test("Tab cycles inside the dialog and never reaches the page behind", async ({ page }) => {
  await openThird(page);

  // Three controls in the dialog, tabbed ten times: it has to come round.
  for (let press = 0; press < 10; press += 1) {
    await page.keyboard.press("Tab");

    const inside = await page.evaluate(() => {
      const element = document.querySelector('[role="dialog"]');
      return element !== null && element.contains(document.activeElement);
    });
    expect(inside, `focus escaped on press ${press + 1}`).toBe(true);
  }

  await page.keyboard.press("Escape");
});

test("Shift+Tab also stays inside", async ({ page }) => {
  await openThird(page);

  for (let press = 0; press < 6; press += 1) {
    await page.keyboard.press("Shift+Tab");
    const inside = await page.evaluate(() => {
      const element = document.querySelector('[role="dialog"]');
      return element !== null && element.contains(document.activeElement);
    });
    expect(inside).toBe(true);
  }
});

test("the page behind is inert while open and released on close", async ({ page }) => {
  await openThird(page);

  expect(await page.locator("[inert]").count()).toBeGreaterThan(0);
  const dialogIsInert = await page.evaluate(
    () => document.querySelector('[role="dialog"]')?.closest("[inert]") !== null,
  );
  expect(dialogIsInert).toBe(false);

  await page.keyboard.press("Escape");
  expect(await page.locator("[inert]").count()).toBe(0);
});

test("scroll position survives open and close", async ({ page }) => {
  await page.goto(LARKIN);
  await thumbnails(page).nth(2).scrollIntoViewIfNeeded();

  const before = await page.evaluate(() => Math.round(window.scrollY));
  expect(before).toBeGreaterThan(0);

  await thumbnails(page).nth(2).click();
  await expect(dialog(page)).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(before);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("no horizontal scroll with the lightbox open", async ({ page }) => {
  await openThird(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Monterra Bay renders no gallery section at all", async ({ page }) => {
  await page.goto("/projects/monterra-bay");

  await expect(page.getByRole("heading", { name: /gallery/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /view larger/i })).toHaveCount(0);
});

test.describe("touch", () => {
  /**
   * Real TouchEvents built in the page, so React's own handlers run. Playwright's
   * touchscreen API only taps.
   */
  const drag = (page: Page, from: [number, number], to: [number, number]) =>
    page.evaluate(
      ([start, end]) => {
        const figure = document.querySelector('[role="dialog"] figure');
        if (figure === null) throw new Error("no figure");

        const touch = ([x, y]: number[]) =>
          new Touch({ identifier: 1, target: figure, clientX: x, clientY: y });

        figure.dispatchEvent(
          new TouchEvent("touchstart", { touches: [touch(start)], bubbles: true }),
        );
        figure.dispatchEvent(
          new TouchEvent("touchend", { changedTouches: [touch(end)], bubbles: true }),
        );
      },
      [from, to],
    );

  test("a horizontal swipe navigates, a vertical drag does not", async ({ page }) => {
    await openThird(page);

    await drag(page, [320, 400], [80, 415]);
    await expect(counter(page)).toHaveText("4 / 4");

    await drag(page, [80, 400], [320, 390]);
    await expect(counter(page)).toHaveText("3 / 4");

    // Vertical: a reader trying to scroll must not skip an image.
    await drag(page, [200, 500], [215, 120]);
    await expect(counter(page)).toHaveText("3 / 4");
  });
});

test.describe("reduced motion", () => {
  test("the lightbox is fully functional with animation suppressed", async ({ page }) => {
    // emulateMedia rather than `test.use({ reducedMotion })`: the fixture option
    // did not reach the page here, and a preference the page never saw would
    // make this test pass while proving nothing. The precondition below is the
    // guard against that happening silently again.
    await page.emulateMedia({ reducedMotion: "reduce" });

    const third = await openThird(page);

    expect(
      await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
    ).toBe(true);

    // Instant: no keyframes attached, and at full opacity from the first frame.
    const style = await dialog(page).evaluate((element) => {
      const computed = getComputedStyle(element);
      return { animationName: computed.animationName, opacity: computed.opacity };
    });
    expect(style).toEqual({ animationName: "none", opacity: "1" });

    // Still fully operable: navigation is not disabled to disable animation.
    await expect(counter(page)).toHaveText("3 / 4");
    await page.keyboard.press("ArrowRight");
    await expect(counter(page)).toHaveText("4 / 4");
    await page.getByRole("button", { name: "Previous image" }).click();
    await expect(counter(page)).toHaveText("3 / 4");

    await page.keyboard.press("Escape");
    await expect(third).toBeFocused();
  });
});
