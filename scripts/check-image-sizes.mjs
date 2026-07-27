/**
 * Fails the build when a committed content image is too heavy, naming the path.
 *
 * The same discipline as content validation: a problem in an asset stops the
 * build rather than shipping and being discovered by whoever is on a phone. A
 * 9.9MB hero was committed once already, and it did not announce itself — it
 * looked fine on a fast desktop and quietly cost seconds on everything else.
 *
 * Raster images only. Vector and icon assets under public/ are exempt: an SVG is
 * markup, its weight is a different problem with a different fix, and the favicon
 * is not a content image at all.
 *
 * Run by `prebuild` and `predev`, so it fires before either can start.
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Where images that ship to a reader live. */
const ROOTS = ["public", "content"];

/** Rasters only — see the note above on vectors. */
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);

/**
 * 1MB. Generous on purpose: this is a floor against accidents, not a budget.
 * next/image re-encodes per viewport, so the source only has to be good enough
 * to downscale from — anything approaching a megabyte is a mistake, not a choice.
 */
const LIMIT_BYTES = 1_000_000;

/** public/projects is a generated mirror of content/projects; report the source. */
const GENERATED = path.join("public", "projects");

const formatBytes = (bytes) => `${(bytes / 1_000_000).toFixed(2)}MB`;

async function* walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(absolute);
    } else if (RASTER.has(path.extname(entry.name).toLowerCase())) {
      yield absolute;
    }
  }
}

async function main() {
  const oversized = [];

  for (const root of ROOTS) {
    for await (const file of walk(path.join(REPO_ROOT, root))) {
      const relative = path.relative(REPO_ROOT, file).split(path.sep).join("/");
      if (relative.startsWith(GENERATED.split(path.sep).join("/"))) continue;

      const { size } = await stat(file);
      if (size > LIMIT_BYTES) oversized.push({ relative, size });
    }
  }

  if (oversized.length === 0) return;

  const lines = oversized
    .sort((a, b) => b.size - a.size)
    .map((image) => `  - ${image.relative}: ${formatBytes(image.size)}`);

  console.error(
    `\nImage too large (limit ${formatBytes(LIMIT_BYTES)}):\n${lines.join("\n")}\n\n` +
      "Re-encode it — WebP at quality 75 is usually a 90% saving — and keep the\n" +
      "original as a master outside the repository.\n",
  );
  process.exit(1);
}

await main();
