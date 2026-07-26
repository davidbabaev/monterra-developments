import { expect, test } from "@playwright/test";

/**
 * Visual and behavioural checks for the design system. The screenshots this
 * produces are the evidence for the increment's done-when list.
 */

test.describe("styleguide", () => {
  test("renders every primitive section", async ({ page }) => {
    await page.goto("/styleguide");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Design system");
    for (const heading of [
      "Brand palette",
      "Contrast audit",
      "Type scale",
      "Button variants",
      "Card treatment",
      "Statistic treatment",
      "Supporting elements",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("is excluded from search", async ({ page }) => {
    await page.goto("/styleguide");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });

  test("every contrast pair passes its stated requirement", async ({ page }) => {
    await page.goto("/styleguide");
    const verdicts = page.locator("table tbody tr td:last-child");
    const count = await verdicts.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(verdicts.nth(index)).toHaveText("Pass");
    }
  });

  test("the page never scrolls horizontally", async ({ page }) => {
    await page.goto("/styleguide");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("buttons take a visible bronze focus ring from the keyboard", async ({ page }) => {
    await page.goto("/styleguide");
    const button = page.getByRole("button", { name: "View our projects" }).first();

    // Must arrive by keyboard: :focus-visible deliberately does not match a
    // programmatic .focus(), so tabbing is the only honest way to check this.
    await page.keyboard.press("Tab");
    for (let step = 0; step < 20; step += 1) {
      if (await button.evaluate((element) => element === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }
    await expect(button).toBeFocused();
    // transition-colors covers outline-color in Tailwind v4, so let the 150ms
    // settle before sampling or we read a mid-transition blend.
    await page.waitForTimeout(300);

    const outline = await button.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        color: styles.outlineColor,
        width: styles.outlineWidth,
        style: styles.outlineStyle,
      };
    });

    // #A87842
    expect(outline.color).toBe("rgb(168, 120, 66)");
    expect(outline.width).toBe("2px");
    expect(outline.style).not.toBe("none");
  });

  test("SplitHeading puts both halves on one baseline", async ({ page }) => {
    await page.goto("/styleguide");
    const heading = page.getByRole("heading", { level: 1, name: "Design system" });
    const lede = heading.locator("span").first();

    const [ledeBox, headingBox] = await Promise.all([lede.boundingBox(), heading.boundingBox()]);
    expect(ledeBox).not.toBeNull();
    expect(headingBox).not.toBeNull();

    // The lede is set 1.08em, so its box is taller than the Manrope text but
    // must sit within the same line box rather than shifting the baseline.
    expect(ledeBox!.y).toBeGreaterThanOrEqual(headingBox!.y - 2);
  });
});
