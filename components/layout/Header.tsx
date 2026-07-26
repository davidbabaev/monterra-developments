"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/ui/Wordmark";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";
import { useScrolledPast } from "./useScrolledPast";
import { cx } from "@/lib/cx";
import { siteConfig } from "@/lib/site";

/**
 * Sticky rather than fixed, so it occupies layout space and the nav label
 * always sits on ivory. A fixed header over the PageHero scrim would put navy
 * type on a dark photograph.
 */

const SCROLL_THRESHOLD = 40;

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(SCROLL_THRESHOLD);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  /**
   * The menu remembers the route it was opened on, so any route change closes
   * it by derivation — including a back-button navigation that no click
   * handler would catch. Storing a boolean instead would need an effect that
   * resets it, which costs a cascading render.
   */
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const isMenuOpen = openedOnPath === pathname;

  return (
    <>
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className={cx(
          "sticky top-0 z-40 w-full motion-safe:transition-all motion-safe:duration-200",
          scrolled
            ? "border-b border-stone bg-ivory/92 backdrop-blur-sm"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6 xl:h-20">
          <Link
            href="/"
            className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
          >
            <Wordmark variant="monogram" className="lg:hidden" />
            <Wordmark />
            <span className="sr-only">Home</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} isActive={isActiveRoute(pathname, item.href)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/*
            Wrapped rather than given `hidden` directly: Button sets its own
            `inline-flex`, and two unprefixed display utilities resolve by
            stylesheet order, not by the order written here. The wrapper has no
            competing display class, so the visibility is unambiguous.
          */}
          <div className="hidden lg:block">
            <Button variant="primary" href={siteConfig.cta.href}>
              {siteConfig.cta.label}
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpenedOnPath(pathname)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze lg:hidden"
          >
            <Icon icon={Menu} size={24} />
          </button>
        </Container>
      </header>

      <MobileNav
        isOpen={isMenuOpen}
        onClose={() => setOpenedOnPath(null)}
        triggerRef={hamburgerRef}
      />
    </>
  );
}
