# Outstanding content

Every placeholder still in the site, grouped by file, with what each one needs and
who can supply it. Written 2026-07-29 at the close of increment 11.

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
| `app/privacy/page.tsx` — 13 markers | A real privacy policy. The page currently says in its own body that it is not one. This needs a lawyer, not a copywriter, and it is a legal requirement before the site accepts a single inquiry. | Client |
| `content/team.json` — 16 markers | Four real people: name, role, two-line bio, portrait and LinkedIn URL each. Invented colleagues on a live site are a serious problem, not a cosmetic one. | Client |
| `components/ui/StatsBand.tsx` — 4 figures | Units delivered, years in operation, markets, projects completed. Currently 1,240 / 18 / 3 / 26 — all invented. A wrong number in 40px bronze is the most quotable thing on the homepage. | Client |

---

## Content — projects

| File | What it needs | Who |
| --- | --- | --- |
| `content/projects/monterra-ridge/index.mdx` (12) | Real street address, three body paragraphs, hero alt text, four gallery alts, one caption, two floor-plan alts. The address is the only one of these with public reach — it feeds the `Residence` JSON-LD and is dropped from it while marked. | Client → you |
| `content/projects/the-larkin/index.mdx` (8) | Three body paragraphs, hero alt, four gallery alts. The completion date and sales claim ("sold within nine months") are stated as fact and need confirming. | Client → you |
| `content/projects/monterra-bay/index.mdx` (3) | Two body paragraphs and the hero alt. Sparse is correct for an upcoming project — this does not need filling out, only making true. | Client → you |
| **The Larkin has no `coords`** | Not a marker, a gap. `lib/structured-data.ts` emits a `Residence` block only when a project has coordinates, so The Larkin and Monterra Bay currently emit none and only Monterra Ridge gets structured data. Supply the latitude and longitude and the block appears on its own — **do not invent them.** | Client |

---

## Copy — pages and sections

All of it is plausible brand-appropriate English written to hold the layout. None
of it is approved, and several lines make specific claims about how the company
operates that need checking before they ship.

| File | What it needs | Who |
| --- | --- | --- |
| `app/page.tsx` (1) | Home CTA band body. | Client → you |
| `components/home/Hero.tsx` (1) | The hero subhead. Names Texas, Florida and Colorado — true of the three seeded projects, needs to stay true. | Client → you |
| `components/home/Positioning.tsx` (2) | Positioning paragraph and its image alt. | Client → you |
| `components/home/ProcessPreview.tsx` (3) | Three stage summaries. Must stay consistent with the five on `/process`. | Client → you |
| `app/about/page.tsx` (4) | Page subhead, the pull-quote, its attribution, CTA body. The quote is attributed to a named founder who does not exist yet. | Client |
| `components/about/CompanyStory.tsx` (3) | Two story paragraphs and an image alt. States the company started in 2008 with one duplex — a factual claim. | Client |
| `components/about/ValuesGrid.tsx` (4) | Four value statements. Each makes an operational claim (sites bought outright, nothing subcontracted) that is either true or should not be said. | Client |
| `components/process/ProcessStages.tsx` (6) | Five stage bodies and the stage image alt. The two-year warranty in stage five is a contractual claim. | Client |
| `app/process/page.tsx` (2) | Page subhead and CTA body. | Client → you |
| `app/team/page.tsx` (2) | Page subhead and CTA body. | Client → you |
| `app/projects/page.tsx` (2) | Page subhead and intro paragraph. | Client → you |
| `app/contact/page.tsx` (1) | Page subhead. | Client → you |
| `components/project/StatusTracker.tsx` (3) | One line per status — upcoming, current, completed. | Client → you |
| `components/project/ProjectsEmptyState.tsx` (1) | The empty-filter message. | You |
| `components/layout/ContactBand.tsx` (1) | "We reply within two business days" — a service promise the company has to be willing to keep. | Client |
| `components/forms/InquirySuccess.tsx` (1) | The post-submission confirmation. | Client → you |

---

## Artwork

| File | What it needs | Who |
| --- | --- | --- |
| `components/ui/Logo.tsx`, `components/ui/logoPaths.ts` | A redrawn logo. The current mark is auto-traced from the supplied artwork and still carries tracer artefacts. Already on the deferred list in `docs/build-increments.md`. | You (commission) |
| Favicon set | Derived from the redrawn monogram, once it exists. | You |
| `components/layout/PageHero.tsx` | Solid-colour placeholders stand in for architectural photography on every page hero. | Client |
| `components/project/LocationBlock.tsx` | A placeholder at a map's aspect ratio, plus its alt text. Needs either a real map or a decision to drop the block. | You |
| `content/projects/*/hero.png`, `gallery/`, `plans/` | Every project image is a solid-colour placeholder at the right aspect ratio. | Client |
| `public/team/portrait-0*-placeholder.png` | Four real portraits, 4:5. | Client |

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
| `content/team.json` — `linkedin` | Three of the four are `example-<name>` URLs and resolve to nothing. Unmarked. |
| `lib/seo.ts` — the eight page descriptions | Clean of markers by design, because a marker would be published into search results and eat 10 of the 160 characters. **They are still unapproved copy** and make claims — "since 2008", "its own crews and no outside investors", "no outside investors" — that need the same sign-off as everything above. |
| `content/projects/*/index.mdx` — `seo.description` | Same as above: clean, deliberately unmarked, unapproved, and each states unit counts and dates as fact. |
| `lib/site.ts` — `description` | Fixed in this increment and now real copy, not a placeholder. Listed only so nobody re-marks it. |

---

## Not content, tracked here so it is not lost

- **`region` best-practice finding (axe).** Nine of ten routes report
  "All page content should be contained by landmarks", three nodes each. The nodes
  are the `ContactBand` list items; the band sits between `</main>` and `<Footer>`
  in `app/layout.tsx` and so is inside no landmark. `/contact` is clean because the
  band is suppressed there. It is a best-practice rule, not a WCAG failure — the
  suite reports it and does not assert on it. The fix is one wrapping element with
  an accessible name; it has not been applied, pending a decision.
