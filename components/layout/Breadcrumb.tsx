import Link from "next/link";

/**
 * The stone slab under an inner-page hero. A real ordered list inside a
 * labelled nav, so it is a breadcrumb to assistive technology and not just a
 * row of links.
 *
 * Navy on stone measures 7.95:1.
 */

export type Crumb = {
  readonly label: string;
  /** Omitted on the last crumb, which is the current page. */
  readonly href?: string;
};

type BreadcrumbProps = {
  readonly items: readonly Crumb[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-stone px-5 py-4 xl:h-16 xl:px-8">
      <ol className="flex h-full flex-wrap items-center gap-x-2 font-body text-[14px] text-navy">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-navy/60">
                  ·
                </span>
              )}
              {isLast || item.href === undefined ? (
                <span aria-current="page" className="font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="border-b border-transparent hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
