# Outstanding content

Every placeholder still in the site, grouped by file, with what each one needs and
who can supply it. Written 2026-07-29 at the close of increment 11; the homepage
was signed off on 2026-07-29, the remaining copy on 2026-07-30, and the entries
those covered are struck through below.

**All prose on the site is written and approved.** Every page hero, every body
paragraph, every project narrative, every CTA body but one. The site reads as
finished copy end to end.

**The one line of copy still outstanding** is the `/team` CTA body. No wording was
supplied for it in the 2026-07-30 batch, so it still carries the placeholder about
hiring site managers. It is the only `[REPLACE]` a reader meets on a public page.

**Everything else marked is artwork, contact details or internal.** Three groups,
and none of them is prose: the logo and every image placeholder; the contact
details and production domain in `lib/site.ts` and `lib/seo.ts`; and the
styleguide, which is `noindex`.

**The dates and figures are a single interlocking set.** 2014, twelve years, 340
homes, three markets, nine completed. They appear in the statistics band, the
About hero, the company story and the `/about` meta description. A unit test pins
the two that tie to other copy, but the rest are held together only by this note —
if one moves, they all move.

**The site now says it is not a real company.** The footer bottom bar carries "A
concept project. Monterra Developments is not a real company." on every page. It
is there because the site has a working contact form and a brand plausible enough
to be mistaken for a live developer. If this ever becomes a real client site, that
line is the first thing to remove — and everything else in this document has to be
done before it goes.

**How to read the "who" column**

- **Client** — only Monterra can supply it. A fact about the company, its people,
  its sites or its numbers. Nobody else can write it without inventing it.
- **You** — a build or craft decision that does not need the client: commissioning
  artwork, choosing a domain, drafting prose once the facts exist.
- **Client → you** — the client supplies the facts, you write the copy around them.

**How to find them.** Every item below is marked `[REPLACE]` in the source, so
`grep -rn "\[REPLACE\]" app components lib content` lists them all. The exception
is the last section, which is placeholder data that carries no marker — those will
not show up in a grep and are the easiest to ship by accident.

---

## Blocking launch

These are wrong in public, not merely unfinished.

| File | What it needs | Who |
| --- | --- | --- |
| `lib/seo.ts` — `SITE_URL` | The production domain. Every canonical URL, every OG image URL and the sitemap resolve against it, so a wrong value here mislabels the whole site. Currently `https://www.monterradevelopments.com`. | Client |
| `lib/site.ts` — `contact.email`, `contact.phone` | The real inbox and number. These are where every inquiry lands; the current ones are invented and go nowhere. | Client |
| `lib/site.ts` — `contact.address` | The real street and locality. Until they land, the `PostalAddress` is omitted from the Organization JSON-LD rather than published with a marker in it. | Client |
| ~~`app/privacy/page.tsx` — 13 markers~~ | **Written 2026-07-29.** Six clauses in plain English covering what the form collects, why, retention, cookies and analytics, who else sees it, and how to ask for deletion. It opens by saying the site is a concept project and that the form has no destination, so nothing is processed — which is true today. **If this ever becomes a live site, a qualified person must review it**, and the opening paragraph has to be replaced rather than deleted. | You → a lawyer, if it goes live |
| ~~`content/team.json` — 16 markers~~ | **Written 2026-07-29.** Four invented people with names, roles and bios: Elena Marsh, Priya Raman, Daniel Okonjo, Marcus Bell. Two carry a LinkedIn URL and two do not, so both card paths render. **They are not real people**, the LinkedIn URLs are `example-*` and resolve to nothing, and the portraits are still placeholders. Elena Marsh is also the attribution on the About pull-quote — the two must not drift apart, **and they had, until 2026-07-30**: the quote said "Founder" where this file says "Founder and Principal". Both now read "Founder and Principal". The four portrait alts were written on 2026-07-30 as "Portrait of {name}, {role}", so each alt is a third place the role string appears. | Client, if it goes live |
| ~~`components/ui/StatsBand.tsx` — 4 figures~~ | **Done 2026-07-29.** 340 homes delivered, 12 years building, 3 markets, 9 projects completed. They are a set, not four independent numbers: three markets is the three cities named in the hero, and nine completed is what the three selected projects are a selection from. Changing one without the others makes the page contradict itself, and a unit test now pins the two that tie to other copy. **This band also renders on `/about`,** so these are the figures on both pages. | — |

---

## Content — projects

| File | What it needs | Who |
| --- | --- | --- |
| ~~`content/projects/monterra-ridge/index.mdx`~~ (12) | **Written 2026-07-30.** Address is now `4200 E Riverside Drive, Austin, TX 78741` — unmarked, so it now feeds the `Residence` JSON-LD where before it was dropped. Three body paragraphs, hero alt, four gallery alts, one caption, two floor-plan alts. The plan alts state 1,400 sq ft / three bedrooms and 2,100 sq ft / four bedrooms, which bracket the `sqftRange` in the frontmatter — move one and move the other. | — |
| ~~`content/projects/the-larkin/index.mdx`~~ (8) | **Written 2026-07-30.** Three body paragraphs, hero alt, four gallery alts. The body names the three retail tenants (bakery, bike shop, physical therapist) and an eighteen-month approval fight — specifics, so they are wrong rather than vague if they are wrong. | — |
| ~~`content/projects/monterra-bay/index.mdx`~~ (3) | **Written 2026-07-30.** Two short paragraphs and the hero alt. Deliberately sparse and pointed at the contact form, which is what an upcoming project should do. The hero alt says "architectural rendering", so the image that lands there has to be a rendering, not a photograph. | — |
| **The Larkin has no `coords`** | Not a marker, a gap. `lib/structured-data.ts` emits a `Residence` block only when a project has coordinates, so The Larkin and Monterra Bay currently emit none and only Monterra Ridge gets structured data. Supply the latitude and longitude and the block appears on its own — **do not invent them.** | Client |

---

## Copy — pages and sections

All of it is now approved copy. One row is still outstanding, and it is the only
one on this page that a reader can see.

| File | What it needs | Who |
| --- | --- | --- |
| ~~`app/page.tsx`~~ | **Done 2026-07-29.** Closing heading and body both approved. | — |
| ~~`components/home/Hero.tsx`~~ | **Done 2026-07-29.** Headline kept as written; subhead now names Austin, Tampa and Denver, which are the three cities the seeded projects are in and the three the statistics count as markets. | — |
| ~~`components/home/Positioning.tsx`~~ | **Done.** Statement 2026-07-29, image alt 2026-07-30 — "A completed Monterra street on a clear afternoon". Written against the placeholder, so **rewrite it when the real photograph lands**: alt text has to describe the image that is actually there. | — |
| ~~`components/home/ProcessPreview.tsx`~~ | **Done 2026-07-29.** Find the site / Design for the block / Build and deliver. The first three stages on `/process` now use the same words in the same order — if one side changes, change the other. | — |
| ~~`components/home/FeaturedProjects.tsx`~~ | **Done 2026-07-29.** Eyebrow "Recent work" over heading "Selected work" — two labels, one hierarchy. | — |
| ~~`app/about/page.tsx`~~ | **Done.** Hero, pull-quote and attribution 2026-07-29; CTA band body 2026-07-30. The pull-quote attribution was corrected on 2026-07-30 from "Elena Marsh, Founder" to "Elena Marsh, Founder and Principal" — it had drifted from `content/team.json`, and the comment above it wrongly claimed the two already matched. Both now say the same thing, and the comment says which file is the other half. | — |
| ~~`components/about/CompanyStory.tsx`~~ | **Done.** Three paragraphs 2026-07-29, image alt 2026-07-30 — "The first Monterra duplex in East Austin, completed 2014". States the company began in 2014 and has delivered 340 homes; both are load-bearing against the statistics band, and the alt now repeats the 2014 date, so that is a third place it has to move from. **Rewrite the alt when the real photograph lands.** | — |
| ~~`components/about/ValuesGrid.tsx`~~ | **Done 2026-07-29.** Site first / Built to last / One team / Straight answers. **Not numbered**, though the brief listed them 01–04: this is a set, not a sequence, and Our Process is the only page where order carries information. Say so if you want the numerals. | — |
| `components/process/ProcessStages.tsx` (1 alt) | **Stage copy done 2026-07-29.** Five stages with their outcome lines. Stage 04's title is the single word "Build", which the two-tone lockup cannot split, so it renders as the bronze lede alone — the only heading on the site that does not split. **The stage image alts are the one thing here still marked**, and no wording was supplied for them on 2026-07-30. They are generated from the stage title, so one string covers all five. The two-year structural warranty in stage 05 is signed off — see the flagged-claims note at the foot of this document. | Client → you |
| ~~`app/process/page.tsx`~~ | **Done 2026-07-30.** Subhead "Forty sites a year. We buy three." and the CTA body. The subhead is a claim about deal flow, not a description of the page — it sets up the five stages rather than summarising them. | — |
| `app/team/page.tsx` (1) | **Subhead and intro done 2026-07-30.** The subhead says twelve people where the grid shows four, which is correct — the grid is the leadership, not the payroll — but it is the kind of pair that reads as a bug if either side moves. An intro paragraph was added to match the one on `/projects`. **The CTA body is the last unwritten line of copy on the site**: no wording was supplied for it, so it still carries the placeholder about hiring site managers and carpenters. | Client → you |
| ~~`app/projects/page.tsx`~~ | **Done 2026-07-30.** Subhead "Nine completed, one under construction, one on the way." and the intro. The subhead counts nine completed against the statistics band, and one-and-one against the two non-completed projects seeded on disk — it is pinned to both, so a fourth project means editing this line. | — |
| ~~`app/contact/page.tsx`~~ | **Done 2026-07-30.** Subhead "Tell us what you are planning." | — |
| ~~`components/project/StatusTracker.tsx`~~ | **Done 2026-07-30.** Three lines: "In design. Details to follow." / "Under construction." / "Delivered and sold." They no longer interpolate the project title, so the component **no longer takes a `title` prop** — the heading and breadcrumb above have already named the development twice by the time a reader reaches the line. | — |
| ~~`components/project/ProjectsEmptyState.tsx`~~ | **Done 2026-07-30.** The message now says why the filter is empty — three projects on the site — rather than restating what the listing holds. | — |
| ~~`components/layout/ContactBand.tsx`~~ | **Done 2026-07-30.** "We reply within two business days", signed off as written; see the flagged-claims note at the foot of this document. | — |
| ~~`components/forms/InquirySuccess.tsx`~~ | **Done 2026-07-30.** One approved line — "Thanks — we will be in touch within two business days." — and **the supporting paragraph was deleted rather than rewritten.** No copy was supplied for it, and a confirmation that has said the one thing a reader needs does not need a second sentence. The panel is now heading plus "Send another message". | — |

---

## Artwork

| File | What it needs | Who |
| --- | --- | --- |
| `components/ui/Logo.tsx`, `components/ui/logoPaths.ts` | A redrawn logo. The current mark is auto-traced from the supplied artwork and still carries tracer artefacts. Already on the deferred list in `docs/build-increments.md`. | You (commission) |
| Favicon set | Derived from the redrawn monogram, once it exists. | You |
| `components/layout/PageHero.tsx` | Solid-colour placeholders stand in for architectural photography on every page hero. | Client |
| `components/project/LocationBlock.tsx` | The image is still a placeholder at a map's aspect ratio. **Its alt text is done 2026-07-30** — "Map showing the project location". The alt no longer names the project, so the component **no longer takes a `title` prop**. Still needs either a real map or a decision to drop the block. | You |
| `content/projects/*/hero.png`, `gallery/`, `plans/` | Every project image is a solid-colour placeholder at the right aspect ratio. **The alt text for all of them is now written**, so the images have to match the words rather than the other way round: Monterra Ridge's gallery is described as sidewalk view, rooftop terrace, kitchen, green after rain, in that order, and Monterra Bay's hero is described as a rendering. | Client |
| `public/team/portrait-0*-placeholder.png` | Four real portraits, 4:5. Alt text done 2026-07-30 — "Portrait of {name}, {role}" for each. | Client |

---

## Internal only — not public

Worth finishing, but nothing here is indexed or shipped to a visitor.

| File | What it needs | Who |
| --- | --- | --- |
| `app/styleguide/page.tsx` (1) | The note on the logo section, which will be obsolete once the mark is redrawn. | You |
| `app/styleguide/_components/PrimitiveGallery.tsx` (3) | Sample strings demonstrating the primitives. Fine to leave marked. | You |

---

## Placeholder, but carrying no marker

**These do not appear in a `grep` for `[REPLACE]`.** They were left unmarked on
purpose so that links work and layouts hold, which also means nothing will flag
them before launch. Check this list by hand.

| Where | What is actually placeholder |
| --- | --- |
| `lib/site.ts` — `contact.email.href`, `contact.phone.href` | The `mailto:` and `tel:` targets are clean so the links function, but the address and number behind them are invented. |
| `lib/site.ts` — `socials[].href` | LinkedIn and Instagram URLs are marked, but confirm the accounts exist before the marker comes off. Omitted from JSON-LD while marked. |
| `content/team.json` — `linkedin` | Two of the four are `example-<name>` URLs and resolve to nothing. Unmarked, and they are live external links on a public page. |
| `content/team.json` — the four people | Names, roles and bios are written and unmarked, but **these are invented people**. On a concept project that is fine and the footer says so; on a live site every one of them has to be replaced with someone real. |
| `app/privacy/page.tsx` — the policy | Unmarked and readable, but it describes what *would* happen rather than what does, because nothing is wired up. Its first paragraph is what makes that honest. |
| `lib/seo.ts` — the eight page descriptions | Clean of markers by design, because a marker would be published into search results and eat 10 of the 160 characters. **They are still unapproved copy.** The `/about` one was corrected from 2008 to 2014 on 2026-07-29 — it had begun contradicting the company story on the same page. The `/` one says "across Texas, Florida and Colorado" where the hero says "Austin, Tampa and Denver": the same three places at different granularity, consistent today, but they move together. |
| `content/projects/*/index.mdx` — `seo.description` | Same as above: clean, deliberately unmarked, unapproved, and each states unit counts and dates as fact. Monterra Bay's said the site was "bought in 2026" where the body approved on 2026-07-30 says only that we have been trying to buy it since 2021. **The clause was cut on 2026-07-30** rather than rewritten — removing a claim the approved copy contradicts is a correction; writing a new one would have been inventing. Monterra Ridge's still says the first homes are handed over "in late 2027" where the body and the frontmatter both say Q3 — soft, but the same kind of drift. |
| `content/projects/*/index.mdx` — every alt string | Written and unmarked as of 2026-07-30, but written against solid-colour placeholders. They describe images that do not exist yet. Every one has to be checked against the real photograph when it lands, and the same goes for the `Positioning` and `CompanyStory` alts. |
| `lib/site.ts` — `description` | Fixed in this increment and now real copy, not a placeholder. Listed only so nobody re-marks it. |

---

## Flagged claims — signed off, do not re-raise

Three lines on the site were flagged here as claims that needed checking before
they shipped. **All three were approved as written on 2026-07-30** and are not
open questions any more. They are recorded so nobody re-opens them.

| Claim | Where |
| --- | --- |
| The two-year structural warranty | `components/process/ProcessStages.tsx`, stage 05 |
| "Every home sold within nine months of the first release" | `content/projects/the-larkin/index.mdx`, and the `seo.description` on the same file |
| "We reply within two business days" | `components/layout/ContactBand.tsx`, and the confirmation panel in `components/forms/InquirySuccess.tsx` |

The grounds for the approval are that this is a concept project and the footer
says so on every page. **That is also the limit of the approval.** If the footer
disclaimer goes, all three become claims a real company is making about itself,
and all three go back to needing a real answer — the warranty most of all, since
it is a contractual commitment rather than a description.

---

## Not content, tracked here so it is not lost

- ~~**`region` best-practice finding (axe).**~~ **Fixed 2026-07-29.** The band is
  now an `aside` labelled "Contact details", and the rule is clear on all ten
  routes. Kept below for the record.

  Nine of ten routes reported
  "All page content should be contained by landmarks", three nodes each. The nodes
  are the `ContactBand` list items; the band sits between `</main>` and `<Footer>`
  in `app/layout.tsx` and so was inside no landmark. `/contact` was clean because the
  band is suppressed there. It is a best-practice rule, not a WCAG failure — the
  suite reports it and does not assert on it. The fix was one wrapping element with
  an accessible name.
