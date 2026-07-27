"use client";

import { useEffect } from "react";

/**
 * Locks body scroll while `active`, and restores whatever the page had before.
 *
 * `overflow: hidden` rather than `position: fixed`: fixing the body detaches it
 * from the scroll position and the page jumps to the top when the lock lifts.
 * Hiding the overflow leaves `scrollY` untouched, so the reader comes back to
 * the exact row of thumbnails they opened.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [active]);
}
