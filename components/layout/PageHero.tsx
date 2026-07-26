import { SplitHeading } from "@/components/ui/SplitHeading";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Container } from "./Container";

/**
 * The inner-page hero: every route except Home opens with this.
 *
 * A full-bleed band with a navy scrim at 62%, the two-tone lockup left-aligned
 * to the container, and a stone breadcrumb slab that overlaps the band's bottom
 * edge by half its height on desktop.
 *
 * Below 1280px the overlap is dropped and the slab goes full width — an offset
 * composition does not survive a narrow column, and half a slab hanging off a
 * 390px hero reads as broken rather than deliberate.
 */

type PageHeroProps = {
  readonly lede: string;
  readonly rest: string;
  readonly subhead?: string;
  readonly breadcrumb: readonly Crumb[];
};

/** ~64px slab, overlapping by half. */
const SLAB_OVERLAP = "xl:-mt-8";

export function PageHero({ lede, rest, subhead, breadcrumb }: PageHeroProps) {
  return (
    <div>
      <div className="relative flex h-80 items-center xl:h-[380px]">
        {/* [REPLACE] solid placeholder standing in for architectural photography. */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/62" />

        <Container className="relative">
          <SplitHeading as="h1" lede={lede} rest={rest} variant="dark" />
          {subhead !== undefined && (
            <p className="mt-4 max-w-[52ch] font-body text-[16px] text-ivory/88 xl:text-[17px]">
              {subhead}
            </p>
          )}
        </Container>
      </div>

      {/*
        Not <Container>: the slab is full-bleed on mobile, and passing `px-0`
        to override the container's `px-5` is a same-specificity collision that
        resolves by stylesheet order rather than by the order written here.
      */}
      <div className={`relative z-10 ${SLAB_OVERLAP}`}>
        <div className="mx-auto w-full max-w-[1200px] xl:px-16">
          <div className="xl:max-w-[480px]">
            <Breadcrumb items={breadcrumb} />
          </div>
        </div>
      </div>
    </div>
  );
}
