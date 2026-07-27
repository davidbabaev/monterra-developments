"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/components/layout/useFocusTrap";
import { useScrollLock } from "@/components/layout/useScrollLock";
import { Icon } from "@/components/ui/Icon";
import type { ResolvedGalleryImage } from "@/lib/project-media";
import { useSwipe } from "./useSwipe";

/**
 * The gallery viewer. Portalled to <body> rather than rendered in place: while it
 * is open every other child of <body> is marked `inert`, and a lightbox nested
 * inside the page would be inside its own inert subtree.
 *
 * Reading `document.body` during render is safe here and only here: this
 * component mounts in response to a click, so it never renders on the server.
 *
 * Navigation wraps at both ends. The counter is absolute — "1 / 4", not a
 * progress bar — so position is never ambiguous, wrapping keeps every arrow key
 * live at every index, and it matches the prev/next project navigation, which
 * wraps by specification.
 *
 * No history entry is pushed: Escape and the close button close it. The URL stays
 * the shareable project page it already was, and there is no pushed state for
 * Back to strand the reader on.
 */

type LightboxProps = {
  readonly images: readonly ResolvedGalleryImage[];
  readonly index: number;
  readonly onIndexChange: (index: number) => void;
  readonly onClose: () => void;
  /** The thumbnail that opened it, which focus returns to on close. */
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const CONTROL =
  "inline-flex h-11 w-11 items-center justify-center rounded-sm border border-stone/40 text-ivory " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze " +
  "motion-safe:transition-colors motion-safe:duration-150 hover:border-stone";

export function Lightbox({ images, index, onIndexChange, onClose, triggerRef }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const total = images.length;
  const image = images[index];

  const go = (step: number) => onIndexChange((index + step + total) % total);

  /**
   * Declared before the focus trap so its cleanup runs first: focus cannot be
   * handed back to a thumbnail that is still inside an inert subtree.
   */
  useEffect(() => {
    const behind = [...document.body.children].filter((child) => child !== dialogRef.current);
    for (const element of behind) element.setAttribute("inert", "");

    return () => {
      for (const element of behind) element.removeAttribute("inert");
    };
  }, []);

  useScrollLock(true);
  useFocusTrap(dialogRef, true, triggerRef);

  useEffect(() => {
    const step = (by: number) => onIndexChange((index + by + total) % total);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, total, onClose, onIndexChange]);

  const swipe = useSwipe({ onLeft: () => go(1), onRight: () => go(-1) });

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex flex-col bg-navy/96 motion-safe:animate-[lightbox-in_180ms_ease-out]"
    >
      <p id={titleId} className="sr-only">
        {image.alt}
      </p>

      <div className="flex justify-end p-3">
        <button type="button" onClick={onClose} aria-label="Close gallery" className={CONTROL}>
          <Icon icon={X} size={24} />
        </button>
      </div>

      {/* min-h-0 lets the figure shrink so a tall image is contained rather than
          pushing the controls off the bottom of the viewport. */}
      <figure
        {...swipe}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4"
      >
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 85vw, 100vw"
          /* h-auto w-auto against the intrinsic attributes: the image is
             contained by the box and never scaled past its own pixels. */
          className="h-auto max-h-full w-auto max-w-full object-contain"
        />
        {image.caption !== undefined && (
          <figcaption className="max-w-[68ch] text-center font-body text-[15px] text-stone">
            {image.caption}
          </figcaption>
        )}
      </figure>

      <div className="flex items-center justify-center gap-4 p-4">
        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={CONTROL}>
          <Icon icon={ArrowLeft} size={24} />
        </button>

        {/* The live region is the counter itself, so moving is announced once. */}
        <p
          aria-live="polite"
          className="min-w-[72px] text-center font-body text-[14px] font-medium tracking-[0.04em] text-ivory"
        >
          {index + 1} / {total}
        </p>

        <button type="button" onClick={() => go(1)} aria-label="Next image" className={CONTROL}>
          <Icon icon={ArrowRight} size={24} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
