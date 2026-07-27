import { describe, expect, it } from "vitest";
import { getAllProjects } from "@/lib/projects";
import { PAGE_SEO, SITE_URL, buildMetadata, projectDescription, type SeoPath } from "@/lib/seo";
import { organizationSchema, projectSchema } from "@/lib/structured-data";

/**
 * The launch gate for metadata: no duplicate titles, no duplicate descriptions,
 * and every description inside the window a search engine will actually show.
 *
 * These are the failures that are invisible in a browser and expensive to find
 * later — nobody notices two pages sharing a description until the second one
 * stops being indexed.
 */

const PATHS = Object.keys(PAGE_SEO) as SeoPath[];
const MIN = 150;
const MAX = 160;

describe("page metadata", () => {
  it("gives every route a description between 150 and 160 characters", () => {
    for (const path of PATHS) {
      const { length } = PAGE_SEO[path].description;
      expect(length, `${path} description is ${length} characters`).toBeGreaterThanOrEqual(MIN);
      expect(length, `${path} description is ${length} characters`).toBeLessThanOrEqual(MAX);
    }
  });

  it("repeats no title and no description anywhere", () => {
    const titles = PATHS.map((path) => PAGE_SEO[path].title);
    const descriptions = PATHS.map((path) => PAGE_SEO[path].description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("gives every route a canonical path and the large Twitter card", () => {
    for (const path of PATHS) {
      const metadata = buildMetadata(path);
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.twitter).toEqual({ card: "summary_large_image" });
    }
  });

  it("names the default share card, which a declared openGraph would otherwise drop", () => {
    expect(buildMetadata("/about").openGraph?.images).toEqual(["/opengraph-image"]);
  });

  it("keeps the styleguide out of the index and every other page in it", () => {
    expect(buildMetadata("/styleguide").robots).toEqual({ index: false, follow: false });
    for (const path of PATHS.filter((candidate) => candidate !== "/styleguide")) {
      expect(buildMetadata(path).robots).toBeUndefined();
    }
  });

  it("sets home's title absolutely, so the site name is not appended twice", () => {
    expect(buildMetadata("/").title).toEqual({
      absolute: PAGE_SEO["/"].title,
    });
    expect(buildMetadata("/about").title).toBe("About");
  });
});

describe("project metadata", () => {
  const projects = getAllProjects();

  it("gives every seeded project an authored description in range", () => {
    for (const project of projects) {
      const description = projectDescription(project);
      expect(description, `${project.slug} has no authored description`).toBe(
        project.seo?.description,
      );
      expect(description.length, `${project.slug} is ${description.length}`).toBeGreaterThanOrEqual(
        MIN,
      );
      expect(description.length).toBeLessThanOrEqual(MAX);
    }
  });

  it("repeats no project description", () => {
    const descriptions = projects.map((project) => projectDescription(project));
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("falls back to a derived sentence when nothing is authored", () => {
    const derived = projectDescription({
      summary: "A summary.",
      location: { city: "Austin", state: "TX" },
    });
    expect(derived).toBe("A summary. In Austin, TX.");
  });
});

describe("structured data", () => {
  it("describes the organisation with an absolute url", () => {
    const schema = organizationSchema();

    expect(schema["@type"]).toBe("Organization");
    expect(schema.url).toBe(SITE_URL);
    expect(schema.address).toMatchObject({ "@type": "PostalAddress", addressCountry: "US" });
  });

  it("emits a Residence only for a project that has coordinates", () => {
    for (const project of getAllProjects()) {
      const schema = projectSchema(project);

      if (project.location.coords === undefined) {
        expect(schema, `${project.slug} should emit nothing`).toBeNull();
        continue;
      }

      expect(schema?.["@type"]).toBe("Residence");
      expect(schema?.geo).toMatchObject({
        "@type": "GeoCoordinates",
        latitude: project.location.coords.lat,
        longitude: project.location.coords.lng,
      });
    }
  });

  it("leaves Monterra Bay with no structured data at all, rather than a hollow block", () => {
    const bay = getAllProjects().find((project) => project.slug === "monterra-bay");
    expect(bay?.location.coords).toBeUndefined();
    expect(projectSchema(bay!)).toBeNull();
  });

  it("serialises to valid JSON", () => {
    for (const project of getAllProjects()) {
      const schema = projectSchema(project);
      if (schema === null) continue;
      expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
    }
    expect(() => JSON.parse(JSON.stringify(organizationSchema()))).not.toThrow();
  });
});
