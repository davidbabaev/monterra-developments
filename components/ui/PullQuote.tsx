import { StoneSlab } from "./StoneSlab";
import { cx } from "@/lib/cx";

/**
 * Stone slab, editorial quote in navy, attribution preceded by a 24px bronze
 * rule. One of only two places Cormorant appears outside a SplitHeading lede.
 */

type PullQuoteProps = {
  readonly quote: string;
  readonly attribution: string;
  readonly className?: string;
};

export function PullQuote({ quote, attribution, className }: PullQuoteProps) {
  return (
    <StoneSlab padding="md" className={cx(className)}>
      <blockquote>
        <p className="font-editorial text-[22px] font-light italic leading-[1.4] text-navy xl:text-[28px]">
          {quote}
        </p>
        <footer className="mt-6 flex items-center gap-3">
          <span aria-hidden="true" className="block h-px w-6 shrink-0 bg-bronze" />
          <span className="font-display text-[14px] font-semibold text-navy">{attribution}</span>
        </footer>
      </blockquote>
    </StoneSlab>
  );
}
