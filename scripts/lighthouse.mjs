/**
 * Lighthouse against the production build, on the routes that matter.
 *
 * Measurement only. Nothing here changes what ships — if a score is short of its
 * target the number and the audit that caused it are printed, and the fix is a
 * separate decision made with that information in hand.
 *
 * Run through `npm run lighthouse`, which builds first. The server it starts is
 * `next start` on its own port, so a dev server left running elsewhere is neither
 * used by accident nor disturbed.
 */

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

/** The port Chrome exposes CDP on, which is how Lighthouse drives it. */
const DEBUG_PORT = Number(process.env.LIGHTHOUSE_CDP_PORT ?? 9222);

const PORT = Number(process.env.LIGHTHOUSE_PORT ?? 3210);
const ORIGIN = `http://127.0.0.1:${PORT}`;

/**
 * The three routes named in the increment: home, the listing, a detail page.
 *
 * LIGHTHOUSE_ROUTES overrides the set with a comma-separated list, for auditing
 * a route the default three do not cover — the other two project pages, say,
 * after new photography lands on them.
 */
const ROUTES = (process.env.LIGHTHOUSE_ROUTES ?? "/,/projects,/projects/monterra-ridge")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

/** Lighthouse's own category ids, with the target each one has to clear. */
const TARGETS = {
  performance: 90,
  accessibility: 95,
  "best-practices": 95,
  seo: 100,
};

const CATEGORY_ORDER = Object.keys(TARGETS);

/**
 * Lighthouse drives a real Chrome over CDP. Playwright's chromium is already
 * installed for the e2e suite, so it is reused rather than pulling a second
 * browser down.
 *
 * Playwright launches it, not chrome-launcher. chrome-launcher detects WSL and
 * assumes it is starting a *Windows* Chrome from inside it, so it rewrites the
 * profile path to Windows form — `/tmp/x` becomes `\\wsl.localhost\Ubuntu\tmp\x`
 * — and then creates that as a relative directory in the working tree. Three of
 * them appeared in `git status` before this was tracked down. Our Chrome is the
 * Linux build, so the translation is simply wrong, and there is no flag to
 * disable it.
 */
function resolveChromium() {
  try {
    return require("playwright-core").chromium;
  } catch {
    return require("@playwright/test").chromium;
  }
}

async function waitForServer(url, attempts = 90) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not come up at ${url}`);
}

/** A score is 0–1, or null when the category did not run. */
const toScore = (value) => (value === null || value === undefined ? null : Math.round(value * 100));

/**
 * The audits that actually cost a category its points, worst first. Only audits
 * that carry weight are listed — a failing audit weighted zero is noise.
 */
function blockingAudits(lhr, categoryId) {
  const category = lhr.categories[categoryId];
  if (category === undefined) return [];

  return category.auditRefs
    .filter((ref) => ref.weight > 0)
    .map((ref) => ({ audit: lhr.audits[ref.id], weight: ref.weight }))
    .filter(({ audit }) => audit !== undefined)
    .filter(({ audit }) => audit.score !== null && audit.score < 1)
    .sort((a, b) => b.weight * (1 - b.audit.score) - a.weight * (1 - a.audit.score))
    .map(({ audit, weight }) => ({
      id: audit.id,
      title: audit.title,
      score: Math.round(audit.score * 100),
      weight,
      displayValue: audit.displayValue ?? "",
    }));
}

async function main() {
  const preset = process.argv.includes("--desktop") ? "desktop" : "mobile";

  let chromium;
  try {
    chromium = resolveChromium();
  } catch {
    console.error("Playwright's chromium is missing. Run `npx playwright install chromium`.");
    process.exit(1);
  }

  const lighthouse = (await import("lighthouse")).default;

  const server = spawn("npx", ["next", "start", "--port", String(PORT)], {
    cwd: REPO_ROOT,
    stdio: "ignore",
    detached: true,
  });

  // Playwright creates and cleans up its own profile directory, in a location it
  // resolves correctly on this platform. Passing --user-data-dir is rejected.
  const browser = await chromium.launch({
    args: [
      `--remote-debugging-port=${DEBUG_PORT}`,
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const results = [];

  try {
    await waitForServer(ORIGIN);

    for (const route of ROUTES) {
      const runnerResult = await lighthouse(
        `${ORIGIN}${route}`,
        { port: DEBUG_PORT, output: "json", logLevel: "error" },
        preset === "desktop"
          ? (await import("lighthouse/core/config/desktop-config.js")).default
          : undefined,
      );

      const { lhr } = runnerResult;
      const scores = Object.fromEntries(
        CATEGORY_ORDER.map((id) => [id, toScore(lhr.categories[id]?.score)]),
      );

      results.push({ route, scores, lhr });
    }
  } finally {
    await browser.close();
    try {
      process.kill(-server.pid);
    } catch {
      server.kill();
    }
  }

  const label = preset === "desktop" ? "DESKTOP" : "MOBILE (Lighthouse default)";
  console.log(`\n=== Lighthouse — production build — ${label} ===\n`);

  const header = ["Route".padEnd(30), ...CATEGORY_ORDER.map((id) => id.padEnd(16))].join("");
  console.log(header);
  console.log("-".repeat(header.length));

  for (const { route, scores } of results) {
    const cells = CATEGORY_ORDER.map((id) => {
      const score = scores[id];
      const mark = score === null ? "?" : score >= TARGETS[id] ? "PASS" : "MISS";
      return `${score ?? "n/a"} ${mark}`.padEnd(16);
    });
    console.log([route.padEnd(30), ...cells].join(""));
  }

  const missed = results.flatMap(({ route, scores, lhr }) =>
    CATEGORY_ORDER.filter((id) => scores[id] !== null && scores[id] < TARGETS[id]).map((id) => ({
      route,
      id,
      score: scores[id],
      audits: blockingAudits(lhr, id).slice(0, 6),
    })),
  );

  if (missed.length === 0) {
    console.log("\nEvery category clears its target.\n");
    return;
  }

  console.log("\n=== Missed targets, with the audits responsible ===");
  for (const miss of missed) {
    console.log(`\n${miss.route} — ${miss.id}: ${miss.score} (target ${TARGETS[miss.id]})`);
    for (const audit of miss.audits) {
      const detail = audit.displayValue === "" ? "" : ` — ${audit.displayValue}`;
      console.log(`  - ${audit.id} (weight ${audit.weight}, scored ${audit.score})${detail}`);
      console.log(`      ${audit.title}`);
    }
  }
  console.log("");
}

await main();
