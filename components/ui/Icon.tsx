import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * Every icon in the app goes through this wrapper, so stroke weight and default
 * size are changed in one file rather than at every call site.
 *
 * Icons are always paired with a text label, never used alone, so they are
 * aria-hidden by default and contribute nothing to the accessibility tree.
 *
 * Colour is inherited from the parent rather than defaulted here. A baked-in
 * `text-navy` collides with any colour a caller passes — same specificity, so
 * the stylesheet order decides, not the call site — which silently produced a
 * navy icon on a navy overlay.
 */

type IconProps = {
  readonly icon: LucideIcon;
  /** 24 in content, 32 in the contact band. */
  readonly size?: number;
  readonly className?: string;
};

export function Icon({ icon: Glyph, size = 24, className }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      className={cx("shrink-0", className)}
    />
  );
}
