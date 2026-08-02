import path from "node:path";
import { describe, expect, it } from "vitest";
import { ContentValidationError } from "@/lib/content-error";
import { resolveProjectMedia } from "@/lib/project-media";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

/**
 * The real files on disk. Photography landed for Monterra Ridge and The Larkin
 * on 2026-08-02 at 1920x1072 and 1600x1067, and Monterra Bay's hero followed the
 * same day at the same 1920x1072. All three heroes are now one shape.
 *
 * The real floor plan drawings landed on 2026-08-02 and Monterra Ridge authors
 * them again, so these cases read the plans off the content as they did before
 * the block was briefly dropped. Both plates are 1024x687 — the drawings are
 * the one image on the site that carries information, and the box they resolve
 * to is what the lightbox opens them at.
 *
 * No PDF came with them, so the content exercises no pdf branch at all. The
 * cases that need one build their own props and point at `plans/plan-a.pdf`,
 * which stays on disk as a fixture and is linked from nowhere on the site.
 */
const PHOTO_HERO = { width: 1920, height: 1072 };
const GALLERY = { width: 1600, height: 1067 };
const FLOOR_PLAN = { width: 1024, height: 687 };

/** The real asset filenames, so a rename has to be made deliberately here too. */
const HERO_FILE = "hero.webp";
const GALLERY_FILE = "gallery/01.webp";
const PLAN_FILE = "plans/plan-a.webp";

const contextFor = (slug: string) => ({
  projectDirectory: path.join(process.cwd(), "content", "projects", slug),
  filePath: `content/projects/${slug}/index.mdx`,
  slug,
});

describe("resolved media — dimensions are read from the files on disk", () => {
  it("gives every hero numeric width and height", () => {
    for (const project of getAllProjects()) {
      expect(project.media.hero.width).toBeTypeOf("number");
      expect(project.media.hero.height).toBeTypeOf("number");
    }
  });

  /** Every hero is photographed, measured off the file rather than authored. */
  it("measures the photographed heroes at their own size", () => {
    for (const slug of ["monterra-ridge", "monterra-bay", "the-larkin"]) {
      expect(getProjectBySlug(slug)?.media.hero).toMatchObject(PHOTO_HERO);
    }
  });

  it("gives every gallery image numeric width and height", () => {
    const gallery = getProjectBySlug("the-larkin")?.media.gallery;
    expect(gallery).toHaveLength(4);
    for (const image of gallery ?? []) {
      expect(image).toMatchObject(GALLERY);
    }
  });

  it("gives every floor plan image numeric width and height", () => {
    const floorPlans = getProjectBySlug("monterra-ridge")?.media.floorPlans;
    expect(floorPlans).toHaveLength(2);
    for (const plan of floorPlans ?? []) {
      expect(plan.image).toMatchObject(FLOOR_PLAN);
    }
  });
});

describe("resolved media — shape handed to next/image", () => {
  it("carries src, alt, width and height on the hero", () => {
    const hero = getProjectBySlug("monterra-ridge")?.media.hero;
    expect(hero).toEqual({
      src: "/projects/monterra-ridge/hero.webp",
      alt: "Four townhomes at dusk, brick and dark cladding over three storeys, windows lit and a stone path curving across the lawn in front",
      width: 1920,
      height: 1072,
    });
  });

  /**
   * The dimensions above and here are read off the file by image-size at load,
   * not authored anywhere. Pinning the gallery box too is what catches a
   * re-export at a different size silently changing every declared box.
   */
  it("reads the gallery's intrinsic box off the file at 3:2", () => {
    const gallery = getProjectBySlug("monterra-ridge")?.media.gallery ?? [];
    expect(gallery).toHaveLength(4);
    for (const image of gallery) {
      expect(image).toMatchObject(GALLERY);
      expect(image.width / image.height).toBeCloseTo(3 / 2, 2);
    }
  });

  it("keeps an authored caption and omits it where there is none", () => {
    const gallery = getProjectBySlug("monterra-ridge")?.media.gallery;
    expect(gallery?.[0].caption).toBeDefined();
    expect(gallery?.[1].caption).toBeUndefined();
  });

  it("resolves nested folder paths to public URLs", () => {
    const gallery = getProjectBySlug("monterra-ridge")?.media.gallery;
    expect(gallery?.[0].src).toBe("/projects/monterra-ridge/gallery/01.webp");
  });

  it("resolves both authored plans to public URLs, neither with a pdf", () => {
    const floorPlans = getProjectBySlug("monterra-ridge")?.media.floorPlans ?? [];
    expect(floorPlans.map((plan) => plan.image.src)).toEqual([
      "/projects/monterra-ridge/plans/plan-a.webp",
      "/projects/monterra-ridge/plans/plan-b.webp",
    ]);
    for (const plan of floorPlans) {
      expect(plan.pdf).toBeUndefined();
    }
  });

  /**
   * No PDF was supplied with the drawings, so the content no longer exercises
   * the resolver's pdf branch — this pins it against synthetic props instead.
   * `plans/plan-a.pdf` is still on disk for exactly this and for the
   * missing-pdf case below; nothing on the site links to it.
   */
  it("leaves an authored floor plan pdf as a link with no dimensions", () => {
    const { floorPlans } = resolveProjectMedia(
      {
        hero: { src: HERO_FILE, alt: "Hero" },
        floorPlans: [
          { label: "Plan A", image: PLAN_FILE, alt: "Plan A", pdf: "plans/plan-a.pdf" },
          { label: "Plan B", image: "plans/plan-b.webp", alt: "Plan B" },
        ],
      },
      contextFor("monterra-ridge"),
    );
    const [planA, planB] = floorPlans ?? [];

    expect(planA.pdf).toBe("/projects/monterra-ridge/plans/plan-a.pdf");
    expect(planA.image).toMatchObject(FLOOR_PLAN);
    expect(planB.pdf).toBeUndefined();
  });
});

describe("resolved media — optional blocks", () => {
  it("loads a project with no gallery and no floor plans without error", () => {
    const bay = getProjectBySlug("monterra-bay");
    expect(bay?.media.gallery).toBeUndefined();
    expect(bay?.media.floorPlans).toBeUndefined();
    expect(bay?.media.hero).toMatchObject(PHOTO_HERO);
  });
});

describe("resolved media — missing files fail the build", () => {
  const missingImage = { src: "does-not-exist.png", alt: "Missing" };

  it("throws naming the file and field for a missing hero", () => {
    expect(() => resolveProjectMedia({ hero: missingImage }, contextFor("monterra-ridge"))).toThrow(
      ContentValidationError,
    );
  });

  it("names the exact gallery index that is missing", () => {
    let message = "";
    try {
      resolveProjectMedia(
        {
          hero: { src: HERO_FILE, alt: "Hero" },
          gallery: [{ src: GALLERY_FILE, alt: "Present" }, missingImage],
        },
        contextFor("monterra-ridge"),
      );
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(message).toContain("content/projects/monterra-ridge/index.mdx");
    expect(message).toContain("media.gallery[1].src");
    expect(message).toContain("does-not-exist.png");
  });

  it("names a missing floor plan pdf", () => {
    let message = "";
    try {
      resolveProjectMedia(
        {
          hero: { src: HERO_FILE, alt: "Hero" },
          floorPlans: [
            { label: "Plan A", image: PLAN_FILE, alt: "Plan A", pdf: "plans/gone.pdf" },
          ],
        },
        contextFor("monterra-ridge"),
      );
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(message).toContain("media.floorPlans[0].pdf");
  });

  it("reports a file that exists but is not a readable image", () => {
    let message = "";
    try {
      resolveProjectMedia(
        { hero: { src: "index.mdx", alt: "Not an image" } },
        contextFor("monterra-ridge"),
      );
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(message).toContain("could not read image dimensions");
  });
});

describe("dimension caching", () => {
  it("returns the same measurements when a file is resolved repeatedly", () => {
    const context = contextFor("monterra-ridge");
    const first = resolveProjectMedia({ hero: { src: HERO_FILE, alt: "Hero" } }, context);
    const second = resolveProjectMedia({ hero: { src: HERO_FILE, alt: "Hero" } }, context);
    expect(first.hero).toEqual(second.hero);
    expect(first.hero).toMatchObject(PHOTO_HERO);
  });
});
