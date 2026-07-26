"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold`, false again only after it
 * comes back above `threshold - hysteresis`.
 *
 * The gap is what stops the header flickering: without it, a slow scroll that
 * hovers on the exact threshold pixel toggles the state on every frame. Reads
 * are batched into a rAF so a fast scroll does not run the handler per event.
 */
export function useScrolledPast(threshold: number, hysteresis = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((wasScrolled) =>
        wasScrolled ? y > threshold - hysteresis : y > threshold,
      );
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(measure);
    };

    // Covers a reload that restores an already-scrolled position.
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold, hysteresis]);

  return scrolled;
}
