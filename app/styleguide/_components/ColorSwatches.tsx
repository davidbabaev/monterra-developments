import { BRAND_COLORS, DERIVED_COLORS } from "@/lib/design-tokens";

/**
 * The seven brand colours, plus anything derived from them. Hexes come from
 * lib/design-tokens.ts, which a unit test keeps in step with globals.css.
 */

function Swatch({ hex, name, variable, role }: (typeof BRAND_COLORS)[number]) {
  return (
    <div className="rounded-md border border-stone bg-surface">
      <div className="h-24 rounded-t-md" style={{ backgroundColor: hex }} />
      <div className="p-4">
        <p className="font-display text-[19px] font-semibold text-navy">{name}</p>
        <p className="mt-1 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
          {hex}
        </p>
        <p className="mt-2 font-body text-[14px] text-ink">{role}</p>
        <p className="mt-2 font-body text-[13px] text-slate">{variable}</p>
      </div>
    </div>
  );
}

export function ColorSwatches() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {BRAND_COLORS.map((color) => (
          <Swatch key={color.name} {...color} />
        ))}
      </div>
      <div>
        <p className="font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
          Derived — not part of the brand palette
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {DERIVED_COLORS.map((color) => (
            <Swatch key={color.name} {...color} />
          ))}
        </div>
      </div>
    </div>
  );
}
