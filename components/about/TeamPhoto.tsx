import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

/**
 * The one group photograph on the site, sitting between the quote and the
 * statistics band on /about.
 *
 * It runs the full container measure rather than the half-column the offset
 * composition gives CompanyStory — four people at 45vw are four faces nobody can
 * read. It is not full-bleed: design-reference lists what breaks the container,
 * and a content photograph is not on that list.
 *
 * The intrinsic dimensions are the file's own 16:9, so no aspect ratio is
 * imposed here and nothing is cropped a second time in the browser.
 *
 * No `priority`. It sits below the hero, the story and the values grid on every
 * viewport, so it is never the LCP and loading it eagerly would only compete
 * with what is.
 */

/**
 * Written against the photograph. The sign behind the group carries a tagline
 * that is not legible at any size the image renders at, so the alt does not
 * quote it — describing it as unreadable would be more use to nobody than
 * leaving it out.
 */
const ALT =
  "Four people in navy and cream business dress standing in front of a slatted " +
  "wood wall with a lit Monterra Developments sign, a marble counter and " +
  "architectural scale models beside them and a city skyline through the windows " +
  "behind";

/** Approved copy. */
const CAPTION = "The team at the Austin office, where every project starts.";

export function TeamPhoto() {
  return (
    <Section>
      <Container>
        <figure>
          <Image
            src="/about/team-photo.webp"
            alt={ALT}
            width={1664}
            height={936}
            sizes="(min-width: 1280px) 1072px, 100vw"
            className="w-full object-cover"
          />
          <figcaption className="mt-4 font-body text-[15px] leading-[1.6] text-slate">
            {CAPTION}
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
