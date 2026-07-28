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
 * Written in plain English on purpose. A policy nobody can read is not a policy,
 * and this site collects little enough that saying so plainly takes five
 * paragraphs rather than five pages.
 *
 * The opening note is not a disclaimer bolted on: this is a concept project, the
 * contact form has no destination wired to it, and a privacy policy that claimed
 * otherwise would be the one dishonest page on the site.
 */

type Clause = {
  readonly heading: string;
  readonly body: readonly string[];
};

const CLAUSES: readonly Clause[] = [
  {
    heading: "What the contact form collects",
    body: [
      "The contact form asks for your name and email address. You can also give a phone number and choose the development you are asking about, and there is a message box. That is everything the form collects — there are no hidden fields.",
      "We do not ask for anything we do not need in order to reply to you.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To answer your enquiry, and for nothing else. If you ask about a specific development we use what you sent to give you a useful answer about that development. We do not add you to a mailing list, and we do not send you anything you did not ask for.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "For as long as the conversation is live, and for twelve months afterwards in case you come back to us. After that we delete it. If a conversation turns into a purchase, the paperwork that comes with it is kept for as long as the law requires, which is separate from this form.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "This site sets no advertising cookies and runs no advertising trackers. There is no cross-site tracking, no fingerprinting, and nothing that follows you once you leave.",
      "If we add basic analytics — page views and referrers, aggregated, with no attempt to identify you — this paragraph will say which product and what it measures before it goes live.",
    ],
  },
  {
    heading: "Who else sees it",
    body: [
      "Nobody. We do not sell your details, we do not share them with advertisers, and we do not pass them to partners. The only people who read an enquiry are the people at Monterra who answer it.",
    ],
  },
  {
    heading: "Asking to see it or delete it",
    body: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it, and you do not have to give a reason. Write to the email address on our contact page and we will reply within thirty days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        lede="Privacy"
        rest="policy"
        subhead="What we do with the information you send us, in plain English."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <Section>
        <Container>
          <div className="max-w-[68ch]">
            <p className="font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
              Monterra Developments is a concept project and not a real company. The contact form
              on this site has no destination connected to it, so nothing you type into it is
              sent, stored or processed by anyone. The policy below describes what would happen
              on a live version of this site.
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
              Last updated: 29 July 2026
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
