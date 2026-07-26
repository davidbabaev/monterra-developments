/**
 * Mirrors project assets from `content/projects/<slug>/` into
 * `public/projects/<slug>/` so the URLs the loader builds are actually servable.
 *
 * Content stays the single source of truth and images stay colocated with the
 * project that owns them; `public/projects/` is generated output and is
 * gitignored. Runs automatically via the `predev` and `prebuild` npm scripts.
 */

import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(REPO_ROOT, "content", "projects");
const DESTINATION = path.join(REPO_ROOT, "public", "projects");

/** The MDX is read by the loader, never served. Everything else is an asset. */
const isNotMdx = (source) => !source.endsWith(".mdx");

async function main() {
  // Cleared first so an asset deleted from content does not linger in public.
  await rm(DESTINATION, { recursive: true, force: true });
  await cp(SOURCE, DESTINATION, { recursive: true, filter: isNotMdx });
  console.log(`content assets synced to ${path.relative(REPO_ROOT, DESTINATION)}`);
}

await main();
