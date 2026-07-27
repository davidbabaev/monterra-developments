import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The one hero on the site that is photographic rather than a PageHero band.
 *
 * 78vh on a phone and 88vh on a desktop, deliberately short of the viewport, so
 * the section below peeks above the fold and the page reads as scrollable
 * without a scroll cue drawn on top of it. No slide counter, no vertical rail,
 * no side arrows: one image, one headline, two calls to action.
 *
 * The image is the LCP element, so it is `priority` — never lazy — and carries
 * its intrinsic dimensions, which reserves the box before it decodes.
 */

/**
 * [REPLACE] Copy is placeholder, and the headline claims something about
 * building rather than selling. The marker lives here rather than inside the
 * lockup: a visible "[REPLACE]" between the Cormorant lede and the Manrope
 * remainder would break the two-tone heading the whole site is built on. Every
 * other heading in the codebase follows the same rule, with the marker on the
 * prose beneath.
 */
const HEADLINE = { lede: "We build", rest: "streets that still work in fifty years" };

export function Hero() {
  return (
    <section className="relative flex h-[78vh] items-center xl:h-[88vh]">
      <Image
        src="/home/hero-placeholder.png"
        alt="[REPLACE] A Monterra street on a clear morning, houses either side of a shared green"
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 62% is what carries ivory body copy over an unknown photograph. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy/62" />

      <Container className="relative">
        <SplitHeading as="h1" lede={HEADLINE.lede} rest={HEADLINE.rest} variant="dark" />

        <p className="mt-5 max-w-[52ch] font-body text-[18px] leading-[1.6] text-ivory/88 xl:text-[20px]">
          [REPLACE] We develop, build and sell townhomes, condominiums and duplexes across Texas,
          Florida and Colorado.
        </p>

        {/*
          The primary CTA takes the `onDark` fill, not `primary`: a navy button
          on a navy-scrimmed photograph is a rectangle of the same colour as the
          scrim. The hierarchy is unchanged — filled leads, outlined follows.
        */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button variant="onDark" href="/projects">
            View our projects
          </Button>
          <Button variant="onDarkOutline" href="/contact">
            Start a conversation
          </Button>
        </div>
      </Container>
    </section>
  );
}
