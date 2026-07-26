import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";

/** One titled block of the styleguide. Styleguide-only, hence the private folder. */

type StyleguideSectionProps = {
  readonly lede: string;
  readonly rest: string;
  readonly eyebrow: string;
  readonly note?: string;
  readonly children: React.ReactNode;
};

export function StyleguideSection({
  lede,
  rest,
  eyebrow,
  note,
  children,
}: StyleguideSectionProps) {
  return (
    <section className="border-t border-stone py-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SplitHeading as="h2" lede={lede} rest={rest} className="mt-2" />
      {note !== undefined && (
        <p className="mt-3 max-w-[68ch] font-body text-[16px] text-ink">{note}</p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}
