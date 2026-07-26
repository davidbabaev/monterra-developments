import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/project/ProjectCard";
import { toCardData, type ProjectCardData } from "@/components/project/projectCardData";
import { getProjectBySlug } from "@/lib/projects";

const hero = { src: "/projects/x/hero.png", alt: "A hero", width: 1920, height: 1080 };

const base: ProjectCardData = {
  slug: "x",
  title: "Test Project",
  status: "current",
  city: "Austin",
  state: "TX",
  propertyTypes: ["Townhomes"],
  units: 48,
  completion: "Q3 2027",
  hero,
};

/**
 * The card body is three paragraphs: location, metadata, call to action. Picked
 * by position rather than by looking for a separator, because the whole point
 * of some of these cases is that no separator is rendered.
 */
const metadataOf = (container: HTMLElement) =>
  [...container.querySelectorAll("p")][1]?.textContent ?? "";

describe("toCardData", () => {
  it("omits units and completion entirely when the project has none", () => {
    const bay = getProjectBySlug("monterra-bay");
    expect(bay).not.toBeNull();
    const card = toCardData(bay!);

    expect("units" in card).toBe(false);
    expect("completion" in card).toBe(false);
    expect(card.hero.width).toBe(1920);
  });

  it("carries units and completion when they exist", () => {
    const card = toCardData(getProjectBySlug("the-larkin")!);
    expect(card.units).toBe(32);
    expect(card.completion).toBe("2024");
  });
});

describe("ProjectCard metadata", () => {
  it("joins property types, units and completion for a current project", () => {
    const { container } = render(<ProjectCard project={base} />);
    expect(metadataOf(container)).toBe("Townhomes · 48 units · Q3 2027");
  });

  it("joins multiple property types", () => {
    const { container } = render(
      <ProjectCard project={{ ...base, propertyTypes: ["Townhomes", "Duplexes"] }} />,
    );
    expect(metadataOf(container)).toBe("Townhomes · Duplexes · 48 units · Q3 2027");
  });

  it("reduces to property types and location for an upcoming project", () => {
    const { container } = render(
      <ProjectCard
        project={{
          slug: "bay",
          title: "Monterra Bay",
          status: "upcoming",
          city: "Tampa",
          state: "FL",
          propertyTypes: ["Condominiums"],
          hero,
        }}
      />,
    );
    expect(metadataOf(container)).toBe("Condominiums · Tampa, FL");
  });

  it("leaves no stray separator when units are missing from a current project", () => {
    const project: ProjectCardData = { ...base };
    delete (project as { units?: number }).units;

    const { container } = render(<ProjectCard project={project} />);
    const metadata = metadataOf(container);
    expect(metadata).toBe("Townhomes · Q3 2027");
    expect(metadata).not.toMatch(/·\s*·/);
    expect(metadata).not.toMatch(/·\s*$/);
  });

  it("leaves no stray separator when completion is missing too", () => {
    const project: ProjectCardData = { ...base };
    delete (project as { units?: number }).units;
    delete (project as { completion?: string }).completion;

    const { container } = render(<ProjectCard project={project} />);
    expect(metadataOf(container)).toBe("Townhomes");
  });
});

describe("ProjectCard call to action", () => {
  it("says View project for completed and current", () => {
    for (const status of ["completed", "current"] as const) {
      const { unmount } = render(<ProjectCard project={{ ...base, status }} />);
      expect(screen.getByText("View project")).toBeInTheDocument();
      unmount();
    }
  });

  it("says Register interest for upcoming, because there is nothing to view yet", () => {
    render(<ProjectCard project={{ ...base, status: "upcoming" }} />);
    expect(screen.getByText("Register interest")).toBeInTheDocument();
    expect(screen.queryByText("View project")).not.toBeInTheDocument();
  });
});

describe("ProjectCard structure", () => {
  it("wraps the whole card in exactly one link", () => {
    const { container } = render(<ProjectCard project={base} />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/projects/x");
  });

  it("gives the image the intrinsic dimensions the loader resolved", () => {
    const { container } = render(<ProjectCard project={base} />);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("width", "1920");
    expect(image).toHaveAttribute("height", "1080");
    expect(image).toHaveAttribute("alt", "A hero");
  });

  it("renders the title as an h3", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Project");
  });
});
