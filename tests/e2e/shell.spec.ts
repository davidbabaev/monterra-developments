import { expect, test, type Page } from "@playwright/test";

/** The layout shell: header, mobile nav, hero, contact band, footer. */

const ROUTES = ["/", "/projects", "/about", "/process", "/team", "/contact", "/privacy"];

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 1280;

test.describe("routing", () => {
  for (const route of ROUTES) {
    test(`${route} responds and renders one h1`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }

  test("an unknown project slug renders the custom 404", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Page not found");
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  });

  test("a known project slug renders the shell", async ({ page }) => {
    await page.goto("/projects/monterra-ridge");
    // The last crumb is the project's title now that the page renders real
    // content; it was the raw slug while the route was a placeholder.
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
      "Monterra Ridge",
    );
  });
});

test.describe("header", () => {
  test("transitions at 40px and does not flicker across the threshold", async ({ page }) => {
    await page.goto("/projects");
    const header = page.locator("header");

    await expect(header).toHaveAttribute("data-scrolled", "false");

    await page.evaluate(() => window.scrollTo(0, 41));
    await expect(header).toHaveAttribute("data-scrolled", "true");

    // Hysteresis: creeping back to just under the threshold must not flip it.
    const states: string[] = [];
    for (const y of [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25]) {
      await page.evaluate((target) => window.scrollTo(0, target), y);
      await page.waitForTimeout(20);
      states.push((await header.getAttribute("data-scrolled")) ?? "");
    }
    expect(states.every((state) => state === "true")).toBe(true);

    // Below the hysteresis floor it releases.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });

  test("shows exactly one navigation affordance for the viewport", async ({ page }) => {
    await page.goto("/about");
    const header = page.locator("header");
    const hamburger = header.getByRole("button", { name: "Open menu" });
    const desktopCta = header.getByRole("link", { name: "Contact us" });
    const desktopNav = header.getByRole("navigation", { name: "Main" });

    if (isMobile(page)) {
      await expect(hamburger).toBeVisible();
      await expect(desktopCta).toBeHidden();
      await expect(desktopNav).toBeHidden();
    } else {
      await expect(hamburger).toBeHidden();
      await expect(desktopCta).toBeVisible();
      await expect(desktopNav).toBeVisible();
    }
  });

  test("marks the active route", async ({ page }) => {
    await page.goto("/about");
    if (isMobile(page)) {
      test.skip(true, "desktop nav is hidden below 1024px");
      return;
    }
    const active = page.getByRole("link", { name: "About" }).first();
    await expect(active).toHaveAttribute("aria-current", "page");
  });
});

test.describe("mobile nav", () => {
  test("opens full screen, traps focus, closes on Escape and restores focus", async ({ page }) => {
    await page.goto("/projects");
    if (!isMobile(page)) {
      test.skip(true, "the overlay only exists below 1024px");
      return;
    }

    const hamburger = page.getByRole("button", { name: "Open menu" });
    await hamburger.click();

    const dialog = page.getByRole("dialog", { name: "Main menu" });
    await expect(dialog).toBeVisible();

    // Full viewport.
    const [box, viewport] = [await dialog.boundingBox(), page.viewportSize()];
    expect(box?.width).toBeCloseTo(viewport?.width ?? 0, 0);
    expect(box?.height).toBeCloseTo(viewport?.height ?? 0, 0);

    // The page behind is inert and does not scroll.
    await expect(page.locator("#site-content")).toHaveAttribute("inert", "");
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

    // Tab all the way round; focus must never leave the dialog.
    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        const overlay = document.querySelector('[role="dialog"]');
        return active !== null && overlay !== null && overlay.contains(active);
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(hamburger).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
    await expect(page.locator("#site-content")).not.toHaveAttribute("inert", "");
  });

  test("closes on route change", async ({ page }) => {
    await page.goto("/projects");
    if (!isMobile(page)) {
      test.skip(true, "the overlay only exists below 1024px");
      return;
    }

    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Main menu" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(dialog).toBeHidden();
  });
});

test.describe("PageHero breadcrumb slab", () => {
  test("overlaps the hero on desktop and sits flush on mobile", async ({ page }) => {
    await page.goto("/about");

    const heroBottom = await page.evaluate(() => {
      const scrim = document.querySelector("h1")?.closest("div")?.parentElement;
      return scrim?.getBoundingClientRect().bottom ?? 0;
    });
    const crumbTop =
      (await page.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())?.y ?? 0;

    if (isMobile(page)) {
      expect(crumbTop).toBeGreaterThanOrEqual(heroBottom - 1);
    } else {
      expect(crumbTop).toBeLessThan(heroBottom);
    }
  });

  test("is not full width on desktop", async ({ page }) => {
    await page.goto("/about");
    const width = (await page.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())?.width ?? 0;
    const viewport = page.viewportSize()?.width ?? 0;
    if (isMobile(page)) {
      expect(width).toBeGreaterThan(viewport * 0.9);
    } else {
      expect(width).toBeLessThanOrEqual(480);
    }
  });
});

test.describe("contact band and footer", () => {
  test("the band overlaps the footer on desktop only", async ({ page }) => {
    await page.goto("/about");

    // The band's own landmark. Selecting it by tag and position — it used to be
    // `#site-content > div` — silently matched nothing once it became an aside.
    const band = page.getByRole("complementary", { name: "Contact details" });
    await expect(band).toHaveCount(1);

    const bandBox = await band.boundingBox();
    // By role, not by tag: a PullQuote attribution is also a <footer>, and only
    // the page footer carries the contentinfo role.
    const footerBox = await page.getByRole("contentinfo").boundingBox();
    expect(bandBox).not.toBeNull();
    expect(footerBox).not.toBeNull();

    const overlaps = bandBox!.y + bandBox!.height > footerBox!.y;
    expect(overlaps).toBe(!isMobile(page));
  });

  test("status links deep-link into the filtered listing", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    for (const status of ["completed", "current", "upcoming"]) {
      await expect(
        footer.locator(`a[href="/projects?status=${status}"]`),
      ).toHaveCount(1);
    }
  });

  test("phone and email are real tel: and mailto: links", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(1);
    const tel = await footer.locator('a[href^="tel:"]').getAttribute("href");
    expect(tel).not.toContain("REPLACE");
  });
});

test.describe("accessibility", () => {
  test("the skip link is hidden until focused, then jumps to main", async ({ page }) => {
    await page.goto("/about");
    const skip = page.getByRole("link", { name: "Skip to content" });

    expect((await skip.boundingBox())?.width ?? 0).toBeLessThan(5);
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    expect((await skip.boundingBox())?.width ?? 0).toBeGreaterThan(50);
    await expect(skip).toHaveAttribute("href", "#main");
    await expect(page.locator("#main")).toHaveCount(1);
  });

  test("no horizontal scroll from 320px to 1920px", async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});
