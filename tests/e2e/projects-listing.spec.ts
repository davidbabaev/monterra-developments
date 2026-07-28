import { expect, test, type Page } from "@playwright/test";

/** The projects listing: cards, the three card variants, filtering, empty state. */

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 1280;

/** Scoped to the grid: the footer is full of list items containing links too. */
const cards = (page: Page) =>
  page.getByRole("list", { name: "Projects" }).getByRole("listitem");

test.describe("the grid", () => {
  test("renders all three projects, each linking to a working detail route", async ({ page }) => {
    await page.goto("/projects");
    await expect(cards(page)).toHaveCount(3);

    for (const slug of ["monterra-ridge", "monterra-bay", "the-larkin"]) {
      const link = page.locator(`a[href="/projects/${slug}"]`);
      await expect(link).toHaveCount(1);
    }

    const response = await page.goto("/projects/monterra-bay");
    expect(response?.status()).toBe(200);
  });

  test("keeps the order the loader returns", async ({ page }) => {
    await page.goto("/projects");
    const headings = await page.getByRole("heading", { level: 3 }).allTextContents();
    expect(headings).toEqual(["Monterra Ridge", "Monterra Bay", "The Larkin"]);
  });

  test("every card image is a real 3:2 crop with intrinsic dimensions", async ({ page }) => {
    await page.goto("/projects");
    const images = page.locator("li img");
    await expect(images).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      const box = await images.nth(index).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
      await expect(images.nth(index)).toHaveAttribute("alt", /\S/);
    }
  });
});

test.describe("the upcoming card variant", () => {
  test("reads as deliberate: no units, no completion, no stray separators", async ({ page }) => {
    await page.goto("/projects");
    const bay = cards(page).filter({ hasText: "Monterra Bay" });

    await expect(bay.getByText("Upcoming")).toBeVisible();
    await expect(bay.getByText("Register interest")).toBeVisible();
    await expect(bay).toContainText("Condominiums · Tampa, FL");

    // Nothing that only a completed or current project has.
    await expect(bay).not.toContainText("units");
    await expect(bay).not.toContainText("View project");

    const text = (await bay.innerText()).replace(/\s+/g, " ");
    expect(text).not.toMatch(/·\s*·/);
    expect(text).not.toMatch(/·\s*$/m);
    expect(text).not.toMatch(/^\s*·/m);
  });

  test("a completed card carries the full metadata line", async ({ page }) => {
    await page.goto("/projects");
    const larkin = cards(page).filter({ hasText: "The Larkin" });
    await expect(larkin).toContainText("Condominiums · 32 units · 2024");
    await expect(larkin.getByText("View project")).toBeVisible();
    await expect(larkin.getByText("Completed")).toBeVisible();
  });

  test("a current card carries units and completion", async ({ page }) => {
    await page.goto("/projects");
    const ridge = cards(page).filter({ hasText: "Monterra Ridge" });
    await expect(ridge).toContainText("Townhomes · Duplexes · 48 units · Q3 2027");
    await expect(ridge.getByText("Current")).toBeVisible();
  });
});

test.describe("the status filter", () => {
  test("shows a count per pill, derived from the data", async ({ page }) => {
    await page.goto("/projects");
    for (const [label, count] of [
      ["All", "3"],
      ["Current", "1"],
      ["Completed", "1"],
      ["Upcoming", "1"],
    ]) {
      await expect(page.getByRole("button", { name: new RegExp(`^${label}`) })).toContainText(count);
    }
  });

  test("filtering changes the visible cards and the URL, without a reload", async ({ page }) => {
    await page.goto("/projects");
    await page.evaluate(() => {
      (window as unknown as { __stayed: boolean }).__stayed = true;
    });

    await page.getByRole("button", { name: /^Upcoming/ }).click();

    await expect(page).toHaveURL(/\?status=upcoming$/);
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("Monterra Bay");

    // No navigation happened, so the marker survives.
    expect(await page.evaluate(() => (window as unknown as { __stayed?: boolean }).__stayed)).toBe(
      true,
    );
  });

  test("a direct visit to a filtered URL renders pre-filtered", async ({ page }) => {
    await page.goto("/projects?status=upcoming");
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("Monterra Bay");
    await expect(page.getByRole("button", { name: /^Upcoming/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("reloading a filtered URL keeps the filter", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("button", { name: /^Completed/ }).click();
    await expect(page).toHaveURL(/\?status=completed$/);

    await page.reload();
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("The Larkin");
  });

  test("selecting All clears the parameter", async ({ page }) => {
    await page.goto("/projects?status=current");
    await expect(cards(page)).toHaveCount(1);

    await page.getByRole("button", { name: /^All/ }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(cards(page)).toHaveCount(3);
  });

  test("aria-pressed reflects the selection", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("button", { name: /^All/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("button", { name: /^Current/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("is fully operable by keyboard with a visible bronze focus ring", async ({ page }) => {
    await page.goto("/projects");
    const upcoming = page.getByRole("button", { name: /^Upcoming/ });

    await page.keyboard.press("Tab");
    for (let step = 0; step < 25; step += 1) {
      if (await upcoming.evaluate((element) => element === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }
    await expect(upcoming).toBeFocused();
    await page.waitForTimeout(300);

    const outline = await upcoming.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { color: styles.outlineColor, width: styles.outlineWidth };
    });
    expect(outline.color).toBe("rgb(168, 120, 66)");
    expect(outline.width).toBe("2px");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\?status=upcoming$/);
    await expect(cards(page)).toHaveCount(1);
  });
});

test.describe("the empty state", () => {
  test("is reachable and restores every project", async ({ page }) => {
    // No pill can produce this with three seeds, but a stale link can.
    await page.goto("/projects?status=archived");

    await expect(page.getByRole("heading", { name: "No projects in this stage yet" })).toBeVisible();
    await expect(cards(page)).toHaveCount(0);

    // Nothing claims to be selected, because nothing is.
    for (const label of ["All", "Current", "Completed", "Upcoming"]) {
      await expect(page.getByRole("button", { name: new RegExp(`^${label}`) })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }

    await page.getByRole("button", { name: "View all projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(cards(page)).toHaveCount(3);
  });
});

test.describe("the footer deep links", () => {
  for (const [status, expected] of [
    ["completed", "The Larkin"],
    ["current", "Monterra Ridge"],
    ["upcoming", "Monterra Bay"],
  ]) {
    test(`the ${status} link lands pre-filtered`, async ({ page }) => {
      await page.goto("/about");
      await page.locator(`footer a[href="/projects?status=${status}"]`).click();

      await expect(page).toHaveURL(new RegExp(`/projects\\?status=${status}$`));
      await expect(cards(page)).toHaveCount(1);
      await expect(cards(page).first()).toContainText(expected);
    });
  }
});

test.describe("layout", () => {
  test("uses the right column count for the viewport", async ({ page }) => {
    await page.goto("/projects");

    const grid = page.locator("ul.grid").first();
    await expect(grid).toBeVisible();

    /**
     * Retried, and the raw value is asserted before it is counted.
     *
     * `gridTemplateColumns` is the string "none" until the stylesheet has
     * applied. Splitting that on a space gives one token, which counts as one
     * column and reads exactly like a correct mobile result — so on desktop it
     * failed as "expected 3, received 1" and on mobile it would have passed for
     * entirely the wrong reason.
     */
    await expect(async () => {
      const columns = await grid.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns,
      );
      expect(columns, "the grid had not been laid out").not.toBe("none");
      expect(columns.split(" ").length).toBe(isMobile(page) ? 1 : 3);
    }).toPass({ timeout: 5_000 });
  });

  test("no horizontal scroll at any width", async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/projects");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});
