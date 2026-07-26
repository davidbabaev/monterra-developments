"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { siteConfig } from "@/lib/site";
import { useFocusTrap } from "./useFocusTrap";

/**
 * A full-screen navy overlay, deliberately not a slide-in drawer.
 *
 * While it is open: body scroll is locked, the rest of the document is `inert`
 * so neither pointer nor keyboard can reach it, focus is trapped, and Escape
 * closes. On close, focus returns to the trigger that opened it.
 */

type MobileNavProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  /** The hamburger, so focus can be handed back to it. */
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const SITE_CONTENT_ID = "site-content";
/** Each link fades in 40ms after the one above it. */
const STAGGER_MS = 40;

export function MobileNav({ isOpen, onClose, triggerRef }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useFocusTrap(overlayRef, isOpen, triggerRef);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const siteContent = document.getElementById(SITE_CONTENT_ID);
    siteContent?.setAttribute("inert", "");

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      siteContent?.removeAttribute("inert");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="fixed inset-0 z-50 flex flex-col bg-navy lg:hidden"
    >
      <div className="flex items-center justify-end px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-11 w-11 items-center justify-center text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          <Icon icon={X} size={28} />
        </button>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col justify-center px-5">
        <ul className="flex flex-col gap-2">
          {siteConfig.nav.map((item, index) => (
            <li
              key={item.href}
              className="motion-safe:animate-[nav-item-in_240ms_ease-out_both]"
              style={{ animationDelay: `${index * STAGGER_MS}ms` }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cx(
                  "inline-flex min-h-11 items-center font-display text-[28px] font-medium text-ivory",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 pb-8">
        <Link
          href={siteConfig.cta.href}
          onClick={onClose}
          className={cx(
            "flex min-h-11 w-full items-center justify-center rounded-sm bg-bronze-deep px-6",
            "font-display text-[16px] font-semibold text-surface",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
          )}
        >
          {siteConfig.cta.label}
        </Link>
      </div>
    </div>
  );
}
