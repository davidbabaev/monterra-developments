import type { ZodError } from "zod";

/**
 * Thrown when a content file on disk is not valid. Never caught by the loader —
 * invalid content must fail the build, naming the file and the offending field.
 */
export class ContentValidationError extends Error {
  constructor(
    readonly filePath: string,
    readonly problems: readonly string[],
  ) {
    super(
      `Invalid project content in ${filePath}\n` +
        problems.map((problem) => `  - ${problem}`).join("\n"),
    );
    this.name = "ContentValidationError";
  }
}

/** `["media", "gallery", 1, "alt"]` -> `media.gallery[1].alt` */
function formatFieldPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) return "(root)";
  return path.reduce<string>((formatted, segment) => {
    if (typeof segment === "number") return `${formatted}[${segment}]`;
    return formatted === "" ? String(segment) : `${formatted}.${String(segment)}`;
  }, "");
}

/** One `field: message` line per issue, so the build error names the field. */
export function describeIssues(error: ZodError): string[] {
  return error.issues.map((issue) => `${formatFieldPath(issue.path)}: ${issue.message}`);
}
