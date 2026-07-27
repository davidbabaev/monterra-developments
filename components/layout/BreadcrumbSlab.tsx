import { Breadcrumb, type Crumb } from "./Breadcrumb";

/**
 * The offset stone slab that hangs off the bottom edge of an inner-page hero.
 * Owned here rather than inside a hero because two heroes now use it: PageHero
 * for the placeholder routes and ProjectHero for a real project.
 *
 * Not a <Container>: the slab is full-bleed on mobile, and passing `px-0` to
 * override the container's own `px-5` is a same-specificity collision resolved
 * by stylesheet order rather than by the order it was written in.
 *
 * Below 1280px the overlap is dropped and the slab goes full width — an offset
 * composition does not survive a narrow column, and half a slab hanging off a
 * 390px hero reads as broken rather than deliberate.
 */

type BreadcrumbSlabProps = {
  readonly items: readonly Crumb[];
};

/** ~64px slab, overlapping the hero above it by half. */
const OVERLAP = "xl:-mt-8";

export function BreadcrumbSlab({ items }: BreadcrumbSlabProps) {
  return (
    <div className={`relative z-10 ${OVERLAP}`}>
      <div className="mx-auto w-full max-w-[1200px] xl:px-16">
        <div className="xl:max-w-[480px]">
          <Breadcrumb items={items} />
        </div>
      </div>
    </div>
  );
}
