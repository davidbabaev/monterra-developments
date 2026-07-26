/**
 * Optimises docs/brand/logo2.svg into public/logo/.
 *
 * The source is an auto-trace: 105KB, 120 paths, no viewBox, and a separate
 * near-unique fill on every path because the tracer sampled antialiased pixels.
 * This does three things and nothing else — it does not redraw the mark:
 *
 *   1. Snaps every fill to the nearest brand colour, by RGB distance.
 *   2. Adds the viewBox the source is missing.
 *   3. Runs SVGO, mainly to cut coordinate precision, which is where almost
 *      all of the weight is.
 *
 * Run with `node scripts/optimize-logo.mjs`.
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(REPO_ROOT, "docs", "brand", "logo2.svg");
const OUT_DIR = path.join(REPO_ROOT, "public", "logo");

const NAVY = "#14263D";
const BRONZE = "#A87842";

/** Intrinsic size of the trace, which the source declares but never encodes. */
export const VIEWBOX = { width: 797, height: 241 };

const toRgb = (hex) => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

const distance = (a, b) => {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return Math.hypot(ar - br, ag - bg, ab - bb);
};

/** Nearest of the two brand colours. Near-black trace artefacts land on navy. */
function snapToBrand(hex) {
  return distance(hex, NAVY) <= distance(hex, BRONZE) ? NAVY : BRONZE;
}

function analyse(svg) {
  return {
    bytes: Buffer.byteLength(svg, "utf8"),
    paths: (svg.match(/<path/g) ?? []).length,
    fills: new Set([...svg.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1].toUpperCase())),
    hasViewBox: /viewBox=/.test(svg),
  };
}

function report(label, stats) {
  console.log(
    `${label.padEnd(12)} ${String(stats.bytes).padStart(7)} bytes  ` +
      `${String(stats.paths).padStart(4)} paths  ` +
      `${String(stats.fills.size).padStart(3)} fills  ` +
      `viewBox: ${stats.hasViewBox}`,
  );
}

const source = readFileSync(SOURCE, "utf8");
const before = analyse(source);

// 1. Snap fills, 2. add the viewBox.
let prepared = source.replace(/fill="(#[0-9A-Fa-f]{6})"/g, (_, hex) => `fill="${snapToBrand(hex)}"`);
prepared = prepared.replace(
  /<svg([^>]*?)>/,
  `<svg$1 viewBox="0 0 ${VIEWBOX.width} ${VIEWBOX.height}">`,
);

// 3. Optimise. floatPrecision is the lever that matters on a trace this dense.
const precision = Number(process.argv[2] ?? 2);
const { data: optimised } = optimize(prepared, {
  multipass: true,
  floatPrecision: precision,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // removeViewBox is not part of preset-default in SVGO 4, so there is
          // nothing to override — the viewBox added above survives as-is.
          convertPathData: { floatPrecision: precision, transformPrecision: precision },
          cleanupNumericValues: { floatPrecision: precision },
          /**
           * Merging fuses the skyline mark into the same path as the wordmark
           * letters that share its fill, which makes the monogram variant
           * impossible to extract. The few bytes it saves are not worth that.
           */
          mergePaths: false,
        },
      },
    },
    "removeDimensions",
    "sortAttrs",
  ],
});

const after = analyse(optimised);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, "monterra-horizontal.svg"), optimised);

console.log(`precision: ${precision}\n`);
report("before", before);
report("after", after);
console.log(
  `\nreduction: ${(100 - (after.bytes / before.bytes) * 100).toFixed(1)}% ` +
    `(${(before.bytes / 1024).toFixed(1)}KB -> ${(after.bytes / 1024).toFixed(1)}KB)`,
);
console.log(`fills now: ${[...after.fills].join(", ")}`);
