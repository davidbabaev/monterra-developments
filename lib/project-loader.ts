import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ContentValidationError, describeIssues } from "./content-error";
import { resolveProjectMedia, type ResolvedProjectMedia } from "./project-media";
import { projectFrontmatterSchema, type ProjectFrontmatter } from "./schema";

/**
 * Reads `content/projects/<slug>/index.mdx` from disk at build time only.
 * There is no database and no request-time fetching.
 *
 * Asset `src` values in frontmatter are relative to the project's own folder,
 * so images stay colocated with the project that owns them. The loader turns
 * them into servable URLs carrying real pixel dimensions.
 */

const CONTENT_DIRECTORY = path.join(process.cwd(), "content", "projects");
const ENTRY_FILENAME = "index.mdx";

/** A validated project: frontmatter, with media resolved, plus its MDX body. */
export type Project = Omit<ProjectFrontmatter, "media"> & {
  readonly media: ResolvedProjectMedia;
  readonly body: string;
};

function toRepoRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).split(path.sep).join("/");
}

function loadProject(directoryName: string): Project {
  const projectDirectory = path.join(CONTENT_DIRECTORY, directoryName);
  const absolutePath = path.join(projectDirectory, ENTRY_FILENAME);
  const filePath = toRepoRelative(absolutePath);

  if (!existsSync(absolutePath)) {
    throw new ContentValidationError(filePath, [`(file): expected ${ENTRY_FILENAME} in this folder`]);
  }

  const { data, content } = matter(readFileSync(absolutePath, "utf8"));
  const result = projectFrontmatterSchema.safeParse(data);

  if (!result.success) {
    throw new ContentValidationError(filePath, describeIssues(result.error));
  }

  const { slug, media, ...rest } = result.data;

  if (slug !== directoryName) {
    throw new ContentValidationError(filePath, [
      `slug: "${slug}" does not match its folder name "${directoryName}"`,
    ]);
  }

  return {
    ...rest,
    slug,
    // Throws a ContentValidationError naming the field if an asset is missing.
    media: resolveProjectMedia(media, { projectDirectory, filePath, slug }),
    body: content,
  };
}

/**
 * Cached for the production build, where many pages read the same content.
 * Never cached in dev, so editing an MDX file shows up on the next request
 * instead of surviving until the server restarts.
 */
const shouldCache = process.env.NODE_ENV === "production";
let cachedProjects: readonly Project[] | null = null;

/**
 * All projects on disk, validated. Throws on the first invalid file — a bad
 * file is never skipped and never falls back to a default.
 */
export function loadAllProjects(): readonly Project[] {
  if (shouldCache && cachedProjects !== null) return cachedProjects;

  const directoryNames = readdirSync(CONTENT_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  cachedProjects = directoryNames.map(loadProject);
  return cachedProjects;
}
