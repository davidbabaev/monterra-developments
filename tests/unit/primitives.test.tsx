import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";
import { SectionNumeral } from "@/components/ui/SectionNumeral";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { StatBlock } from "@/components/ui/StatBlock";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PROJECT_STATUSES } from "@/lib/schema";

describe("SplitHeading", () => {
  it("renders the requested heading level with both halves readable as one heading", () => {
    render(<SplitHeading as="h1" lede="Building" rest="communities" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Building communities");
  });

  it("defaults to h2", () => {
    render(<SplitHeading lede="Selected" rest="work" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("puts the lede in the editorial face and bronze, the rest in navy", () => {
    render(<SplitHeading lede="Selected" rest="work" />);
    const lede = screen.getByText("Selected");
    expect(lede).toHaveClass("font-editorial", "text-bronze", "font-light");
    expect(screen.getByRole("heading")).toHaveClass("font-display", "text-navy");
  });

  it("sets the lede 1.18em, the measured ratio that aligns the cap heights", () => {
    render(<SplitHeading lede="Selected" rest="work" />);
    expect(screen.getByText("Selected")).toHaveClass("text-[1.18em]");
  });

  it("keeps the lede bronze but turns the rest ivory on a dark scrim", () => {
    render(<SplitHeading lede="Selected" rest="work" variant="dark" />);
    expect(screen.getByText("Selected")).toHaveClass("text-bronze");
    expect(screen.getByRole("heading")).toHaveClass("text-ivory");
  });

  it("never renders below its 26px floor", () => {
    render(<SplitHeading lede="Selected" rest="work" />);
    // h2 mobile is the smallest size the component can produce.
    expect(screen.getByRole("heading")).toHaveClass("text-[26px]");
  });
});

describe("Button", () => {
  it("meets the 44px minimum hit target on every variant", () => {
    for (const variant of ["primary", "secondary", "text"] as const) {
      const { unmount } = render(<Button variant={variant}>Label</Button>);
      expect(screen.getByRole("button")).toHaveClass("min-h-11");
      unmount();
    }
  });

  it("carries a bronze focus ring on every variant", () => {
    for (const variant of ["primary", "secondary", "text"] as const) {
      const { unmount } = render(<Button variant={variant}>Label</Button>);
      expect(screen.getByRole("button")).toHaveClass(
        "focus-visible:outline-bronze",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
      );
      unmount();
    }
  });

  it("gives primary a decorative arrow that is hidden from assistive tech", () => {
    const { container } = render(<Button variant="primary">Go</Button>);
    const arrow = container.querySelector('[aria-hidden="true"]');
    expect(arrow).toHaveTextContent("→");
    expect(arrow).toHaveClass("text-bronze");
  });

  it("does not turn the text variant bronze on hover, since bronze fails at label size", () => {
    render(<Button variant="text">How we build</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-navy", "hover:border-bronze");
    expect(button.className).not.toContain("hover:text-bronze");
  });

  it("renders a link when given an href", () => {
    render(
      <Button variant="primary" href="/projects">
        View projects
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects");
  });
});

describe("StatusBadge", () => {
  it("renders a readable label for each status", () => {
    for (const status of PROJECT_STATUSES) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(new RegExp(status, "i"))).toBeInTheDocument();
      unmount();
    }
  });

  it("fills current with bronze-deep, not bronze, so white text clears 4.5:1", () => {
    render(<StatusBadge status="current" />);
    const badge = screen.getByText("Current");
    expect(badge).toHaveClass("bg-bronze-deep", "text-surface");
    expect(badge.className).not.toContain("bg-bronze ");
  });

  it("uses navy on stone for upcoming", () => {
    render(<StatusBadge status="upcoming" />);
    expect(screen.getByText("Upcoming")).toHaveClass("bg-stone", "text-navy");
  });
});

describe("StatBlock", () => {
  it("uses bronze for the unit and slate for the label on ivory", () => {
    render(<StatBlock figure="79" unit="m²" label="Average size" />);
    expect(screen.getByText("m²")).toHaveClass("text-bronze");
    expect(screen.getByText("Average size")).toHaveClass("text-slate");
  });

  it("darkens both on stone, where bronze and slate fail contrast", () => {
    render(<StatBlock figure="79" unit="m²" label="Average size" surface="stone" />);
    expect(screen.getByText("m²")).toHaveClass("text-navy");
    expect(screen.getByText("Average size")).toHaveClass("text-ink");
  });
});

describe("SectionNumeral", () => {
  it("is hidden from assistive technology, being decorative at 1.76:1", () => {
    const { container } = render(<SectionNumeral value="01" />);
    const numeral = container.firstElementChild;
    expect(numeral).toHaveAttribute("aria-hidden", "true");
    expect(numeral).toHaveClass("text-stone");
  });
});

describe("StatBlock unit floor", () => {
  it("floors the unit at 26px so bronze never renders as small text", () => {
    render(<StatBlock figure="79" unit="m²" label="Average size" />);
    // 60% of the 40px mobile figure is 24px, under this project's bronze
    // minimum. max() lifts only that case and holds for any figure size.
    expect(screen.getByText("m²")).toHaveClass("text-[max(26px,0.6em)]");
  });
});
