import { cx } from "@/lib/cx";

/** Small uppercase label that sits above a heading. */

type EyebrowProps = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <p
      className={cx(
        "font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-slate",
        className,
      )}
    >
      {children}
    </p>
  );
}
