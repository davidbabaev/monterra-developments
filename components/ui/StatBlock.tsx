import { cx } from "@/lib/cx";

/**
 * Big figure, superscript unit, small label beneath.
 *
 * The unit is 60% of the figure — 24px at the mobile size, which is exactly
 * WCAG large text, so bronze at 3.55:1 is compliant. On a stone slab bronze
 * drops to 2.01:1 and slate to 2.62:1, so both the unit and the label switch to
 * navy and ink there. The surface prop is what enforces that.
 */

type StatSurface = "ivory" | "stone";

type StatBlockProps = {
  readonly figure: string;
  readonly unit?: string;
  readonly label: string;
  readonly surface?: StatSurface;
  readonly className?: string;
};

export function StatBlock({
  figure,
  unit,
  label,
  surface = "ivory",
  className,
}: StatBlockProps) {
  const onStone = surface === "stone";

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <p className="font-display text-[40px] font-bold leading-none text-navy xl:text-[52px]">
        {figure}
        {unit !== undefined && (
          <span
            className={cx(
              "ml-0.5 align-top text-[0.6em] leading-none",
              onStone ? "text-navy" : "text-bronze",
            )}
          >
            {unit}
          </span>
        )}
      </p>
      <p
        className={cx(
          "font-body text-[13px] font-medium uppercase tracking-[0.04em]",
          onStone ? "text-ink" : "text-slate",
        )}
      >
        {label}
      </p>
    </div>
  );
}
