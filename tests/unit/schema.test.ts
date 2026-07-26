import { describe, expect, it } from "vitest";
import { projectFrontmatterSchema } from "@/lib/schema";
import { getAllProjects } from "@/lib/projects";

/**
 * Fixtures are built from a minimal valid `upcoming` project and widened per
 * case, so each test states exactly the one thing it is about.
 */
const minimalUpcoming = {
  title: "Test Project",
  slug: "test-project",
  order: 1,
  status: "upcoming",
  location: { city: "Tampa", state: "FL" },
  specs: { propertyTypes: ["Condominiums"] },
  summary: "A test project summary that is comfortably longer than the forty character minimum.",
  media: { hero: { src: "hero.png", alt: "A hero image" } },
};

const galleryOf = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    src: `gallery/0${index + 1}.png`,
    alt: `Gallery image ${index + 1}`,
  }));

/** Field paths reported by a failed parse, as `media.gallery` style strings. */
function failedFields(input: unknown): string[] {
  const result = projectFrontmatterSchema.safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("projectFrontmatterSchema — seed content", () => {
  it("accepts all three seed projects", () => {
    const projects = getAllProjects();
    expect(projects).toHaveLength(3);
    for (const project of projects) {
      // `body` is not part of the frontmatter schema and is stripped on parse.
      expect(projectFrontmatterSchema.safeParse(project).success).toBe(true);
    }
  });
});

describe("projectFrontmatterSchema — conditional validation by status", () => {
  it("rejects a completed project with no gallery", () => {
    expect(
      failedFields({
        ...minimalUpcoming,
        status: "completed",
        specs: { ...minimalUpcoming.specs, completion: "2024" },
      }),
    ).toContain("media.gallery");
  });

  it("rejects a completed project with a two-image gallery", () => {
    expect(
      failedFields({
        ...minimalUpcoming,
        status: "completed",
        specs: { ...minimalUpcoming.specs, completion: "2024" },
        media: { ...minimalUpcoming.media, gallery: galleryOf(2) },
      }),
    ).toContain("media.gallery");
  });

  it("accepts a completed project with a three-image gallery", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...minimalUpcoming,
      status: "completed",
      specs: { ...minimalUpcoming.specs, completion: "2024" },
      media: { ...minimalUpcoming.media, gallery: galleryOf(3) },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a current project with no completion date", () => {
    expect(failedFields({ ...minimalUpcoming, status: "current" })).toContain("specs.completion");
  });

  it("accepts an upcoming project carrying only the minimum fields", () => {
    const result = projectFrontmatterSchema.safeParse(minimalUpcoming);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.specs.completion).toBeUndefined();
    expect(result.data.media.gallery).toBeUndefined();
    expect(result.data.amenities).toBeUndefined();
  });
});

describe("projectFrontmatterSchema — field validation", () => {
  it("rejects a gallery image with an empty alt", () => {
    expect(
      failedFields({
        ...minimalUpcoming,
        media: {
          ...minimalUpcoming.media,
          gallery: [{ src: "gallery/01.png", alt: "" }],
        },
      }),
    ).toContain("media.gallery.0.alt");
  });

  it("rejects a hero image with an empty alt", () => {
    expect(
      failedFields({
        ...minimalUpcoming,
        media: { hero: { src: "hero.png", alt: "" } },
      }),
    ).toContain("media.hero.alt");
  });

  it("rejects an invalid status", () => {
    expect(failedFields({ ...minimalUpcoming, status: "planned" })).toContain("status");
  });

  it("rejects a slug that is not lowercase-hyphen", () => {
    expect(failedFields({ ...minimalUpcoming, slug: "Test Project" })).toContain("slug");
  });

  it("rejects a state that is not two characters", () => {
    expect(
      failedFields({ ...minimalUpcoming, location: { city: "Tampa", state: "Florida" } }),
    ).toContain("location.state");
  });

  it("rejects a summary outside 40-220 characters", () => {
    expect(failedFields({ ...minimalUpcoming, summary: "Too short." })).toContain("summary");
    expect(failedFields({ ...minimalUpcoming, summary: "x".repeat(221) })).toContain("summary");
  });

  it("rejects an empty propertyTypes list", () => {
    expect(failedFields({ ...minimalUpcoming, specs: { propertyTypes: [] } })).toContain(
      "specs.propertyTypes",
    );
  });

  it("defaults featured to false when absent", () => {
    const result = projectFrontmatterSchema.safeParse(minimalUpcoming);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.featured).toBe(false);
  });
});
