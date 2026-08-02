import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AmenityList } from "@/components/project/AmenityList";
import { FloorPlanList } from "@/components/project/FloorPlanList";
import { LocationBlock } from "@/components/project/LocationBlock";
import { ProjectNav } from "@/components/project/ProjectNav";
import { SpecTable } from "@/components/project/SpecTable";
import { StatusTracker } from "@/components/project/StatusTracker";
import { splitProjectTitle } from "@/components/project/splitProjectTitle";
import { directionsUrl } from "@/lib/directions";
import type { ResolvedFloorPlan } from "@/lib/project-media";
import { getProjectBySlug } from "@/lib/projects";

/**
 * The rule this increment exists to enforce: an absent optional field renders
 * nothing at all. Every case here asserts an absence — no heading, no row, no
 * button — because a blank row is the failure mode, not a missing one.
 */

const fullSpecs = {
  propertyTypes: ["Townhomes", "Duplexes"],
  units: 48,
  sqftRange: "1,400-2,100 sq ft",
  completion: "Q3 2027",
};

const labelsOf = (container: HTMLElement) =>
  [...container.querySelectorAll("dt")].map((row) => row.textContent);

describe("splitProjectTitle", () => {
  it("takes the first word as the editorial lede", () => {
    expect(splitProjectTitle("Monterra Ridge")).toEqual({ lede: "Monterra", rest: "Ridge" });
    expect(splitProjectTitle("The Larkin")).toEqual({ lede: "The", rest: "Larkin" });
  });

  it("keeps a three-word title's remainder together, so the lede stays one word", () => {
    expect(splitProjectTitle("The Larkin Building")).toEqual({
      lede: "The",
      rest: "Larkin Building",
    });
  });

  it("makes a single-word title the lede with no empty remainder", () => {
    expect(splitProjectTitle("Larkin")).toEqual({ lede: "Larkin", rest: "" });
  });
});

describe("SpecTable", () => {
  it("renders every row a full project has", () => {
    const { container } = render(<SpecTable specs={fullSpecs} status="current" />);
    expect(labelsOf(container)).toEqual(["Property type", "Units", "Size", "Completion", "Status"]);
  });

  it("omits the rows an upcoming project has no data for, rather than blanking them", () => {
    const { container } = render(
      <SpecTable specs={{ propertyTypes: ["Condominiums"] }} status="upcoming" />,
    );

    expect(labelsOf(container)).toEqual(["Property type", "Status"]);
    expect(container.querySelectorAll("dd")).toHaveLength(2);
    expect(screen.queryByText("Units")).not.toBeInTheDocument();
    expect(screen.queryByText(/TBA|n\/a|—/i)).not.toBeInTheDocument();
  });

  it("builds the real Monterra Bay table from disk with no empty cell", () => {
    const bay = getProjectBySlug("monterra-bay");
    expect(bay).not.toBeNull();

    const { container } = render(<SpecTable specs={bay!.specs} status={bay!.status} />);
    const values = [...container.querySelectorAll("dd")].map((cell) => cell.textContent);

    expect(values).toEqual(["Condominiums", "Upcoming"]);
    expect(values.every((value) => value !== null && value.trim() !== "")).toBe(true);
  });

  it("joins multiple property types into one row", () => {
    render(<SpecTable specs={fullSpecs} status="current" />);
    expect(screen.getByText("Townhomes · Duplexes")).toBeInTheDocument();
  });
});

describe("AmenityList", () => {
  it("renders one marked row per amenity", () => {
    render(<AmenityList amenities={["Rooftop terraces", "EV charging in every garage"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("What's included");
  });

  it("renders nothing when the project has no amenities", () => {
    const { container } = render(<AmenityList />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty list, rather than an orphan heading", () => {
    const { container } = render(<AmenityList amenities={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

/** The gallery has its own file: tests/unit/gallery.test.tsx. */

describe("FloorPlanList", () => {
  const withPdf: ResolvedFloorPlan = {
    label: "Plan A",
    image: { src: "/projects/x/plans/a.png", alt: "Plan A drawing", width: 1600, height: 1200 },
    pdf: "/projects/x/plans/a.pdf",
  };

  const withoutPdf: ResolvedFloorPlan = {
    label: "Plan B",
    image: { src: "/projects/x/plans/b.png", alt: "Plan B drawing", width: 1600, height: 1200 },
  };

  it("gives a plan with a PDF a download that opens safely in a new tab", () => {
    render(<FloorPlanList plans={[withPdf]} />);
    const link = screen.getByRole("link", { name: /download pdf/i });

    expect(link).toHaveAttribute("href", "/projects/x/plans/a.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("shows the drawing but no download for a plan with no PDF", () => {
    render(<FloorPlanList plans={[withoutPdf]} />);

    expect(screen.getByAltText("Plan B drawing")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /download/i })).not.toBeInTheDocument();
    /*
      The row's one control is the thumbnail that opens the viewer. A plan with
      no PDF must not grow a second control beside it, which is what this
      counted before the thumbnail became a button.
    */
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /plan b — view larger/i })).toBeInTheDocument();
  });

  it("opens the clicked plan in the gallery viewer, captioned with its label", async () => {
    const user = userEvent.setup();
    render(<FloorPlanList plans={[withPdf, withoutPdf]} />);

    // The second plan, not the first — a bug that always opens index 0 passes otherwise.
    await user.click(screen.getByRole("button", { name: /plan b — view larger/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("2 / 2")).toBeInTheDocument();
    // The drawings carry no title of their own, so the label is what names them.
    expect(within(dialog).getByText("Plan B")).toBeInTheDocument();
  });

  it("returns focus to the thumbnail that opened the viewer", async () => {
    const user = userEvent.setup();
    render(<FloorPlanList plans={[withPdf, withoutPdf]} />);

    const thumbnail = screen.getByRole("button", { name: /plan b — view larger/i });
    await user.click(thumbnail);
    await user.click(screen.getByRole("button", { name: /close gallery/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(thumbnail).toHaveFocus();
  });

  it("renders exactly one download when only one of two plans has a PDF", () => {
    render(<FloorPlanList plans={[withPdf, withoutPdf]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /download pdf/i })).toHaveLength(1);
  });

  it("names the plan in the download's accessible name, since the label repeats", () => {
    render(<FloorPlanList plans={[withPdf]} />);
    // Tolerant of how the name computation joins the visible label to the
    // hidden suffix; what matters is that the plan is named at all.
    expect(screen.getByRole("link", { name: /download pdf.*plan a/i })).toBeInTheDocument();
  });

  it("renders nothing when the project has no plans", () => {
    const { container } = render(<FloorPlanList />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("LocationBlock", () => {
  const location = { city: "Austin", state: "TX" };

  it("renders the address above the city when one exists", () => {
    render(<LocationBlock location={{ ...location, address: "4200 E Riverside Drive" }} />);
    expect(screen.getByText("4200 E Riverside Drive")).toBeInTheDocument();
    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
  });

  it("renders the city alone when the project has no address", () => {
    const { container } = render(<LocationBlock location={location} />);

    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
    expect(container.querySelectorAll("address span")).toHaveLength(1);
  });

  it("renders a static map and a directions link when coords exist", () => {
    render(<LocationBlock location={{ ...location, coords: { lat: 30.2411, lng: -97.7178 } }} />);

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Map showing the project location");
    expect(screen.getByRole("link", { name: /directions/i })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=30.2411,-97.7178",
    );
  });

  it("renders no map frame and no dead directions link without coords", () => {
    render(<LocationBlock location={location} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /directions/i })).not.toBeInTheDocument();
  });

  it("never embeds an interactive map", () => {
    const { container } = render(
      <LocationBlock location={{ ...location, coords: { lat: 30.2411, lng: -97.7178 } }} />,
    );
    expect(container.querySelector("iframe")).toBeNull();
  });
});

describe("directionsUrl", () => {
  it("points at a plain maps URL with no key and no script", () => {
    expect(directionsUrl({ lat: 1.5, lng: -2.25 })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=1.5,-2.25",
    );
  });
});

describe("StatusTracker", () => {
  it("renders the three lifecycle stages in order", () => {
    render(<StatusTracker status="current" />);
    const stages = screen.getAllByRole("listitem").map((item) => item.textContent);

    expect(stages[0]).toContain("Upcoming");
    expect(stages[1]).toContain("Current");
    expect(stages[2]).toContain("Completed");
  });

  it("marks the active stage without relying on colour", () => {
    const { container } = render(<StatusTracker status="current" />);
    const active = container.querySelector('[aria-current="step"]');

    // Cue 1: exposed to assistive tech. Cue 2: named in words, not just hue.
    expect(active).toHaveTextContent("Current");
    expect(active).toHaveTextContent("current stage");
    // Cue 3: a filled chip and a heavier label against two outlined stages.
    expect(active?.className).toContain("font-semibold");
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });

  it("moves the active stage with the status", () => {
    for (const status of ["upcoming", "current", "completed"] as const) {
      const { container, unmount } = render(<StatusTracker status={status} />);
      expect(container.querySelector('[aria-current="step"]')?.textContent).toMatch(
        new RegExp(status, "i"),
      );
      unmount();
    }
  });

  // The line is keyed to the status alone. The project title is not repeated:
  // the page heading and the breadcrumb above have already said it twice.
  it("moves the line of context beneath with the status", () => {
    const LINES = {
      upcoming: "In design. Details to follow.",
      current: "Under construction.",
      completed: "Delivered and sold.",
    } as const;

    for (const [status, line] of Object.entries(LINES)) {
      const { unmount } = render(<StatusTracker status={status as keyof typeof LINES} />);
      expect(screen.getByText(line)).toBeInTheDocument();
      unmount();
    }
  });
});

describe("ProjectNav", () => {
  const item = (slug: string, title: string) => ({
    slug,
    title,
    hero: { src: `/projects/${slug}/hero.png`, alt: `${title} hero`, width: 1920, height: 1080 },
  });

  it("links both neighbours by slug", () => {
    render(
      <ProjectNav
        currentSlug="monterra-bay"
        prev={item("monterra-ridge", "Monterra Ridge")}
        next={item("the-larkin", "The Larkin")}
      />,
    );

    expect(screen.getByRole("link", { name: /previous project/i })).toHaveAttribute(
      "href",
      "/projects/monterra-ridge",
    );
    expect(screen.getByRole("link", { name: /next project/i })).toHaveAttribute(
      "href",
      "/projects/the-larkin",
    );
  });

  it("wraps: the last project's next is the first project", () => {
    render(
      <ProjectNav
        currentSlug="the-larkin"
        prev={item("monterra-bay", "Monterra Bay")}
        next={item("monterra-ridge", "Monterra Ridge")}
      />,
    );

    const next = screen.getByRole("link", { name: /next project/i });
    expect(next).toHaveAttribute("href", "/projects/monterra-ridge");
    expect(next).toHaveTextContent("Monterra Ridge");
  });

  it("never links back to the page it is on", () => {
    const { container } = render(
      <ProjectNav
        currentSlug="only"
        prev={item("only", "Only Project")}
        next={item("only", "Only Project")}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
