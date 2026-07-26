import { Building2, Mail, Phone } from "lucide-react";
import { AmenityMarker } from "@/components/ui/AmenityMarker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardMedia } from "@/components/ui/CardMedia";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PullQuote } from "@/components/ui/PullQuote";
import { SectionNumeral } from "@/components/ui/SectionNumeral";
import { StatBlock } from "@/components/ui/StatBlock";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StoneSlab } from "@/components/ui/StoneSlab";
import { PROJECT_STATUSES } from "@/lib/schema";

/** Every primitive, rendered in the states it actually ships in. */

function Label({ children }: { readonly children: React.ReactNode }) {
  return (
    <p className="mb-3 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
      {children}
    </p>
  );
}

export function ButtonGallery() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Label>Variants — tab through these to see the bronze focus ring</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">View our projects</Button>
          <Button variant="secondary">Start a conversation</Button>
          <Button variant="text">How we build</Button>
        </div>
      </div>
      <div>
        <Label>Disabled</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" disabled>
            View our projects
          </Button>
          <Button variant="secondary" disabled>
            Start a conversation
          </Button>
        </div>
      </div>
      <div>
        <Label>As links</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" href="/styleguide">
            Primary link
          </Button>
          <Button variant="text" href="/styleguide">
            Text link
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CardGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {PROJECT_STATUSES.map((status) => (
        <Card key={status}>
          <CardMedia>
            {/* Solid placeholder at the 3:2 card ratio — no photography yet. */}
            <div className="aspect-[3/2] bg-navy" />
          </CardMedia>
          <div className="p-5">
            <StatusBadge status={status} />
            <h3 className="mt-3 font-display text-[19px] font-semibold text-navy xl:text-[22px]">
              [REPLACE] Project title
            </h3>
            <p className="mt-1 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
              Austin, TX
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StatGallery() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Label>On ivory — unit in bronze at 24px+, which is WCAG large text</Label>
        <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
          <StatBlock figure="248" label="Units delivered" />
          <StatBlock figure="16" unit="yrs" label="In operation" />
          <StatBlock figure="79" unit="m²" label="Average size" />
          <StatBlock figure="12" label="Projects completed" />
        </div>
      </div>
      <div>
        <Label>On stone — unit and label darken, because bronze and slate fail here</Label>
        <StoneSlab padding="lg">
          <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
            <StatBlock figure="248" label="Units delivered" surface="stone" />
            <StatBlock figure="16" unit="yrs" label="In operation" surface="stone" />
            <StatBlock figure="79" unit="m²" label="Average size" surface="stone" />
            <StatBlock figure="12" label="Projects completed" surface="stone" />
          </div>
        </StoneSlab>
      </div>
    </div>
  );
}

export function SupportingGallery() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Label>Eyebrow</Label>
        <Eyebrow>Selected work</Eyebrow>
      </div>

      <div>
        <Label>Section numeral — stone, only used where order carries meaning</Label>
        <div className="flex items-end gap-6">
          {["01", "02", "03"].map((value) => (
            <SectionNumeral key={value} value={value} />
          ))}
        </div>
      </div>

      <div>
        <Label>Status badge</Label>
        <div className="flex flex-wrap gap-3">
          {PROJECT_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </div>

      <div>
        <Label>Icon — fixed 1.5 stroke, always paired with a label</Label>
        <div className="flex flex-wrap gap-8">
          {[
            { icon: Building2, label: "Office" },
            { icon: Phone, label: "Phone" },
            { icon: Mail, label: "Email" },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-3">
              <Icon icon={icon} />
              <span className="font-body text-[16px] text-ink">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div>
        <Label>Amenity marker — a hairline dash, not a per-amenity icon</Label>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "Rooftop terraces",
            "EV charging in every garage",
            "Central landscaped green",
            "Private fenced yards",
          ].map((amenity) => (
            <li key={amenity} className="flex gap-3">
              <AmenityMarker />
              <span className="font-body text-[16px] text-ink">{amenity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label>Pull quote</Label>
        <PullQuote
          quote="[REPLACE] We would rather build forty homes people want to stay in than four hundred they pass through."
          attribution="[REPLACE] Elena Marsh, Managing Partner"
        />
      </div>

      <div>
        <Label>Stone slab</Label>
        <StoneSlab padding="lg">
          <p className="font-body text-[16px] text-ink">
            Text on stone is navy or ink only. White measures 1.9:1 here and slate 2.62:1, so both
            are forbidden.
          </p>
        </StoneSlab>
      </div>
    </div>
  );
}
