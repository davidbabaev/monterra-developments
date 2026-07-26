import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Section>
      <Container className="flex flex-col items-center text-center">
        <p
          aria-hidden="true"
          className="font-display text-[64px] font-bold leading-none text-stone xl:text-[96px]"
        >
          404
        </p>
        <SplitHeading as="h1" lede="Page" rest="not found" className="mt-6" />
        <p className="mt-4 max-w-[52ch] font-body text-[16px] text-ink xl:text-[17px]">
          This page has not been built.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" href="/">
            Back to home
          </Button>
          <Button variant="secondary" href="/projects">
            View projects
          </Button>
        </div>
      </Container>
    </Section>
  );
}
