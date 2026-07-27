import { cx } from "@/lib/cx";

/**
 * A busy indicator, never the only sign that something is happening — the label
 * beside it always says so in words.
 *
 * The spin is gated behind motion-safe, so with reduced motion it renders as a
 * static ring and the words carry the state on their own.
 */

type SpinnerProps = {
  readonly className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-block h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent",
        "motion-safe:animate-spin",
        className,
      )}
    />
  );
}
