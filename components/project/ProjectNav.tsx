import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cx } from "@/lib/cx";
import type { ProjectCardData } from "./projectCardData";

/**
 * Two-up navigation to the neighbouring projects by `order`, wrapping at both
 * ends — from the last project, "next" is the first one.
 *
 * Only the fields a thumbnail link needs, reusing the card's shape rather than
 * declaring a second one.
 */

export type ProjectNavItem = Pick<ProjectCardData, "slug" | "title" | "hero">;

type ProjectNavProps = {
  /** The page's own slug: with a single project the wrap points back at itself. */
  readonly currentSlug: string;
  readonly prev: ProjectNavItem | null;
  readonly next: ProjectNavItem | null;
};

type Direction = "prev" | "next";

const DIRECTION_LABEL: Record<Direction, string> = {
  prev: "Previous project",
  next: "Next project",
};

const ARROW: Record<Direction, string> = {
  prev: "←",
  next: "→",
};

function NavLink({ item, direction }: { item: ProjectNavItem; direction: Direction }) {
  return (
    <Link
      href={`/projects/${item.slug}`}
      className="block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
    >
      <Card className="flex h-full items-center gap-4 p-4">
        <Image
          src={item.hero.src}
          alt={item.hero.alt}
          width={item.hero.width}
          height={item.hero.height}
          sizes="(min-width: 768px) 96px, 96px"
          className="aspect-[3/2] w-24 shrink-0 object-cover"
        />
        <div className={cx("min-w-0", direction === "next" && "md:text-right")}>
          <Eyebrow>
            {direction === "prev" && (
              <span aria-hidden="true" className="text-bronze">
                {`${ARROW.prev} `}
              </span>
            )}
            {DIRECTION_LABEL[direction]}
            {direction === "next" && (
              <span aria-hidden="true" className="text-bronze">
                {` ${ARROW.next}`}
              </span>
            )}
          </Eyebrow>
          <p className="mt-1 font-display text-[19px] font-semibold text-navy xl:text-[22px]">
            {item.title}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function ProjectNav({ currentSlug, prev, next }: ProjectNavProps) {
  const previous = prev !== null && prev.slug !== currentSlug ? prev : null;
  const following = next !== null && next.slug !== currentSlug ? next : null;

  if (previous === null && following === null) return null;

  return (
    <nav aria-label="More projects" className="grid gap-4 md:grid-cols-2">
      {previous !== null && <NavLink item={previous} direction="prev" />}
      {/* Keeps "next" in the right-hand column when there is no "previous". */}
      {previous === null && <div aria-hidden="true" className="hidden md:block" />}
      {following !== null && <NavLink item={following} direction="next" />}
    </nav>
  );
}
