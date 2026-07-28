import { expect, test, type Page } from "@playwright/test";
import { contrastRatio } from "./support/colors";

/**
 * The states a form has to be watched in, plus the two things a unit test
 * cannot see: what a focus ring actually renders as, and what the border of an
 * input measures against the page behind it.
 */

const FORCE_FAILURE_TOKEN = "[FORCE-ERROR]";

const nameField = (page: Page) => page.getByLabel(/full name/i);
const emailField = (page: Page) => page.getByLabel(/^email/i);
const phoneField = (page: Page) => page.getByLabel(/phone/i);
const projectField = (page: Page) => page.getByLabel(/project of interest/i);
const messageField = (page: Page) => page.getByLabel(/message/i);
const submit = (page: Page) => page.getByRole("button", { name: /send message|sending/i });

/**
 * Scoped to main: Next keeps its own empty route announcer at role="alert" on
 * every page, so an unscoped query matches that too.
 */
const banner = (page: Page) => page.locator("main").getByRole("alert");

async function fill(page: Page, message: string) {
  await nameField(page).fill("Dana Okafor");
  await emailField(page).fill("dana@example.com");
  await phoneField(page).fill("512 555 0142");
  await messageField(page).fill(message);
}

test("submitting empty shows a message on each required field, correctly associated", async ({
  page,
}) => {
  await page.goto("/contact");
  await submit(page).click();

  for (const [field, expected] of [
    [nameField(page), /enter your full name/i],
    [emailField(page), /email address/i],
    [messageField(page), /at least a sentence/i],
  ] as const) {
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(expected);
  }

  // Nothing was sent: no failure banner, and the form was not replaced by the
  // success panel. Keyed on the panel's own button — "two business days" also
  // appears in the contact band above the footer.
  await expect(banner(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /send another message/i })).toHaveCount(0);
  await expect(nameField(page)).toBeVisible();
});

test("a valid submission goes idle to submitting to success and back", async ({ page }) => {
  await page.goto("/contact");
  await fill(page, "We are looking for a three bedroom near the river.");

  await expect(submit(page)).toBeEnabled();
  await submit(page).click();

  // Submitting: relabelled, disabled, and every field locked.
  await expect(page.getByText("Sending…")).toBeVisible();
  await expect(submit(page)).toBeDisabled();
  await expect(nameField(page)).toBeDisabled();
  await expect(messageField(page)).toBeDisabled();

  // Success: the form is gone, replaced by the panel.
  await expect(page.getByText(/two business days/i)).toBeVisible({ timeout: 5000 });
  await expect(nameField(page)).toHaveCount(0);

  await page.getByRole("button", { name: /send another message/i }).click();
  await expect(nameField(page)).toHaveValue("");
  await expect(submit(page)).toBeEnabled();
});

test("a failed submission keeps every entered value", async ({ page }) => {
  await page.goto("/contact?project=the-larkin");

  const message = `We would like a viewing. ${FORCE_FAILURE_TOKEN}`;
  await fill(page, message);
  await submit(page).click();

  const failure = banner(page);
  await expect(failure).toBeVisible({ timeout: 5000 });
  await expect(failure).toContainText(/something went wrong/i);
  await expect(failure.getByRole("link")).toHaveAttribute("href", /^mailto:/);

  // The banner sits above the form, and the form still holds everything.
  const bannerBox = await failure.boundingBox();
  const formBox = await page.locator("form").boundingBox();
  expect(bannerBox!.y).toBeLessThan(formBox!.y);

  await expect(nameField(page)).toHaveValue("Dana Okafor");
  await expect(emailField(page)).toHaveValue("dana@example.com");
  await expect(phoneField(page)).toHaveValue("512 555 0142");
  await expect(messageField(page)).toHaveValue(message);
  await expect(projectField(page)).toHaveValue("the-larkin");
});

test("arriving from a project's call to action preselects that project", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");
  await page.getByRole("link", { name: /contact us about this project/i }).click();

  await page.waitForURL(/\/contact\?project=monterra-ridge/);
  await expect(projectField(page)).toHaveValue("monterra-ridge");
  await expect(projectField(page).locator("option:checked")).toHaveText("Monterra Ridge");
});

test("an unknown project in the URL falls back to the general option", async ({ page }) => {
  await page.goto("/contact?project=not-a-project");
  await expect(projectField(page)).toHaveValue("general");
});

test("every control is reachable by keyboard with a visible bronze ring", async ({ page }) => {
  await page.goto("/contact");

  const expected = ["full name", "email", "phone", "project of interest", "message"];
  const reached: string[] = [];

  await nameField(page).focus();

  for (let press = 0; press < 12; press += 1) {
    const focused = await page.evaluate(() => {
      const node = document.activeElement as HTMLElement | null;
      if (node === null) return null;
      const style = getComputedStyle(node);
      const labelled = node.id === "" ? null : document.querySelector(`label[for="${node.id}"]`);
      return {
        label: (labelled?.textContent ?? node.textContent ?? "").toLowerCase(),
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth,
        tag: node.tagName.toLowerCase(),
      };
    });

    if (focused === null) break;
    if (["input", "select", "textarea", "button"].includes(focused.tag)) {
      // #A87842 — the same ring every other control on the site uses.
      expect(focused.outlineColor, `ring on ${focused.label}`).toBe("rgb(168, 120, 66)");
      expect(focused.outlineWidth).toBe("2px");
      reached.push(focused.label);
    }

    await page.keyboard.press("Tab");
    await page.waitForTimeout(320);
  }

  for (const label of expected) {
    expect(reached.some((seen) => seen.includes(label)), `${label} was reachable`).toBe(true);
  }
  expect(reached.some((seen) => seen.includes("send message"))).toBe(true);
});

/**
 * Measures the field's border against whatever is painted behind it.
 *
 * `getComputedStyle` returns "" for every property on an element whose document
 * has no view — which is what a node becomes the instant it is detached. The
 * form is a client component, so during hydration the node a locator has already
 * resolved can be replaced between resolution and evaluation. That is the whole
 * of the flake: not a colour this could not parse, but no colour at all.
 *
 * Returning null rather than throwing lets the caller retry. The value being
 * measured is a static CSS fact, so retrying cannot turn a real failure into a
 * pass — it only waits for a node that is still in the document.
 */
async function measureBorder(page: Page) {
  return nameField(page).evaluate((element) => {
    // The nearest ancestor that actually paints, which is what the border has to
    // separate the field from. Reading document.body directly is not safe: an
    // unpainted background computes to rgba(0, 0, 0, 0), which is not the colour
    // behind anything. The walk is the one contrast-rules.spec.ts uses.
    const backgroundBehind = (start: Element): string | null => {
      let node: Element | null = start.parentElement;
      while (node !== null) {
        const background = getComputedStyle(node).backgroundColor;
        if (background === "") return null;
        if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background;
        node = node.parentElement;
      }
      // Nothing in the chain paints, so what shows through is the canvas.
      return "rgb(255, 255, 255)";
    };

    const border = getComputedStyle(element).borderTopColor;
    if (border === "") return null;

    const background = backgroundBehind(element);
    return background === null ? null : { border, background };
  });
}

test("input borders clear the 3:1 required of a control boundary", async ({ page }) => {
  await page.goto("/contact");
  await expect(nameField(page)).toBeVisible();

  let measured: { border: string; background: string } | null = null;

  await expect(async () => {
    measured = await measureBorder(page);
    expect(measured, "the field was detached mid-measurement").not.toBeNull();
  }).toPass({ timeout: 5_000 });

  const { border, background } = measured!;

  // Computed here rather than in the browser so a failure names both colours.
  const ratio = contrastRatio(border, background);

  expect(ratio, `border ${border} on ${background}`).toBeGreaterThanOrEqual(3);
  // Navy, not stone: stone would measure 1.76 and fail.
  expect(border).toBe("rgb(20, 38, 61)");
});

test("the layout is two columns from 1024px and form-first below", async ({ page }) => {
  await page.goto("/contact");

  const form = page.locator("form");
  // Scoped to main: the contact band above the footer also has an Office heading.
  const details = page.locator("main").getByRole("heading", { name: "Office" });

  await expect(form).toBeVisible();
  await expect(details).toBeVisible();

  const isWide = (page.viewportSize()?.width ?? 0) >= 1024;

  // Retried, because boundingBox reads live layout. Under a full parallel run the
  // first read can land before the grid has settled, and the two boxes then still
  // overlap. The relationship being asserted is static once layout is done, so a
  // retry waits for the real answer rather than accepting a convenient one.
  await expect(async () => {
    const formBox = await form.boundingBox();
    const detailsBox = await details.boundingBox();
    expect(formBox, "the form had no box").not.toBeNull();
    expect(detailsBox, "the details heading had no box").not.toBeNull();

    if (isWide) {
      expect(detailsBox!.x).toBeGreaterThan(formBox!.x + formBox!.width - 1);
    } else {
      expect(detailsBox!.y).toBeGreaterThan(formBox!.y);
    }
  }).toPass({ timeout: 5_000 });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
