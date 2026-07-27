import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { ProcessStages } from "@/components/process/ProcessStages";

export const metadata: Metadata = buildMetadata("/process");

export default function ProcessPage() {
  return (
    <>
      <PageHero
        lede="How"
        rest="we build"
        subhead="[REPLACE] Five stages, in the order they actually happen."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Our Process" }]}
      />

      <ProcessStages />

      <CtaBand
        lede="Bring us"
        rest="a site"
        body="[REPLACE] If you have land you think we should look at, we will walk it with you."
      />
    </>
  );
}
