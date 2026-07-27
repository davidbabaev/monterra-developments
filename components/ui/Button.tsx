import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * Three variants, one hit target rule (44x44 minimum) and one focus treatment
 * (a bronze ring, which at 3.87:1 on ivory clears the 3:1 non-text requirement).
 *
 * Renders an anchor when `href` is present, otherwise a button.
 */

type ButtonVariant = "primary" | "secondary" | "text" | "onDark";

type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly href?: string;
  readonly type?: "button" | "submit";
  readonly disabled?: boolean;
  /**
   * Opens the link in a new tab. One prop rather than raw `target`/`rel` so the
   * `noopener` that has to accompany `_blank` cannot be forgotten at a call site.
   * Ignored without `href`.
   */
  readonly newTab?: boolean;
  /** Ignored when `href` is set — that renders a link, not a button. */
  readonly onClick?: () => void;
  readonly className?: string;
  readonly children: React.ReactNode;
};

const BASE =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm font-display text-[15px] font-semibold " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze " +
  "motion-safe:transition-colors motion-safe:duration-150 disabled:pointer-events-none disabled:opacity-50";

type VariantStyle = {
  readonly classes: string;
  /** Colour of the trailing arrow, or null for a variant that has none. */
  readonly arrow: "bronze" | "surface" | null;
};

/**
 * The `text` variant does not turn bronze on hover. Bronze on ivory is 3.55:1,
 * which fails the 4.5:1 required of a small link. The hover cue is a bronze
 * underline instead — bronze is permitted as a rule, and the label stays navy.
 *
 * `onDark` is the primary button's counterpart on a navy band, where a navy
 * fill would be invisible. It takes bronze-deep, the only fill that carries
 * white text at 4.64:1, and its arrow goes white too — bronze on bronze-deep
 * is 1.2:1 and would disappear.
 */
const VARIANT: Record<ButtonVariant, VariantStyle> = {
  primary: { classes: "min-w-11 bg-navy px-6 text-ivory hover:bg-navy", arrow: "bronze" },
  secondary: {
    classes: "min-w-11 border border-navy px-6 text-navy hover:bg-navy hover:text-ivory",
    arrow: null,
  },
  text: { classes: "px-1 text-navy border-b border-transparent hover:border-bronze", arrow: null },
  onDark: { classes: "min-w-11 bg-bronze-deep px-6 text-surface", arrow: "surface" },
};

const ARROW_COLOR = {
  bronze: "text-bronze",
  surface: "text-surface",
} as const;

export function Button({
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  newTab = false,
  onClick,
  className,
  children,
}: ButtonProps) {
  const { classes: variantClasses, arrow } = VARIANT[variant];

  const content = (
    <>
      {children}
      {arrow !== null && (
        <span
          aria-hidden="true"
          className={cx(
            "text-[12px]",
            ARROW_COLOR[arrow],
            "motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1",
          )}
        >
          →
        </span>
      )}
    </>
  );

  const classes = cx(BASE, variantClasses, className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener" } : {})}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
