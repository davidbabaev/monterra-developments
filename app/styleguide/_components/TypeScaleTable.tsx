import { SplitHeading } from "@/components/ui/SplitHeading";
import { TYPE_SCALE } from "@/lib/design-tokens";

/** The full scale, rendered at its real sizes rather than described. */

export function TypeScaleTable() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="mb-3 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
          SplitHeading — h2. The page title above is the h1 specimen; a page only ever has one.
        </p>
        <SplitHeading as="h2" lede="Selected" rest="work" />
      </div>

      {TYPE_SCALE.map((entry) => (
        <div key={entry.role}>
          <p className="mb-3 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
            {entry.role} — {entry.font} {entry.weight}, {entry.size}, {entry.color}
          </p>
          <p className={entry.className}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  );
}
