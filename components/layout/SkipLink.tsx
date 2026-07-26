/**
 * Hidden until focused, then the first thing a keyboard user reaches.
 * Jumps past the header straight to the page content.
 */

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-sm focus:bg-navy focus:px-4 focus:font-display focus:text-[15px] focus:font-semibold focus:text-ivory focus:outline-2 focus:outline-offset-2 focus:outline-bronze"
    >
      Skip to content
    </a>
  );
}
