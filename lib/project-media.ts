import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { ContentValidationError } from "./content-error";
import type {
  FloorPlanFrontmatter,
  GalleryImageFrontmatter,
  ImageFrontmatter,
  ProjectMediaFrontmatter,
} from "./schema";

/**
 * Turns the folder-relative asset paths in frontmatter into what a component
 * can hand straight to `next/image`: a servable URL plus the real pixel
 * dimensions read off the file at build time.
 *
 * Static imports are not an option — the paths come from MDX and are only known
 * at runtime of the build, so dimensions are measured from disk instead.
 */

type Dimensions = {
  readonly width: number;
  readonly height: number;
};

/** `src` is a public URL here, not the folder-relative path in frontmatter. */
export type ResolvedImage = ImageFrontmatter & Dimensions;
export type ResolvedGalleryImage = GalleryImageFrontmatter & Dimensions;

export type ResolvedFloorPlan = Omit<FloorPlanFrontmatter, "image" | "alt" | "pdf"> & {
  readonly image: ResolvedImage;
  /** A download link, not an image — left as a URL with no dimensions. */
  readonly pdf?: string;
};

export type ResolvedProjectMedia = {
  readonly hero: ResolvedImage;
  readonly gallery?: readonly ResolvedGalleryImage[];
  readonly floorPlans?: readonly ResolvedFloorPlan[];
};

export type MediaContext = {
  /** Absolute path to `content/projects/<slug>`. */
  readonly projectDirectory: string;
  /** Repo-relative path of the MDX file, used in error messages. */
  readonly filePath: string;
  readonly slug: string;
};

/**
 * Assets are mirrored into `public/projects/<slug>/` by
 * `scripts/sync-content-assets.mjs`, so this URL is servable.
 */
function toPublicUrl(slug: string, relativeSrc: string): string {
  const normalized = relativeSrc.split(path.sep).join("/").replace(/^\/+/, "");
  return `/projects/${slug}/${normalized}`;
}

/**
 * Measured once per file per build. The same hero can be referenced by a card, a
 * detail page and an OG image without being re-read each time.
 */
const dimensionCache = new Map<string, Dimensions>();

function measure(relativeSrc: string, field: string, context: MediaContext): Dimensions {
  const absolutePath = path.join(context.projectDirectory, relativeSrc);

  const cached = dimensionCache.get(absolutePath);
  if (cached !== undefined) return cached;

  let bytes: Buffer;
  try {
    bytes = readFileSync(absolutePath);
  } catch {
    throw new ContentValidationError(context.filePath, [
      `${field}: referenced image "${relativeSrc}" does not exist on disk`,
    ]);
  }

  let dimensions: Dimensions;
  try {
    const { width, height } = imageSize(bytes);
    dimensions = { width, height };
  } catch {
    throw new ContentValidationError(context.filePath, [
      `${field}: could not read image dimensions from "${relativeSrc}"`,
    ]);
  }

  dimensionCache.set(absolutePath, dimensions);
  return dimensions;
}

/** A missing PDF is a dead download link, so it fails the build too. */
function assertFileExists(relativeSrc: string, field: string, context: MediaContext): string {
  try {
    readFileSync(path.join(context.projectDirectory, relativeSrc));
  } catch {
    throw new ContentValidationError(context.filePath, [
      `${field}: referenced file "${relativeSrc}" does not exist on disk`,
    ]);
  }
  return toPublicUrl(context.slug, relativeSrc);
}

function resolveImage<T extends ImageFrontmatter>(
  image: T,
  field: string,
  context: MediaContext,
): T & Dimensions {
  return {
    ...image,
    src: toPublicUrl(context.slug, image.src),
    ...measure(image.src, `${field}.src`, context),
  };
}

function resolveFloorPlan(
  plan: FloorPlanFrontmatter,
  field: string,
  context: MediaContext,
): ResolvedFloorPlan {
  const { label, image, alt, pdf } = plan;
  return {
    label,
    image: resolveImage({ src: image, alt }, `${field}.image`, context),
    ...(pdf === undefined ? {} : { pdf: assertFileExists(pdf, `${field}.pdf`, context) }),
  };
}

/**
 * Optional blocks stay absent rather than becoming empty arrays — a project
 * with no gallery must resolve cleanly, not to an empty section.
 */
export function resolveProjectMedia(
  media: ProjectMediaFrontmatter,
  context: MediaContext,
): ResolvedProjectMedia {
  return {
    hero: resolveImage(media.hero, "media.hero", context),
    ...(media.gallery === undefined
      ? {}
      : {
          gallery: media.gallery.map((image, index) =>
            resolveImage(image, `media.gallery[${index}]`, context),
          ),
        }),
    ...(media.floorPlans === undefined
      ? {}
      : {
          floorPlans: media.floorPlans.map((plan, index) =>
            resolveFloorPlan(plan, `media.floorPlans[${index}]`, context),
          ),
        }),
  };
}
