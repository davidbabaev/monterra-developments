"use client";

import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * A desktop nav item.
 *
 * The active cue is a 2px bronze underline plus `aria-current`; hover is a 1px
 * bronze underline. The label stays navy in every state — bronze text at nav
 * size measures 3.55:1 on ivory and fails the 4.5:1 required of a small link,
 * so bronze is used as a rule here, which is permitted, rather than as text.
 */

type NavLinkProps = {
  readonly href: string;
  readonly isActive: boolean;
  readonly children: React.ReactNode;
};

export function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cx(
        "relative inline-flex min-h-11 items-center px-1 font-display text-[15px] text-navy",
        "after:absolute after:inset-x-1 after:bottom-2 after:bg-bronze after:content-['']",
        "motion-safe:transition-[height] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
        isActive
          ? "font-semibold after:h-[2px]"
          : "font-medium after:h-0 hover:after:h-px",
      )}
    >
      {children}
    </Link>
  );
}
