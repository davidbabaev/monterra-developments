/**
 * Turns the optimised SVG into components/ui/logoPaths.ts.
 *
 * Two things need measuring rather than guessing: which paths form the skyline
 * mark (for the monogram variant) and the tight box around it. Both come from
 * getBBox in a real browser, so the monogram crop is exact.
 *
 * Run after scripts/optimize-logo.mjs, with `node scripts/build-logo-paths.mjs`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SVG = path.join(REPO_ROOT, "public", "logo", "monterra-horizontal.svg");
const OUT = path.join(REPO_ROOT, "components", "ui", "logoPaths.ts");

const NAVY = "#14263D";
const svg = readFileSync(SVG, "utf8");

const paths = [...svg.matchAll(/<path\b([^>]*)\/>/g)].map(([, attrs]) => ({
  d: /\bd="([^"]*)"/.exec(attrs)?.[1] ?? "",
  fill: (/\bfill="([^"]*)"/.exec(attrs)?.[1] ?? NAVY).toUpperCase(),
}));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 400 } });
// Rendered 1:1 with the viewBox so client rects map straight to user units.
await page.setContent(
  `<body style="margin:0">${svg.replace("<svg", '<svg width="797" height="241"')}</body>`,
);

const boxes = await page.evaluate(() => {
  // getBBox ignores the element's own transform, and every path in this trace
  // carries one, so measure in client space and shift back to the root origin.
  const root = document.querySelector("svg").getBoundingClientRect();
  return [...document.querySelectorAll("path")].map((p) => {
    const b = p.getBoundingClientRect();
    return { x: b.x - root.x, y: b.y - root.y, width: b.width, height: b.height };
  });
});
await browser.close();

/**
 * Group the paths into horizontally separated clusters. The mark and the
 * wordmark are separated by real whitespace, so clustering finds the boundary
 * without hardcoding a coordinate — and it also surfaces anything stranded
 * between them.
 */
function clusterByX(items) {
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const clusters = [];
  for (const box of sorted) {
    const current = clusters[clusters.length - 1];
    if (current !== undefined && box.x <= current.right + 1) {
      current.members.push(box);
      current.right = Math.max(current.right, box.x + box.width);
      continue;
    }
    clusters.push({ left: box.x, right: box.x + box.width, members: [box] });
  }
  return clusters;
}

const clusters = clusterByX(boxes.map((b, i) => ({ ...b, i })));

/**
 * The wordmark is many clusters — one per letter group — so the boundary is
 * the single widest gap between consecutive clusters, not a cluster count.
 */
let widestGap = 0;
let boundary = 0;
for (let i = 1; i < clusters.length; i += 1) {
  const gap = clusters[i].left - clusters[i - 1].right;
  if (gap > widestGap) {
    widestGap = gap;
    boundary = (clusters[i].left + clusters[i - 1].right) / 2;
  }
}

const leftOfBoundary = clusters.filter((c) => c.right <= boundary);
const markCluster = leftOfBoundary.reduce((widest, c) =>
  c.right - c.left > widest.right - widest.left ? c : widest,
);

/**
 * Anything else left of the boundary is trace noise floating in whitespace.
 * Dropping it is cleanup, not redrawing: the source carries a stray 3-unit dot
 * that is plainly visible in the rendered mark.
 */
const strays = leftOfBoundary.filter((c) => c !== markCluster);
const strayIndices = new Set(strays.flatMap((c) => c.members.map((m) => m.i)));

const markIndices = new Set(markCluster.members.map((m) => m.i));
const isMark = boxes.map((_, i) => markIndices.has(i));
const splitAt = markCluster.right;

for (const stray of strays) {
  console.log(
    `dropped stray: x ${Math.round(stray.left)}-${Math.round(stray.right)}, ` +
      `${stray.members.length} path(s) — trace noise`,
  );
}
/**
 * The lockup carries a strapline under the wordmark. At a 64px header height it
 * renders about 3px tall — an illegible smudge — so the header needs a version
 * without it. Splitting on the widest vertical gap inside the wordmark finds it
 * by position, so this is still a subset of the trace, not a redraw.
 */
const wordmarkBoxes = boxes
  .map((b, i) => ({ ...b, i }))
  .filter((b) => !isMark[b.i] && !strayIndices.has(b.i));

const rows = clusterByX(wordmarkBoxes.map((b) => ({ ...b, x: b.y, width: b.height })));
let widestRowGap = 0;
let rowBoundary = Infinity;
for (let i = 1; i < rows.length; i += 1) {
  const gap = rows[i].left - rows[i - 1].right;
  if (gap > widestRowGap) {
    widestRowGap = gap;
    rowBoundary = (rows[i].left + rows[i - 1].right) / 2;
  }
}

const straplineIndices = new Set(
  wordmarkBoxes.filter((b) => b.y >= rowBoundary).map((b) => b.i),
);

const markBoxes = boxes.filter((_, i) => isMark[i]);
const bounds = {
  minX: Math.min(...markBoxes.map((b) => b.x)),
  minY: Math.min(...markBoxes.map((b) => b.y)),
  maxX: Math.max(...markBoxes.map((b) => b.x + b.width)),
  maxY: Math.max(...markBoxes.map((b) => b.y + b.height)),
};

const round = (n) => Math.round(n * 10) / 10;
const markViewBox = {
  x: round(bounds.minX),
  y: round(bounds.minY),
  width: round(bounds.maxX - bounds.minX),
  height: round(bounds.maxY - bounds.minY),
};

const entries = paths
  .map((p, i) => ({
    d: p.d,
    tone: p.fill === NAVY ? "primary" : "accent",
    inMark: isMark[i],
    inStrapline: straplineIndices.has(i),
    index: i,
  }))
  .filter((e) => !strayIndices.has(e.index));

/** Everything except the strapline, which is what the header uses. */
const lockupBoxes = boxes
  .map((b, i) => ({ ...b, i }))
  .filter((b) => !strayIndices.has(b.i) && !straplineIndices.has(b.i));
const lockupBounds = {
  minX: Math.min(...lockupBoxes.map((b) => b.x)),
  minY: Math.min(...lockupBoxes.map((b) => b.y)),
  maxX: Math.max(...lockupBoxes.map((b) => b.x + b.width)),
  maxY: Math.max(...lockupBoxes.map((b) => b.y + b.height)),
};

const file = `/**
 * [REPLACE] — geometry auto-traced from docs/brand/logo2.svg, not redrawn.
 *
 * Generated by scripts/build-logo-paths.mjs. Do not hand-edit: re-run the
 * script instead. \`tone\` is deliberately not a colour — \`primary\` paths are
 * painted with currentColor so the mark inverts on a dark surface, and
 * \`accent\` paths stay bronze in every variant.
 */

export type LogoPathTone = "primary" | "accent";

export type LogoPath = {
  readonly d: string;
  readonly tone: LogoPathTone;
  /** True for the skyline mark, false for the wordmark beside it. */
  readonly inMark: boolean;
  /** True for the strapline under the wordmark, dropped at small sizes. */
  readonly inStrapline: boolean;
};

/** The full lockup. */
export const LOGO_VIEWBOX = "0 0 797 241";

/** Everything except the strapline: legible down to header height. */
export const LOCKUP_VIEWBOX = "${round(lockupBounds.minX)} ${round(lockupBounds.minY)} ${round(lockupBounds.maxX - lockupBounds.minX)} ${round(lockupBounds.maxY - lockupBounds.minY)}";

/** Tight crop around the skyline mark alone, measured from its real bounds. */
export const MARK_VIEWBOX = "${markViewBox.x} ${markViewBox.y} ${markViewBox.width} ${markViewBox.height}";

export const LOGO_PATHS: readonly LogoPath[] = [
${entries
  .map((e) => `  { d: "${e.d}", tone: "${e.tone}", inMark: ${e.inMark}, inStrapline: ${e.inStrapline} },`)
  .join("\n")}
];
`;

writeFileSync(OUT, file);

console.log(`paths total      ${paths.length}`);
console.log(`  in mark        ${entries.filter((e) => e.inMark).length}`);
console.log(`  in wordmark    ${entries.filter((e) => !e.inMark).length}`);
console.log(`  primary/accent ${entries.filter((e) => e.tone === "primary").length}/${entries.filter((e) => e.tone === "accent").length}`);
console.log(`split at x       ${round(splitAt)} (gap ${round(widestGap)})`);
console.log(`  in strapline   ${entries.filter((e) => e.inStrapline).length}`);
console.log(`mark viewBox     ${markViewBox.x} ${markViewBox.y} ${markViewBox.width} ${markViewBox.height}`);
console.log(`lockup viewBox   ${round(lockupBounds.minX)} ${round(lockupBounds.minY)} ${round(lockupBounds.maxX - lockupBounds.minX)} ${round(lockupBounds.maxY - lockupBounds.minY)}`);
console.log(`written          ${path.relative(REPO_ROOT, OUT)} (${(file.length / 1024).toFixed(1)}KB)`);
