import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = buildMetadata("/privacy");

/**
 * A single prose column at the 68ch measure. No CTA band and no offset
 * composition: this is a page someone reads once, on purpose, and decorating it
 * would be working against them.
 *
 * Every word below is a placeholder. A real policy, written by someone
 * qualified to write one, is owed before this site goes live — it is listed in
 * docs/build-increments.md under "Deferred".
 */

type Clause = {
  readonly heading: string;
  readonly body: readonly string[];
};

const CLAUSES: readonly Clause[] = [
  {
    heading: "[REPLACE] What we collect",
    body: [
      "[REPLACE] When you send us an inquiry we receive the name, email address, phone number and message you typed, along with the project you selected. We do not collect anything else through this website.",
    ],
  },
  {
    heading: "[REPLACE] What we do with it",
    body: [
      "[REPLACE] We use it to answer you. We do not sell it, and we do not add you to a mailing list you did not ask for.",
    ],
  },
  {
    heading: "[REPLACE] How long we keep it",
    body: [
      "[REPLACE] We keep inquiries for as long as we are talking to you and for a period afterwards, then delete them. The exact period belongs in this paragraph once it is decided.",
    ],
  },
  {
    heading: "[REPLACE] Cookies and analytics",
    body: [
      "[REPLACE] This site sets no advertising cookies. If analytics are added, this paragraph has to say which, what they measure, and how to opt out.",
    ],
  },
  {
    heading: "[REPLACE] Your rights",
    body: [
      "[REPLACE] You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Write to the email address on our contact page and we will reply within a month.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        lede="Privacy"
        rest="policy"
        subhead="[REPLACE] What we do with the information you send us."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <Section>
        <Container>
          <div className="max-w-[68ch]">
            <p className="font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
              [REPLACE] This is placeholder text and not a privacy policy. A real one is required
              before launch.
            </p>

            {CLAUSES.map((clause) => (
              <section key={clause.heading} className="mt-10">
                <h2 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
                  {clause.heading}
                </h2>
                {clause.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className="mt-10 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
              [REPLACE] Last updated: date to be set when the real policy lands
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
