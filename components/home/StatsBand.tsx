"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { StatBlock } from "@/components/ui/StatBlock";
import { StoneSlab } from "@/components/ui/StoneSlab";
import { useCountUpStats } from "./useCountUpStats";

/**
 * Four figures on a stone slab, separated by hairline rules at 768px and above.
 * Below that the rules go and the figures become a 2x2 grid — four items in a
 * row at 390px would set the numbers at a size nobody can read.
 *
 * `surface="stone"` is what keeps the unit and label at navy and ink. Bronze
 * drops to 2.01:1 on stone and slate to 2.62:1; both are forbidden there.
 */

type Stat = {
  readonly value: number;
  readonly unit?: string;
  readonly label: string;
};

/** [REPLACE] Every figure here is a placeholder. */
const STATS: readonly Stat[] = [
  { value: 1240, label: "Units delivered" },
  { value: 18, unit: "yrs", label: "Years in operation" },
  { value: 3, label: "Markets" },
  { value: 26, label: "Projects completed" },
];

const TARGETS = STATS.map((stat) => stat.value);

/** A thousands separator on the figure, so 1240 reads as 1,240 mid-count too. */
const format = (value: number) => value.toLocaleString("en-US");

export function StatsBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const values = useCountUpStats(TARGETS, bandRef);

  return (
    <Section>
      <Container>
        <StoneSlab padding="lg">
          <div ref={bandRef} className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                /* The rule is a left border on every item but the first, so it
                   only ever appears between two figures. It is dropped with the
                   row layout below 768px. */
                className={
                  index === 0
                    ? "md:px-8 md:first:pl-0"
                    : "md:border-l md:border-navy/20 md:px-8 md:last:pr-0"
                }
              >
                <StatBlock
                  figure={format(values[index] ?? stat.value)}
                  unit={stat.unit}
                  label={stat.label}
                  surface="stone"
                />
              </div>
            ))}
          </div>
        </StoneSlab>
      </Container>
    </Section>
  );
}
