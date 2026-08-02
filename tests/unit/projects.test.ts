import { describe, expect, it } from "vitest";
import {
  getAdjacentProjects,
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectsByStatus,
} from "@/lib/projects";
import type { ProjectStatus } from "@/lib/schema";

const slugsOf = (projects: { slug: string }[]) => projects.map((project) => project.slug);

describe("getAllProjects", () => {
  it("returns all three seed projects sorted by order ascending", () => {
    const projects = getAllProjects();
    expect(projects).toHaveLength(3);
    expect(slugsOf(projects)).toEqual(["monterra-ridge", "monterra-bay", "the-larkin"]);
    expect(projects.map((project) => project.order)).toEqual([1, 2, 3]);
  });

  it("attaches the MDX body to each project", () => {
    for (const project of getAllProjects()) {
      expect(project.body.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("getProjectBySlug", () => {
  it("returns the matching project", () => {
    expect(getProjectBySlug("the-larkin")?.title).toBe("The Larkin");
  });

  it("returns null for an unknown slug", () => {
    expect(getProjectBySlug("not-a-project")).toBeNull();
  });
});

describe("getProjectsByStatus", () => {
  it("returns exactly monterra-bay for upcoming", () => {
    expect(slugsOf(getProjectsByStatus("upcoming"))).toEqual(["monterra-bay"]);
  });

  it("returns exactly the-larkin for completed", () => {
    expect(slugsOf(getProjectsByStatus("completed"))).toEqual(["the-larkin"]);
  });

  it("returns exactly monterra-ridge for current", () => {
    expect(slugsOf(getProjectsByStatus("current"))).toEqual(["monterra-ridge"]);
  });

  it("returns an empty list when nothing matches", () => {
    // Every seeded status has exactly one project, so an unmatched status has to
    // be forced. The point is that no match yields [] rather than throwing or
    // falling back to the full list.
    const unmatched = "archived" as ProjectStatus;
    expect(getProjectsByStatus(unmatched)).toEqual([]);
  });
});

describe("getFeaturedProjects", () => {
  it("returns monterra-ridge and the-larkin in order", () => {
    expect(slugsOf(getFeaturedProjects())).toEqual(["monterra-ridge", "the-larkin"]);
  });

  it("respects an explicit limit", () => {
    expect(slugsOf(getFeaturedProjects(1))).toEqual(["monterra-ridge"]);
  });

  it("returns an empty list for a limit of zero", () => {
    expect(getFeaturedProjects(0)).toEqual([]);
  });
});

describe("getAdjacentProjects", () => {
  it("wraps forward: the last project's next is the first", () => {
    expect(getAdjacentProjects("the-larkin").next?.slug).toBe("monterra-ridge");
  });

  it("wraps backward: the first project's prev is the last", () => {
    expect(getAdjacentProjects("monterra-ridge").prev?.slug).toBe("the-larkin");
  });

  it("returns the immediate neighbours in the middle of the list", () => {
    const { prev, next } = getAdjacentProjects("monterra-bay");
    expect(prev?.slug).toBe("monterra-ridge");
    expect(next?.slug).toBe("the-larkin");
  });

  it("returns nulls for an unknown slug", () => {
    expect(getAdjacentProjects("not-a-project")).toEqual({ prev: null, next: null });
  });
});

describe("the sparse upcoming project", () => {
  it("carries only the minimum data and nothing invented in its place", () => {
    const bay = getProjectBySlug("monterra-bay");
    expect(bay).not.toBeNull();
    expect(bay?.specs.units).toBeUndefined();
    expect(bay?.specs.sqftRange).toBeUndefined();
    expect(bay?.specs.completion).toBeUndefined();
    expect(bay?.media.gallery).toBeUndefined();
    expect(bay?.media.floorPlans).toBeUndefined();
    expect(bay?.amenities).toBeUndefined();
    expect(bay?.location.address).toBeUndefined();
    expect(bay?.location.coords).toBeUndefined();
    expect(bay?.featured).toBe(false);
  });
});

describe("the fully populated current project", () => {
  it("carries its optional blocks", () => {
    const ridge = getProjectBySlug("monterra-ridge");
    expect(ridge?.media.gallery).toHaveLength(4);
    expect(ridge?.media.gallery?.[0].caption).toBeDefined();
    expect(ridge?.media.floorPlans).toHaveLength(2);
    // No PDF was supplied with the drawings, so neither plan authors one and
    // no row renders a download. The resolver's pdf path is pinned against
    // synthetic props in tests/unit/project-media.test.ts.
    expect(ridge?.media.floorPlans?.every((plan) => plan.pdf === undefined)).toBe(true);
    expect(ridge?.location.coords).toEqual({ lat: 30.2411, lng: -97.7178 });
    expect(ridge?.amenities).toHaveLength(4);
  });
});

describe("the completed project with an SEO override", () => {
  it("carries its seo block", () => {
    const larkin = getProjectBySlug("the-larkin");
    expect(larkin?.seo?.title).toBe(
      "The Larkin - Denver Highlands Condominiums | Monterra Developments",
    );
    // The wording is asserted for length and uniqueness in tests/unit/seo.test.ts;
    // here it only has to be present and about this project.
    expect(larkin?.seo?.description).toContain("Denver");
    expect(larkin?.media.gallery).toHaveLength(4);
  });
});
