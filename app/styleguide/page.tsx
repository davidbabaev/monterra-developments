import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ColorSwatches } from "./_components/ColorSwatches";
import { ContrastTable } from "./_components/ContrastTable";
import { LogoGallery } from "./_components/LogoGallery";
import {
  ButtonGallery,
  CardGallery,
  StatGallery,
  SupportingGallery,
} from "./_components/PrimitiveGallery";
import { StyleguideSection } from "./_components/StyleguideSection";
import { TypeScaleTable } from "./_components/TypeScaleTable";

/** Internal reference page. Not for the public site, and excluded from search. */
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <main id="main">
      <Section as="div" className="pb-0">
        <Container>
          <p className="font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
            Internal reference — noindex
          </p>
          <SplitHeading as="h1" lede="Design" rest="system" className="mt-2" />
          <p className="mt-4 max-w-[68ch] font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
            Every token and primitive in the system, with the measured contrast of each
            foreground/background pair the site actually renders.
          </p>
        </Container>
      </Section>

      <Container>
        <StyleguideSection
          eyebrow="Foundations"
          lede="Brand"
          rest="palette"
          note="Seven brand colours. Nothing outside this set appears in a component."
        >
          <ColorSwatches />
        </StyleguideSection>

        <StyleguideSection
          eyebrow="Foundations"
          lede="The"
          rest="logo"
          note="[REPLACE] Auto-traced from the supplied artwork and optimised, not redrawn. The geometry still carries tracer artefacts; a clean vector redraw is owed before launch."
        >
          <LogoGallery />
        </StyleguideSection>

        <StyleguideSection
          eyebrow="Foundations"
          lede="Contrast"
          rest="audit"
          note="Ratios are computed from the token hexes, not eyeballed. The same list is asserted in tests/unit/contrast.test.ts, so a failing pair breaks the test suite."
        >
          <ContrastTable />
        </StyleguideSection>

        <StyleguideSection
          eyebrow="Foundations"
          lede="Type"
          rest="scale"
          note="Cormorant Garamond appears only as the lede of an h1 or h2. Never in body copy, navigation, buttons or forms."
        >
          <TypeScaleTable />
        </StyleguideSection>

        <StyleguideSection eyebrow="Primitives" lede="Button" rest="variants">
          <ButtonGallery />
        </StyleguideSection>

        <StyleguideSection
          eyebrow="Primitives"
          lede="Card"
          rest="treatment"
          note="Hover a card: the border goes bronze, the card lifts 2px and the image scales to 1.03. All of it is gated behind prefers-reduced-motion."
        >
          <CardGallery />
        </StyleguideSection>

        <StyleguideSection eyebrow="Primitives" lede="Statistic" rest="treatment">
          <StatGallery />
        </StyleguideSection>

        <StyleguideSection eyebrow="Primitives" lede="Supporting" rest="elements">
          <SupportingGallery />
        </StyleguideSection>
      </Container>

      <div className="bg-navy">
        <Container>
          <Section>
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.04em] text-stone">
              On a dark scrim
            </p>
            <SplitHeading
              as="h2"
              lede="Selected"
              rest="work"
              variant="dark"
              className="mt-2"
            />
            <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ivory">
              The lede stays bronze and the remainder goes ivory.
            </p>
          </Section>
        </Container>
      </div>
    </main>
  );
}
