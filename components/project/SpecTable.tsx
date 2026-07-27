import { Eyebrow } from "@/components/ui/Eyebrow";
import { StoneSlab } from "@/components/ui/StoneSlab";
import type { Project } from "@/lib/project-loader";
import { STATUS_LABEL } from "@/lib/project-status";
import type { ProjectStatus } from "@/lib/schema";

/**
 * The project's hard numbers, as a definition list on a stone slab.
 *
 * A row whose value is absent is not rendered — not blank, not "TBA". Monterra
 * Bay has no units, no square footage and no completion date, so its table is
 * two rows long and that is the intended result.
 *
 * Text on stone is navy or ink only: ivory measures 1.9:1 there and slate 2.62:1.
 */

type SpecTableProps = {
  readonly specs: Project["specs"];
  readonly status: ProjectStatus;
};

type SpecRow = {
  readonly label: string;
  readonly value: string;
};

function rowsFor(specs: Project["specs"], status: ProjectStatus): readonly SpecRow[] {
  const candidates: readonly (SpecRow | null)[] = [
    { label: "Property type", value: specs.propertyTypes.join(" · ") },
    specs.units === undefined ? null : { label: "Units", value: String(specs.units) },
    specs.sqftRange === undefined ? null : { label: "Size", value: specs.sqftRange },
    specs.completion === undefined ? null : { label: "Completion", value: specs.completion },
    { label: "Status", value: STATUS_LABEL[status] },
  ];

  return candidates.filter((row): row is SpecRow => row !== null);
}

export function SpecTable({ specs, status }: SpecTableProps) {
  return (
    <StoneSlab padding="md">
      <Eyebrow as="h2" tone="onStone">
        Specifications
      </Eyebrow>
      <dl className="mt-5 flex flex-col gap-4">
        {rowsFor(specs, status).map((row) => (
          <div key={row.label} className="border-t border-navy/15 pt-4 first:border-0 first:pt-0">
            <dt className="font-body text-[13px] font-medium uppercase tracking-[0.04em] text-ink">
              {row.label}
            </dt>
            <dd className="mt-1 font-display text-[17px] font-medium text-navy">{row.value}</dd>
          </div>
        ))}
      </dl>
    </StoneSlab>
  );
}
