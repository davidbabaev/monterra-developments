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
 * Approved copy. The headline claims something about building rather than
 * selling, which is the line the whole page is arranged around — the unit tests
 * assert both halves of that.
 */
const HEADLINE = { lede: "We build", rest: "streets that still work in fifty years" };

/**
 * Written against the photograph that shipped 2026-08-02.
 *
 * The shopfronts carry three signs whose lettering is garbled — one of them
 * large and near the front of frame. They are not quoted here: naming a sign a
 * reader cannot read is worth less than the words spent on it, and the same
 * rule already applies to the sign in the About story image. Accepted rather
 * than cropped, on instruction.
 */
const ALT =
  "An elevated view at golden hour of a cluster of mid- and high-rise " +
  "residential buildings with glass balconies and planted roof terraces, " +
  "ground-floor shops and cafe tables along the street below, a landscaped " +
  "plaza with a water channel and ornamental grasses, and a downtown skyline " +
  "in the distance";

export function Hero() {
  return (
    <section className="relative flex h-[78vh] items-center xl:h-[88vh]">
      <Image
        src="/home/home-hero.webp"
        alt={ALT}
        width={2560}
        height={1429}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 62% is what carries ivory body copy over an unknown photograph. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy/62" />

      <Container className="relative">
        <SplitHeading as="h1" lede={HEADLINE.lede} rest={HEADLINE.rest} variant="dark" />

        <p className="mt-5 max-w-[52ch] font-body text-[18px] leading-[1.6] text-ivory/88 xl:text-[20px]">
          We develop townhomes, condominiums and duplexes in Austin, Tampa and Denver.
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
