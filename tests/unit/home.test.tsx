import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaBand } from "@/components/layout/CtaBand";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { StatsBand } from "@/components/ui/StatsBand";
import { toCardData } from "@/components/project/projectCardData";
import { getFeaturedProjects } from "@/lib/projects";

/**
 * The homepage's contract: six sections, one h1, the hero image eager, the
 * statistics readable on stone, and numerals only where a sequence is real.
 *
 * The count-up itself is a browser behaviour — jsdom has no IntersectionObserver
 * and no layout — so it is verified in tests/e2e/home.spec.ts. What is asserted
 * here is that the figures render at their final values without one.
 */

describe("Hero", () => {
  it("carries the only h1, as a two-tone lockup claiming something about building", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent(/we build/i);
    expect(heading.textContent).not.toMatch(/buy|sale|selling/i);
  });

  it("loads the hero image eagerly, since it is the LCP element", () => {
    const { container } = render(<Hero />);
    const image = container.querySelector("img");

    expect(image).not.toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("width", "2560");
    expect(image).toHaveAttribute("height", "1429");
  });

  it("offers exactly two calls to action, both readable on a dark scrim", () => {
    render(<Hero />);

    const projects = screen.getByRole("link", { name: /view our projects/i });
    const contact = screen.getByRole("link", { name: /start a conversation/i });

    expect(projects).toHaveAttribute("href", "/projects");
    expect(contact).toHaveAttribute("href", "/contact");
    // A navy fill and a navy outline both vanish against the scrim.
    expect(projects.className).not.toContain("bg-navy");
    expect(contact.className).not.toContain("border-navy");
  });

  it("carries no slide counter, rail or side arrows", () => {
    const { container } = render(<Hero />);
    expect(container.textContent).not.toMatch(/\d+\s*\/\s*\d+/);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });
});

describe("Positioning", () => {
  it("sets the statement in the editorial face, the page's one such moment", () => {
    render(<Positioning />);
    const statement = screen.getByText(/we buy the site/i);
    expect(statement).toHaveClass("font-editorial");
  });

  it("hides the stone slab below 768px and shows a bronze rule instead", () => {
    const { container } = render(<Positioning />);
    const slab = container.querySelector(".bg-stone");
    const rule = container.querySelector(".bg-bronze");

    // The slab only exists from md up; the rule only exists below it.
    expect(slab?.className).toContain("hidden");
    expect(slab?.className).toContain("md:block");
    expect(rule?.className).toContain("md:hidden");
  });

  it("offsets the image from the slab only once there is room for it", () => {
    const { container } = render(<Positioning />);
    const image = container.querySelector("img");

    expect(image?.className).toContain("md:translate-x-10");
    expect(image?.className).toContain("md:translate-y-10");
  });
});

describe("FeaturedProjects", () => {
  const featured = getFeaturedProjects().map(toCardData);

  it("renders the featured projects and nothing else", () => {
    render(<FeaturedProjects projects={featured} />);

    expect(featured.length).toBeGreaterThan(0);
    expect(screen.getAllByRole("listitem")).toHaveLength(featured.length);
    expect(screen.getByRole("link", { name: /view all projects/i })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("holds each card at 82vw on a phone so the next one peeks", () => {
    render(<FeaturedProjects projects={featured} />);
    for (const item of screen.getAllByRole("listitem")) {
      expect(item.className).toContain("w-[82vw]");
      expect(item.className).toContain("md:w-auto");
    }
  });

  it("keeps one card per project at every width, not a duplicate set", () => {
    render(<FeaturedProjects projects={featured} />);

    // ProjectCard wraps the whole card in a single link, so the count is one
    // per project plus the "view all" link beneath the list. A second, mobile
    // copy of the carousel would double the first half of that.
    expect(screen.getAllByRole("link")).toHaveLength(featured.length + 1);
  });

  it("renders nothing when no project is featured", () => {
    const { container } = render(<FeaturedProjects projects={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("StatsBand", () => {
  it("renders four figures at their final values without a browser to animate", () => {
    render(<StatsBand />);

    expect(screen.getByText("1,240")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("26")).toBeInTheDocument();
  });

  it("darkens the unit and label, which fail contrast on stone", () => {
    render(<StatsBand />);

    expect(screen.getByText("yrs")).toHaveClass("text-navy");
    expect(screen.getByText("Units delivered")).toHaveClass("text-ink");
  });

  it("rules between figures rather than around them, and only from 768px", () => {
    const { container } = render(<StatsBand />);
    const cells = [...(container.querySelectorAll(".grid > div") ?? [])];

    expect(cells).toHaveLength(4);
    expect(cells[0]?.className).not.toContain("border-l");
    for (const cell of cells.slice(1)) expect(cell.className).toContain("md:border-l");
  });
});

describe("ProcessPreview", () => {
  it("numbers three steps as an ordered sequence", () => {
    const { container } = render(<ProcessPreview />);

    expect(container.querySelector("ol")).not.toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    for (const numeral of ["01", "02", "03"]) {
      expect(screen.getByText(numeral)).toBeInTheDocument();
    }
  });

  it("keeps the numerals stone and hidden from assistive tech", () => {
    render(<ProcessPreview />);
    const numeral = screen.getByText("01");

    expect(numeral).toHaveClass("text-slate");
    expect(numeral).toHaveAttribute("aria-hidden", "true");
  });

  it("links on to the full process", () => {
    render(<ProcessPreview />);
    expect(screen.getByRole("link", { name: /how we build/i })).toHaveAttribute("href", "/process");
  });
});

describe("CtaBand", () => {
  it("closes a page with one button to the single conversion", () => {
    const { container } = render(
      <CtaBand lede="Tell us" rest="what you are looking for" body="[REPLACE] Body copy." />,
    );
    const band = container.firstElementChild;

    expect(band).toHaveClass("bg-navy");
    expect(within(band as HTMLElement).getByRole("link", { name: /contact us/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("takes its copy from props, so three pages do not share one sentence", () => {
    render(<CtaBand lede="Bring us" rest="a site" ctaLabel="Talk to us" ctaHref="/contact" />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Bring us a site");
    expect(screen.getByRole("link", { name: /talk to us/i })).toBeInTheDocument();
  });

  it("renders no body paragraph when none is given", () => {
    const { container } = render(<CtaBand lede="Work" rest="with us" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
