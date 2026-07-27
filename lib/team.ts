import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { ContentValidationError, describeIssues } from "./content-error";
import { teamSchema, type TeamMemberContent } from "./schema";

/**
 * Reads content/team.json at build time only, on the same terms as the projects:
 * invalid data fails the build naming the file and the field, a referenced
 * portrait that is not on disk fails it too, and nothing is ever rendered half
 * valid or quietly skipped.
 *
 * Portraits live under public/ rather than beside the JSON — there is no per
 * member folder to colocate them in, and nothing mirrors content/ into public/
 * except the project asset sync.
 */

const CONTENT_PATH = path.join(process.cwd(), "content", "team.json");
const FILE_LABEL = "content/team.json";
const PUBLIC_ROOT = path.join(process.cwd(), "public");

export type TeamMember = TeamMemberContent & {
  readonly photo: TeamMemberContent["photo"] & {
    readonly width: number;
    readonly height: number;
  };
};

/** Measured off the file so next/image reserves the right box before it decodes. */
function measurePortrait(src: string, index: number): { width: number; height: number } {
  const absolutePath = path.join(PUBLIC_ROOT, src.replace(/^\/+/, ""));

  let bytes: Buffer;
  try {
    bytes = readFileSync(absolutePath);
  } catch {
    throw new ContentValidationError(FILE_LABEL, [
      `[${index}].photo.src: "${src}" does not exist under public/`,
    ]);
  }

  try {
    const { width, height } = imageSize(bytes);
    return { width, height };
  } catch {
    throw new ContentValidationError(FILE_LABEL, [
      `[${index}].photo.src: could not read image dimensions from "${src}"`,
    ]);
  }
}

let cached: readonly TeamMember[] | null = null;
const shouldCache = process.env.NODE_ENV === "production";

export function getTeam(): readonly TeamMember[] {
  if (shouldCache && cached !== null) return cached;

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(CONTENT_PATH, "utf8"));
  } catch (error) {
    throw new ContentValidationError(FILE_LABEL, [
      `(file): ${error instanceof Error ? error.message : "could not be read"}`,
    ]);
  }

  const result = teamSchema.safeParse(raw);
  if (!result.success) {
    throw new ContentValidationError(FILE_LABEL, describeIssues(result.error));
  }

  cached = result.data.map((member, index) => ({
    ...member,
    photo: { ...member.photo, ...measurePortrait(member.photo.src, index) },
  }));

  return cached;
}
