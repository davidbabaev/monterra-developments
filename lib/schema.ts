import { z } from "zod";

/**
 * Zod schema for a project. This is the only definition of a project's shape —
 * every type is inferred from here, never hand-written alongside it.
 */

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const galleryImageSchema = imageSchema.extend({
  caption: z.string().optional(),
});

const floorPlanSchema = z.object({
  label: z.string().min(1),
  image: z.string().min(1),
  // next/image requires alt on every image, and a floor plan drawing carries
  // information a sighted reader gets for free. Authored, never derived from
  // the label, so a missing one fails the build instead of inventing text.
  alt: z.string().min(1),
  pdf: z.string().optional(),
});

export const PROJECT_STATUSES = ["completed", "current", "upcoming"] as const;

const projectBaseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "must be lowercase letters, numbers and hyphens only"),
  order: z.number().int(),
  featured: z.boolean().default(false),
  status: z.enum(PROJECT_STATUSES),
  location: z.object({
    city: z.string().min(1),
    state: z.string().length(2),
    address: z.string().optional(),
    coords: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  specs: z.object({
    propertyTypes: z.array(z.string().min(1)).min(1),
    units: z.number().int().positive().optional(),
    sqftRange: z.string().optional(),
    completion: z.string().optional(),
  }),
  summary: z.string().min(40).max(220),
  amenities: z.array(z.string().min(1)).optional(),
  media: z.object({
    hero: imageSchema,
    gallery: z.array(galleryImageSchema).optional(),
    floorPlans: z.array(floorPlanSchema).optional(),
  }),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

type ProjectBase = z.infer<typeof projectBaseSchema>;

/** A single conditional requirement applied to a project of one status. */
type StatusRule = (project: ProjectBase, ctx: z.RefinementCtx) => void;

const MINIMUM_GALLERY_IMAGES = 3;

const requireCompletion: StatusRule = (project, ctx) => {
  if (project.specs.completion !== undefined) return;
  ctx.addIssue({
    code: "custom",
    path: ["specs", "completion"],
    message: `a "${project.status}" project requires a completion date`,
  });
};

const requireGallery: StatusRule = (project, ctx) => {
  const gallery = project.media.gallery;
  if (gallery !== undefined && gallery.length >= MINIMUM_GALLERY_IMAGES) return;
  ctx.addIssue({
    code: "custom",
    path: ["media", "gallery"],
    message:
      `a "completed" project requires a gallery of at least ${MINIMUM_GALLERY_IMAGES} images ` +
      `(found ${gallery?.length ?? 0})`,
  });
};

/**
 * Status drives which optional fields become required. An `upcoming` project
 * carrying almost no data is normal and must validate.
 */
const STATUS_RULES: Record<(typeof PROJECT_STATUSES)[number], readonly StatusRule[]> = {
  completed: [requireCompletion, requireGallery],
  current: [requireCompletion],
  upcoming: [],
};

export const projectFrontmatterSchema = projectBaseSchema.superRefine((project, ctx) => {
  for (const rule of STATUS_RULES[project.status]) {
    rule(project, ctx);
  }
});

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

/**
 * Frontmatter shapes as authored on disk. Asset fields still hold folder-relative
 * paths here; `lib/project-media.ts` turns them into servable URLs with real
 * pixel dimensions. `Project` itself is defined in `lib/project-loader.ts`,
 * where those two halves meet.
 */
export type ImageFrontmatter = z.infer<typeof imageSchema>;
export type GalleryImageFrontmatter = z.infer<typeof galleryImageSchema>;
export type FloorPlanFrontmatter = z.infer<typeof floorPlanSchema>;
export type ProjectMediaFrontmatter = ProjectFrontmatter["media"];
