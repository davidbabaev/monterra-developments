import { expect, test, type Page } from "@playwright/test";

/**
 * About, Our Process, Team and Privacy. What is checked here is what only a
 * browser can settle: that the offset composition collapses, that the process
 * stages alternate, that a touch device gets colour portraits, and that no page
 * ends up with two h1s or a sideways scrollbar.
 */

const PAGES = ["/about", "/process", "/team", "/privacy"] as const;

const overflowOf = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const path of PAGES) {
  test(`${path} has exactly one h1 and never scrolls sideways`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);

    for (const width of [320, 390, 768, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await overflowOf(page), `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("about collapses its offset composition below 768px, like home", async ({ page }) => {
  await page.goto("/about");

  // Scoped to the composition: the breadcrumb slab under the hero is also stone.
  const composition = page
    .locator("section")
    .filter({ has: page.locator("img[src*='story-placeholder']") })
    .last();
  const slab = composition.locator(".bg-stone").first();
  const rule = composition.locator(".bg-bronze").first();
  const image = page.locator("img[src*='story-placeholder']");
  const isWide = (page.viewportSize()?.width ?? 0) >= 768;

  if (isWide) {
    await expect(slab).toBeVisible();
    await expect(rule).toBeHidden();

    const slabBox = await slab.boundingBox();
    const imageBox = await image.boundingBox();
    expect(imageBox!.x - slabBox!.x).toBeGreaterThan(30);
    expect(imageBox!.y - slabBox!.y).toBeGreaterThan(30);
  } else {
    await expect(slab).toBeHidden();
    await expect(rule).toBeVisible();
    expect(Math.round((await rule.boundingBox())!.height)).toBe(6);
  }
});

test("about reuses the quote, the stats band and the closing band", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByRole("blockquote")).toHaveCount(1);
  await expect(page.getByText("Units delivered")).toBeVisible();
  await expect(page.getByRole("link", { name: /contact us/i }).last()).toHaveAttribute(
    "href",
    "/contact",
  );
});

test("the process stages are numbered 01 to 05 and alternate sides", async ({ page }) => {
  await page.goto("/process");

  const numerals = page.locator("main [aria-hidden='true']").filter({ hasText: /^0\d$/ });
  await expect(numerals).toHaveCount(5);
  expect(await numerals.allTextContents()).toEqual(["01", "02", "03", "04", "05"]);

  const isWide = (page.viewportSize()?.width ?? 0) >= 768;

  const sides = await page.evaluate(() => {
    const stages = [...document.querySelectorAll("ol[aria-label=\"Our process\"] > li")];
    return stages.map((stage) => {
      const image = stage.querySelector("img")!.getBoundingClientRect();
      const text = stage.querySelector("h2")!.getBoundingClientRect();
      return image.x < text.x ? "image-left" : "image-right";
    });
  });

  if (isWide) {
    // Alternating, starting with the image on the left.
    expect(sides).toEqual([
      "image-left",
      "image-right",
      "image-left",
      "image-right",
      "image-left",
    ]);
  } else {
    // Stacked: every image starts at the same x as its words.
    const stacked = await page.evaluate(() =>
      [...document.querySelectorAll("ol[aria-label=\"Our process\"] > li")].every((stage) => {
        const image = stage.querySelector("img")!.getBoundingClientRect();
        const text = stage.querySelector("h2")!.getBoundingClientRect();
        return Math.abs(image.x - text.x) < 2 && image.y < text.y;
      }),
    );
    expect(stacked).toBe(true);
  }
});

test("only the process page carries numerals", async ({ page }) => {
  for (const path of ["/about", "/team", "/privacy", "/projects"]) {
    await page.goto(path);
    const numerals = page.locator("main [aria-hidden='true']").filter({ hasText: /^0\d$/ });
    await expect(numerals, `numerals on ${path}`).toHaveCount(0);
  }
});

test("the team grid shows a link only for the members who have one", async ({ page }) => {
  await page.goto("/team");

  const members = page.locator("ul[aria-label=\"Team\"] > li");
  await expect(members).toHaveCount(4);

  // The seed deliberately leaves one member without a linkedin field.
  const links = page.locator("ul[aria-label=\"Team\"] > li a");
  await expect(links).toHaveCount(3);
  await expect(links.first()).toHaveAccessibleName(/on LinkedIn/);

  // No icon and no gap: the member without one renders no anchor and no svg.
  const lastMember = members.nth(3);
  await expect(lastMember.locator("a")).toHaveCount(0);
  await expect(lastMember.locator("svg")).toHaveCount(0);
});

test.describe("team portraits on a touch device", () => {
  test.use({ hasTouch: true, isMobile: true });

  test("are full colour, because hover can never fire there", async ({ page }) => {
    await page.goto("/team");

    const filters = await page.evaluate(() =>
      [...document.querySelectorAll("ul[aria-label=\"Team\"] > li img")].map(
        (image) => getComputedStyle(image).filter,
      ),
    );

    expect(filters).toHaveLength(4);
    for (const filter of filters) expect(filter).toBe("none");
  });
});

test("team portraits are greyscale at rest where hovering is possible", async ({ page }) => {
  await page.goto("/team");
  test.skip((page.viewportSize()?.width ?? 0) < 768, "checked on the desktop project");

  const filter = await page
    .locator("main ul > li img")
    .first()
    .evaluate((image) => getComputedStyle(image).filter);

  expect(filter).toContain("grayscale");
});

test("privacy is a single prose column at the 68ch measure", async ({ page }) => {
  await page.goto("/privacy");

  const column = page.locator("main .max-w-\\[68ch\\]");
  await expect(column).toHaveCount(1);

  await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveCount(5);
  await expect(page.getByText(/not a privacy policy/i)).toBeVisible();
});
