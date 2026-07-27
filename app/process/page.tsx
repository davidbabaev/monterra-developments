import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { ProcessStages } from "@/components/process/ProcessStages";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "[REPLACE] How Monterra Developments buys land, draws a plan, gets it permitted, builds it with its own crews and hands it over.",
};

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
