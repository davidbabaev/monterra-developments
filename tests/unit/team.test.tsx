import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamGrid } from "@/components/team/TeamGrid";
import { teamSchema } from "@/lib/schema";
import { getTeam, type TeamMember } from "@/lib/team";

/**
 * The team is the second content type on disk, so it has to fail the build the
 * same way the projects do — named file, named field, never a half-valid member.
 */

const member = (overrides: Partial<TeamMember> = {}): TeamMember => ({
  name: "Elena Marsh",
  role: "Founder",
  bio: "Started the company.",
  photo: { src: "/team/portrait-01-placeholder.png", alt: "Portrait", width: 800, height: 1000 },
  ...overrides,
});

describe("teamSchema", () => {
  it("accepts the seeded file on disk", () => {
    expect(() => getTeam()).not.toThrow();
    expect(getTeam().length).toBeGreaterThanOrEqual(4);
  });

  it("treats linkedin as optional", () => {
    const result = teamSchema.safeParse([
      { name: "A", role: "B", bio: "C", photo: { src: "/x.png", alt: "D" } },
    ]);
    expect(result.success).toBe(true);
  });

  it("rejects a member with an empty required field, naming that field", () => {
    const result = teamSchema.safeParse([
      { name: "", role: "B", bio: "C", photo: { src: "/x.png", alt: "D" } },
    ]);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([0, "name"]);
  });

  it("rejects a portrait with no alt text", () => {
    const result = teamSchema.safeParse([
      { name: "A", role: "B", bio: "C", photo: { src: "/x.png", alt: "" } },
    ]);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([0, "photo", "alt"]);
  });

  it("rejects a linkedin value that is not a URL", () => {
    const result = teamSchema.safeParse([
      { name: "A", role: "B", bio: "C", photo: { src: "/x.png", alt: "D" }, linkedin: "in/elena" },
    ]);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([0, "linkedin"]);
  });

  it("rejects an empty team, which would render an empty grid", () => {
    expect(teamSchema.safeParse([]).success).toBe(false);
  });
});

describe("getTeam", () => {
  it("measures each portrait so next/image reserves the right box", () => {
    for (const person of getTeam()) {
      expect(person.photo.width).toBe(800);
      expect(person.photo.height).toBe(1000);
    }
  });

  /**
   * Both card paths, not an exact count. What matters is that production renders
   * a card with the icon and a card without it — pinning the split to one made
   * the test fail when the seed moved to two and two, which told us nothing.
   */
  it("seeds members both with and without linkedin, so both card paths render", () => {
    const team = getTeam();
    const withLinkedin = team.filter((person) => person.linkedin !== undefined);
    const withoutLinkedin = team.filter((person) => person.linkedin === undefined);

    expect(withLinkedin.length).toBeGreaterThan(0);
    expect(withoutLinkedin.length).toBeGreaterThan(0);
  });
});

describe("TeamGrid", () => {
  it("renders a portrait, name, role and bio for each member", () => {
    render(<TeamGrid members={[member(), member({ name: "Daniel Okonjo" })]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(screen.getAllByAltText("Portrait")).toHaveLength(2);
  });

  it("shows a LinkedIn link only for the member who has one", () => {
    render(
      <TeamGrid
        members={[
          member({ name: "With", linkedin: "https://www.linkedin.com/in/example" }),
          member({ name: "Without" }),
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName(/With on LinkedIn/);
    expect(links[0]).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders no link element at all when linkedin is absent, so there is no gap", () => {
    const { container } = render(<TeamGrid members={[member({ name: "Without" })]} />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("sets the role in slate, since bronze is forbidden at 13px", () => {
    render(<TeamGrid members={[member()]} />);
    expect(screen.getByText("Founder")).toHaveClass("text-slate");
  });

  it("only greys a portrait where hovering is possible", () => {
    const { container } = render(<TeamGrid members={[member()]} />);
    const image = container.querySelector("img");

    // The resting greyscale is inside @media (hover: hover); on a touch screen
    // the portrait is in colour from the start.
    expect(image?.className).toContain("can-hover:grayscale");
    expect(image?.className).toContain("can-hover:hover:grayscale-0");
    expect(image?.className).not.toMatch(/(^|\s)grayscale(\s|$)/);
  });
});
