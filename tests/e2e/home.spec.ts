import { expect, test, type Page } from "@playwright/test";

/**
 * The homepage's browser-only behaviour: the count-up that must fire once and
 * never again, the overlap that must collapse, the carousel that must snap
 * without swallowing vertical scroll, and the hero that must leave the next
 * section peeking.
 */

const figures = (page: Page) => page.locator("main p.font-display.text-\\[40px\\]");

/** The first stat, "units delivered", whose final value is 1,240. */
const firstFigure = (page: Page) => figures(page).first();

async function scrollToStats(page: Page) {
  await page.getByText("Units delivered").scrollIntoViewIfNeeded();
}

test("renders six sections and exactly one h1", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("We build");

  // Hero, positioning, featured, stats, process, closing — and no seventh.
  await expect(page.locator("main > section, main > div > section")).toHaveCount(6);
});

test("the hero leaves the next section peeking", async ({ page }) => {
  await page.goto("/");

  const hero = page.locator("main section").first();
  const box = await hero.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();

  const ratio = box!.height / viewport!.height;
  const expected = viewport!.width >= 1280 ? 0.88 : 0.78;

  expect(ratio).toBeGreaterThan(expected - 0.02);
  expect(ratio).toBeLessThan(expected + 0.02);
  // Something of the next section is on screen without scrolling.
  expect(box!.height).toBeLessThan(viewport!.height);
});

test("the hero image is eager, not lazy, and preloaded", async ({ page }) => {
  await page.goto("/");

  const image = page.locator("main section").first().locator("img");
  await expect(image).toHaveAttribute("src", /hero-placeholder/);

  // No loading attribute at all is eager; "lazy" is the failure being guarded.
  expect(await image.getAttribute("loading")).not.toBe("lazy");

  // Next 16 implements `priority` as a head preload rather than a fetchpriority
  // attribute on the element, so that is what proves it here.
  const preload = page.locator('link[rel="preload"][as="image"]');
  await expect(preload).toHaveCount(1);
  await expect(preload).toHaveAttribute("imagesrcset", /hero-placeholder/);
});

test("no horizontal scroll from 320 to 1920", async ({ page }) => {
  await page.goto("/");

  for (const width of [320, 390, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
  }
});

test("the offset composition overlaps on desktop and collapses on mobile", async ({ page }) => {
  await page.goto("/");

  const isDesktop = (page.viewportSize()?.width ?? 0) >= 768;
  const slab = page.locator("main .bg-stone").first();
  const rule = page.locator("main .bg-bronze").first();

  if (isDesktop) {
    // The slab is visible and the image sits offset over it, so the slab shows
    // along two edges.
    await expect(slab).toBeVisible();
    await expect(rule).toBeHidden();

    const slabBox = await slab.boundingBox();
    const imageBox = await page
      .locator("img[src*='positioning-placeholder']")
      .boundingBox();

    expect(imageBox!.x - slabBox!.x).toBeGreaterThan(30);
    expect(imageBox!.y - slabBox!.y).toBeGreaterThan(30);
    expect(imageBox!.x + imageBox!.width).toBeGreaterThan(slabBox!.x + slabBox!.width - 2);
  } else {
    await expect(slab).toBeHidden();
    await expect(rule).toBeVisible();

    const ruleBox = await rule.boundingBox();
    const imageBox = await page
      .locator("img[src*='positioning-placeholder']")
      .boundingBox();

    expect(Math.round(ruleBox!.height)).toBe(6);
    expect(ruleBox!.y).toBeLessThan(imageBox!.y);
    // Fully collapsed: no horizontal offset left.
    expect(Math.abs(imageBox!.x - ruleBox!.x)).toBeLessThan(2);
  }
});

test("the featured carousel snaps on mobile and grids on desktop", async ({ page }) => {
  await page.goto("/");

  const list = page.getByText("Selected work").locator("..").locator("ul");
  const layout = await list.evaluate((element) => {
    const style = getComputedStyle(element);
    return { display: style.display, snapType: style.scrollSnapType, overflowX: style.overflowX };
  });

  if ((page.viewportSize()?.width ?? 0) >= 768) {
    expect(layout.display).toBe("grid");
    return;
  }

  expect(layout.display).toBe("flex");
  expect(layout.snapType).toContain("mandatory");
  expect(layout.overflowX).toBe("auto");

  // A peek of the next card: the row is wider than the viewport.
  const scrollable = await list.evaluate((el) => el.scrollWidth > el.clientWidth + 8);
  expect(scrollable).toBe(true);
});

test("the carousel does not swallow vertical page scroll", async ({ page }) => {
  await page.goto("/");
  test.skip((page.viewportSize()?.width ?? 0) >= 768, "carousel only exists below 768px");

  const list = page.getByText("Selected work").locator("..").locator("ul");
  await list.scrollIntoViewIfNeeded();

  const before = await page.evaluate(() => Math.round(window.scrollY));
  await list.hover();
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => Math.round(window.scrollY));

  expect(after).toBeGreaterThan(before);
});

test("the stats count up once and do not replay", async ({ page }) => {
  await page.goto("/");

  // Before the band is reached, the figures have been reset to zero.
  await expect(firstFigure(page)).toHaveText("0");

  await scrollToStats(page);
  await expect(firstFigure(page)).toHaveText("1,240", { timeout: 4000 });

  // Away and back: the final value stays put rather than restarting at zero.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await expect(firstFigure(page)).toHaveText("1,240");

  await scrollToStats(page);
  await page.waitForTimeout(400);
  await expect(firstFigure(page)).toHaveText("1,240");
});

test("with reduced motion the stats are final immediately and never animate", async ({ page }) => {
  // emulateMedia, not test.use: the fixture option has been observed not to
  // reach the page in this suite, which would make this pass while proving
  // nothing. The precondition below is the guard.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );

  // Never zeroed, even while off screen.
  await expect(firstFigure(page)).toHaveText("1,240");

  await scrollToStats(page);
  await page.waitForTimeout(600);
  await expect(firstFigure(page)).toHaveText("1,240");

  const running = await page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === "running").length,
  );
  expect(running).toBe(0);
});

test("numerals appear only on the process steps", async ({ page }) => {
  await page.goto("/");

  const numerals = page.locator("main [aria-hidden='true']").filter({ hasText: /^0\d$/ });
  await expect(numerals).toHaveCount(3);
  await expect(numerals.first()).toHaveText("01");
});

test("every section links where it says it does", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "View our projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(page.getByRole("link", { name: "Start a conversation" })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(page.getByRole("link", { name: "View all projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(page.getByRole("link", { name: "How we build" })).toHaveAttribute("href", "/process");
});
