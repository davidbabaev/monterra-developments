import path from "node:path";
import { describe, expect, it } from "vitest";
import { ContentValidationError } from "@/lib/content-error";
import { resolveProjectMedia } from "@/lib/project-media";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

/** The real placeholder assets, as written by scripts/generate-placeholders.mjs. */
const HERO = { width: 1920, height: 1080 };
const GALLERY = { width: 1200, height: 800 };
const FLOOR_PLAN = { width: 1600, height: 1200 };

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
      expect(project.media.hero).toMatchObject(HERO);
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
      src: "/projects/monterra-ridge/hero.png",
      alt: expect.stringContaining("[REPLACE]"),
      width: 1920,
      height: 1080,
    });
  });

  it("keeps an authored caption and omits it where there is none", () => {
    const gallery = getProjectBySlug("monterra-ridge")?.media.gallery;
    expect(gallery?.[0].caption).toBeDefined();
    expect(gallery?.[1].caption).toBeUndefined();
  });

  it("resolves nested folder paths to public URLs", () => {
    const gallery = getProjectBySlug("monterra-ridge")?.media.gallery;
    expect(gallery?.[0].src).toBe("/projects/monterra-ridge/gallery/01.png");
  });

  it("leaves the floor plan pdf as a link with no dimensions", () => {
    const [planA, planB] = getProjectBySlug("monterra-ridge")?.media.floorPlans ?? [];
    expect(planA.pdf).toBe("/projects/monterra-ridge/plans/plan-a.pdf");
    expect(planA.image.src).toBe("/projects/monterra-ridge/plans/plan-a.png");
    expect(planB.pdf).toBeUndefined();
  });
});

describe("resolved media — optional blocks", () => {
  it("loads a project with no gallery and no floor plans without error", () => {
    const bay = getProjectBySlug("monterra-bay");
    expect(bay?.media.gallery).toBeUndefined();
    expect(bay?.media.floorPlans).toBeUndefined();
    expect(bay?.media.hero).toMatchObject(HERO);
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
          hero: { src: "hero.png", alt: "Hero" },
          gallery: [{ src: "gallery/01.png", alt: "Present" }, missingImage],
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
          hero: { src: "hero.png", alt: "Hero" },
          floorPlans: [
            { label: "Plan A", image: "plans/plan-a.png", alt: "Plan A", pdf: "plans/gone.pdf" },
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
    const first = resolveProjectMedia({ hero: { src: "hero.png", alt: "Hero" } }, context);
    const second = resolveProjectMedia({ hero: { src: "hero.png", alt: "Hero" } }, context);
    expect(first.hero).toEqual(second.hero);
    expect(first.hero).toMatchObject(HERO);
  });
});
