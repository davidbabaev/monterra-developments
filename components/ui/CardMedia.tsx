import { cx } from "@/lib/cx";

/**
 * The image well of a Card. Clips its child so the 1.03 hover scale grows into
 * the frame rather than pushing the layout around.
 */

type CardMediaProps = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

export function CardMedia({ className, children }: CardMediaProps) {
  return (
    <div className={cx("overflow-hidden", className)}>
      <div className="motion-safe:transition-transform motion-safe:duration-[250ms] motion-safe:group-hover:scale-[1.03]">
        {children}
      </div>
    </div>
  );
}
