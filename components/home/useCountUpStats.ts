"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Counts a set of figures up from zero, once, the first time their band scrolls
 * into view. Returns the numbers to render right now.
 *
 * Three cases never animate, and all three render the final values instead:
 * reduced motion, no JavaScript (the server renders the finished numbers), and a
 * band that is already on screen when the page loads — there was no scroll into
 * view to react to, and starting at zero under the reader's eye would look like
 * a bug rather than a flourish.
 *
 * The zeroing happens in the observer's first callback, while the band is still
 * off screen, so the reader never sees the finished numbers replaced by zeros.
 */

const DURATION_MS = 1200;
/** Enough of the band on screen that the count is watched, not missed. */
const THRESHOLD = 0.4;

/** Fast out, slow in: the last digits settle rather than snapping. */
const easeOut = (progress: number) => 1 - (1 - progress) ** 3;

export function useCountUpStats(
  targets: readonly number[],
  ref: RefObject<Element | null>,
): readonly number[] {
  const [values, setValues] = useState(targets);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let startedAt = 0;
    let armed = false;

    const step = (now: number) => {
      if (startedAt === 0) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / DURATION_MS);
      const eased = easeOut(progress);

      setValues(targets.map((target) => Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (!isVisible) {
          // Off screen: safe to reset, and this is the only place it happens.
          armed = true;
          setValues(targets.map(() => 0));
          return;
        }

        // Visible on the very first callback means the band was already in view
        // at load. Leave the final values alone and stop watching.
        observer.disconnect();
        if (armed) frame = requestAnimationFrame(step);
      },
      { threshold: THRESHOLD },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [targets, ref]);

  return values;
}
