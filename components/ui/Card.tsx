import { cx } from "@/lib/cx";

/**
 * White surface on ivory, 1px stone border, no shadow at rest. On hover the
 * border goes bronze, the card lifts 2px and any CardMedia inside scales.
 *
 * Establishes the `group` that CardMedia hooks into. All movement is gated
 * behind motion-safe.
 */

type CardProps = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cx(
        "group rounded-md border border-stone bg-surface",
        "motion-safe:transition motion-safe:duration-[250ms]",
        "hover:border-bronze hover:shadow-card-hover motion-safe:hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
