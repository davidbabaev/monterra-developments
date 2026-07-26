import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * Three variants, one hit target rule (44x44 minimum) and one focus treatment
 * (a bronze ring, which at 3.87:1 on ivory clears the 3:1 non-text requirement).
 *
 * Renders an anchor when `href` is present, otherwise a button.
 */

type ButtonVariant = "primary" | "secondary" | "text";

type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly href?: string;
  readonly type?: "button" | "submit";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly children: React.ReactNode;
};

const BASE =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm font-display text-[15px] font-semibold " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze " +
  "motion-safe:transition-colors motion-safe:duration-150 disabled:pointer-events-none disabled:opacity-50";

/**
 * The `text` variant does not turn bronze on hover. Bronze on ivory is 3.55:1,
 * which fails the 4.5:1 required of a small link. The hover cue is a bronze
 * underline instead — bronze is permitted as a rule, and the label stays navy.
 */
const VARIANT: Record<ButtonVariant, string> = {
  primary: "min-w-11 bg-navy px-6 text-ivory hover:bg-navy",
  secondary: "min-w-11 border border-navy px-6 text-navy hover:bg-navy hover:text-ivory",
  text: "px-1 text-navy border-b border-transparent hover:border-bronze",
};

export function Button({
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  className,
  children,
}: ButtonProps) {
  const content = (
    <>
      {children}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="text-[12px] text-bronze motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  const classes = cx(BASE, VARIANT[variant], className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
