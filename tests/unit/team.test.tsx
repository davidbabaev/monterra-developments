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
  photo: { src: "/team/elena-marsh.webp", alt: "Portrait", width: 941, height: 1672 },
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
  /**
   * The portraits are real photography now and they are not all one size, so
   * this pins the property that matters — every portrait is measured off disk
   * and is taller than it is wide — rather than one pair of numbers that only
   * held while every file was the same generated placeholder.
   */
  it("measures each portrait so next/image reserves the right box", () => {
    for (const person of getTeam()) {
      expect(person.photo.width).toBeGreaterThan(0);
      expect(person.photo.height).toBeGreaterThan(person.photo.width);
    }
  });

  /**
   * The cards are 4:5 and the portraits are taller than that, so the crop is
   * pinned to the top of the frame. Centred it would take as much off the head
   * as off the feet — see the note in TeamGrid.
   */
  it("crops the portrait from the top rather than the centre", () => {
    render(<TeamGrid members={[member()]} />);
    expect(screen.getByAltText("Portrait").className).toContain("object-top");
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
