"use client";

import { useRef } from "react";

/**
 * Horizontal swipe detection for touch, returning props to spread onto the
 * element that should listen.
 *
 * A gesture only counts when it travels far enough horizontally AND is clearly
 * more horizontal than vertical. Without that second test a reader trying to
 * scroll the page would skip images with every drag, which is the usual way
 * touch carousels go wrong.
 */

type SwipeHandlers = {
  readonly onLeft: () => void;
  readonly onRight: () => void;
};

/** Below this the gesture is a tap or a tremor, not a swipe. */
const MIN_DISTANCE_PX = 48;
/** Horizontal travel has to beat vertical travel by this much to count. */
const DOMINANCE = 1.5;

export function useSwipe({ onLeft, onRight }: SwipeHandlers) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (event: React.TouchEvent) => {
      const touch = event.touches[0];
      start.current = touch === undefined ? null : { x: touch.clientX, y: touch.clientY };
    },

    onTouchEnd: (event: React.TouchEvent) => {
      const origin = start.current;
      const touch = event.changedTouches[0];
      start.current = null;

      if (origin === undefined || origin === null || touch === undefined) return;

      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;

      if (Math.abs(dx) < MIN_DISTANCE_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * DOMINANCE) return;

      // Swiping left moves forward, the way a reader drags a photo aside.
      if (dx < 0) onLeft();
      else onRight();
    },
  };
}
