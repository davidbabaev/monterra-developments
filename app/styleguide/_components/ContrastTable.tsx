import {
  CONTRAST_THRESHOLDS,
  contrastRatio,
  formatRatio,
  meetsRequirement,
  type ContrastUsage,
} from "@/lib/contrast";
import { CONTRAST_PAIRS, CONTRAST_PAIR_NAMES } from "@/lib/design-tokens";

/**
 * Every foreground/background pair the system renders, with its real measured
 * ratio and a verdict against the requirement for that usage.
 *
 * tests/unit/contrast.test.ts asserts the same list, so a regression fails the
 * test suite rather than only looking wrong here.
 */

const USAGE_LABEL: Record<ContrastUsage, string> = {
  text: `Body text — needs ${CONTRAST_THRESHOLDS.text}:1`,
  largeText: `Large text 24px+ — needs ${CONTRAST_THRESHOLDS.largeText}:1`,
  nonText: `Rule / border / icon — needs ${CONTRAST_THRESHOLDS.nonText}:1`,
  decorative: "Decorative, aria-hidden — exempt",
};

export function ContrastTable() {
  const rows = CONTRAST_PAIRS.map((pair, index) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    return {
      ...pair,
      ...CONTRAST_PAIR_NAMES[index],
      ratio,
      passes: meetsRequirement(ratio, pair.usage),
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-stone">
            {["Sample", "Pair", "Where it appears", "Requirement", "Measured", "Verdict"].map(
              (heading) => (
                <th
                  key={heading}
                  className="py-3 pr-4 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.fg}-${row.bg}-${row.usage}`} className="border-b border-stone/60">
              <td className="py-3 pr-4">
                {/*
                  A colour specimen, not UI text: it deliberately renders pairs
                  at sizes the rules forbid, which is the point of an audit
                  table. tests/e2e/contrast-rules.spec.ts skips this attribute.
                */}
                <span
                  data-contrast-sample="true"
                  className="inline-flex items-center rounded-sm px-3 py-2 font-display text-[15px] font-semibold"
                  style={{ backgroundColor: row.background, color: row.foreground }}
                >
                  Aa
                </span>
              </td>
              <td className="py-3 pr-4 font-body text-[14px] text-ink">
                {row.fg} on {row.bg}
              </td>
              <td className="py-3 pr-4 font-body text-[14px] text-ink">{row.where}</td>
              <td className="py-3 pr-4 font-body text-[13px] text-slate">
                {USAGE_LABEL[row.usage]}
              </td>
              <td className="py-3 pr-4 font-display text-[15px] font-semibold text-navy tabular-nums">
                {formatRatio(row.ratio)}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={
                    row.passes
                      ? "inline-flex rounded-sm bg-navy px-2 py-1 font-body text-[12px] font-medium uppercase tracking-[0.04em] text-surface"
                      : "inline-flex rounded-sm bg-bronze-deep px-2 py-1 font-body text-[12px] font-medium uppercase tracking-[0.04em] text-surface"
                  }
                >
                  {row.passes ? "Pass" : "Fail"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
