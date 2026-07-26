import { cx } from "@/lib/cx";

/**
 * Big figure, superscript unit, small label beneath.
 *
 * The unit is 60% of the figure, with a hard 26px floor.
 *
 * 60% of the 40px mobile figure is 24px, which is under this project's 26px
 * minimum for bronze text. The floor lifts only that case — at the 52px desktop
 * figure, 60% is 31px and the proportion is untouched — and it holds for any
 * figure size a caller passes later, which a fixed size would not.
 *
 * On a stone slab bronze drops to 2.01:1 and slate to 2.62:1, so the unit and
 * label switch to navy and ink there. The surface prop enforces that.
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
              "ml-0.5 align-top text-[max(26px,0.6em)] leading-none",
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
