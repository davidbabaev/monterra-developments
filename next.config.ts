import type { NextConfig } from "next";
import { ContentValidationError } from "./lib/content-error";
import { getAllProjects } from "./lib/projects";

/**
 * Validate every project on disk as the build starts.
 *
 * Nothing renders yet, so no page imports the loader. Running it here means
 * invalid frontmatter still fails `next build` and `next dev` immediately,
 * naming the file and the offending field. Once pages exist they exercise the
 * same loader; this stays as the earliest possible failure point.
 */
function validateContent(): void {
  try {
    const projects = getAllProjects();
    console.log(`content: ${projects.length} projects validated`);
  } catch (error) {
    if (error instanceof ContentValidationError) {
      console.error(`\nContent validation failed\n${error.message}\n`);
    }
    throw error;
  }
}

validateContent();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
