import { SplitHeading } from "@/components/ui/SplitHeading";
import { BreadcrumbSlab } from "./BreadcrumbSlab";
import type { Crumb } from "./Breadcrumb";
import { Container } from "./Container";

/**
 * The inner-page hero: every route except Home and a project detail page opens
 * with this. A project has a real hero image, a status and a location line, so
 * it uses ProjectHero instead; both share the breadcrumb slab.
 *
 * A full-bleed band with a navy scrim at 62%, the two-tone lockup left-aligned
 * to the container, and a stone breadcrumb slab that overlaps the band's bottom
 * edge by half its height on desktop.
 */

type PageHeroProps = {
  readonly lede: string;
  readonly rest: string;
  readonly subhead?: string;
  readonly breadcrumb: readonly Crumb[];
};

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

      <BreadcrumbSlab items={breadcrumb} />
    </div>
  );
}
