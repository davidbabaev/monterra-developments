import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/project/Gallery";
import type { ResolvedGalleryImage } from "@/lib/project-media";
import { getProjectBySlug } from "@/lib/projects";

/**
 * The lightbox is where accessibility usually breaks, so most of these assert
 * behaviour a sighted mouse user never sees: what has focus, what is inert, what
 * a screen reader is told, and what the body does while the overlay is up.
 */

const image = (n: number, caption?: string): ResolvedGalleryImage => ({
  src: `/projects/x/gallery/0${n}.png`,
  alt: `Image ${n} description`,
  width: 1200,
  height: 800,
  ...(caption === undefined ? {} : { caption }),
});

const IMAGES = [image(1, "The first caption"), image(2), image(3), image(4)];

const counter = () => screen.getByText(/^\d+ \/ \d+$/);
const dialog = () => screen.getByRole("dialog");
const thumbnails = () => screen.getAllByRole("button", { name: /view larger/i });

/** Opens from the third thumbnail — not the first, which any bug would also pass. */
async function openThird() {
  const user = userEvent.setup();
  render(<Gallery images={IMAGES} />);
  const third = thumbnails()[2];
  await user.click(third);
  return { user, third };
}

describe("Gallery grid", () => {
  it("renders nothing at all when the project has no gallery", () => {
    const { container } = render(<Gallery />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty gallery, rather than a heading over a void", () => {
    const { container } = render(<Gallery images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one real button per image, named after the image", () => {
    render(<Gallery images={IMAGES} />);

    const buttons = thumbnails();
    expect(buttons).toHaveLength(4);
    for (const button of buttons) expect(button.tagName).toBe("BUTTON");
    expect(buttons[1]).toHaveAccessibleName("Image 2 description — view larger");
  });

  it("gives every thumbnail the intrinsic dimensions the loader resolved", () => {
    const { container } = render(<Gallery images={IMAGES} />);
    const first = container.querySelector("img");

    expect(first).toHaveAttribute("width", "1200");
    expect(first).toHaveAttribute("height", "800");
  });

  it("renders the real Larkin gallery from disk", () => {
    const larkin = getProjectBySlug("the-larkin");
    render(<Gallery images={larkin!.media.gallery} />);
    expect(thumbnails()).toHaveLength(4);
  });

  it("shows no dialog until a thumbnail is clicked", () => {
    render(<Gallery images={IMAGES} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Lightbox opening", () => {
  it("opens the image that was clicked, not the first one", async () => {
    await openThird();

    expect(counter()).toHaveTextContent("3 / 4");
    expect(within(dialog()).getByAltText("Image 3 description")).toBeInTheDocument();
  });

  it("is a modal dialog labelled by the current image's description", async () => {
    await openThird();
    const element = dialog();

    expect(element).toHaveAttribute("aria-modal", "true");
    expect(element).toHaveAccessibleName("Image 3 description");
  });

  it("announces the counter politely, so moving is not silent", async () => {
    await openThird();
    expect(counter()).toHaveAttribute("aria-live", "polite");
  });

  /**
   * Where focus lands on open, and Tab cycling, are covered in
   * tests/e2e/gallery.spec.ts instead: the focus trap filters candidates by
   * `offsetParent`, which jsdom leaves null because it does no layout, so a trap
   * that works in a browser looks empty here. What can be asserted is that the
   * controls the trap needs are present and reachable.
   */
  it("carries the three controls the trap cycles between", async () => {
    await openThird();

    for (const name of ["Close gallery", "Previous image", "Next image"]) {
      expect(within(dialog()).getByRole("button", { name })).toBeEnabled();
    }
  });
});

describe("Lightbox navigation", () => {
  it("moves with the arrow keys and tracks the counter", async () => {
    const { user } = await openThird();

    await user.keyboard("{ArrowRight}");
    expect(counter()).toHaveTextContent("4 / 4");

    await user.keyboard("{ArrowLeft}");
    expect(counter()).toHaveTextContent("3 / 4");
  });

  it("wraps forward past the last image", async () => {
    const { user } = await openThird();

    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(counter()).toHaveTextContent("1 / 4");
    expect(within(dialog()).getByAltText("Image 1 description")).toBeInTheDocument();
  });

  it("wraps backward before the first image", async () => {
    const user = userEvent.setup();
    render(<Gallery images={IMAGES} />);
    await user.click(thumbnails()[0]);

    await user.keyboard("{ArrowLeft}");
    expect(counter()).toHaveTextContent("4 / 4");
  });

  it("moves with the on-screen controls too", async () => {
    const { user } = await openThird();

    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(counter()).toHaveTextContent("4 / 4");

    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(counter()).toHaveTextContent("3 / 4");
  });

  it("shows a caption when the image has one and no empty element when it does not", async () => {
    const { user } = await openThird();

    // Image 3 has no caption.
    expect(dialog().querySelector("figcaption")).toBeNull();

    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(counter()).toHaveTextContent("1 / 4");
    expect(dialog().querySelector("figcaption")).toHaveTextContent("The first caption");
  });
});

describe("Lightbox closing", () => {
  it("closes on Escape and returns focus to the exact thumbnail that opened it", async () => {
    const { user, third } = await openThird();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(third);
  });

  it("closes on the close button and restores focus the same way", async () => {
    const { user, third } = await openThird();

    await user.click(screen.getByRole("button", { name: "Close gallery" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(third);
  });
});

describe("Lightbox isolation from the page behind", () => {
  it("locks body scroll while open and restores the previous value on close", async () => {
    document.body.style.overflow = "visible";
    const { user } = await openThird();

    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("visible");
  });

  it("marks everything behind it inert, and un-marks it on close", async () => {
    const { user, third } = await openThird();

    const behind = third.closest("[inert]");
    expect(behind).not.toBeNull();
    expect(dialog().closest("[inert]")).toBeNull();

    await user.keyboard("{Escape}");
    expect(document.querySelectorAll("[inert]")).toHaveLength(0);
  });

  it("renders outside the page's own subtree, so it is not inside its inert layer", async () => {
    const { third } = await openThird();
    expect(third.closest("div")?.contains(dialog())).toBe(false);
  });
});

describe("Lightbox touch gestures", () => {
  const swipe = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const figure = screen.getByRole("figure");
    fireEvent.touchStart(figure, { touches: [{ clientX: from.x, clientY: from.y }] });
    fireEvent.touchEnd(figure, { changedTouches: [{ clientX: to.x, clientY: to.y }] });
  };

  it("advances on a swipe left", async () => {
    await openThird();
    swipe({ x: 300, y: 400 }, { x: 100, y: 410 });
    expect(counter()).toHaveTextContent("4 / 4");
  });

  it("goes back on a swipe right", async () => {
    await openThird();
    swipe({ x: 100, y: 400 }, { x: 300, y: 390 });
    expect(counter()).toHaveTextContent("2 / 4");
  });

  it("ignores a vertical drag, so scrolling never skips an image", async () => {
    await openThird();
    swipe({ x: 200, y: 500 }, { x: 220, y: 120 });
    expect(counter()).toHaveTextContent("3 / 4");
  });

  it("ignores a tap that barely moves", async () => {
    await openThird();
    swipe({ x: 200, y: 400 }, { x: 210, y: 402 });
    expect(counter()).toHaveTextContent("3 / 4");
  });
});
