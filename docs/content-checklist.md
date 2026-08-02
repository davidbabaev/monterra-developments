# Outstanding content

Every placeholder still in the site, grouped by file, with what each one needs and
who can supply it. Written 2026-07-29 at the close of increment 11; the homepage
was signed off on 2026-07-29, the remaining copy on 2026-07-30, and the entries
those covered are struck through below.

**Every line of prose on the site is written and approved.** Every page hero,
every body paragraph, every project narrative, every CTA body. The `/team` CTA
was the last one and landed 2026-07-30. Nothing a reader reads is a placeholder
any more.

**What is still marked is artwork, the production domain, or internal.** Three
groups, and none of them is prose: the logo and the image placeholders listed
under Artwork; the `SITE_URL` origin and the page descriptions in `lib/seo.ts`;
and the styleguide, which is `noindex`.

**Real photography landed on 2026-07-30 for Our Process and the team.** Nine
images — five process stages and four portraits. Every other image slot on the site is still a solid-colour
placeholder, and the Artwork section below lists each one.

**No marker reaches a reader any more.** The office address, phone number, email
and hours in `lib/site.ts` were the last ones — they rendered marked in the
contact band and the footer on every route until 2026-08-02, and now carry the
approved details. `tests/unit/seo.test.ts` asserts the whole of `siteConfig`
serialises without the marker, so one cannot come back unnoticed. The details are
invented, like the rest of this project; the footer disclaimer covers that and no
field repeats it.

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
| ~~`lib/site.ts` — `contact.*`~~ | **Set 2026-08-02**, markers removed: 1100 Congress Avenue, Suite 400 / Austin, TX 78701 / (512) 555-0142 / hello@monterradevelopments.com / Monday to Friday, 9am to 5pm CT. **They are invented and go nowhere** — the inbox does not exist and the number does not ring, so every inquiry the form collects still has no destination. The Organization JSON-LD now publishes the `PostalAddress` instead of dropping it, which means these values are readable by a crawler. If this becomes a live site the real ones replace them here, in one file. | Client |
| ~~`lib/site.ts` — `socials`~~ | **Removed 2026-08-02.** Two links to a LinkedIn and an Instagram account that do not exist. Pointing them at `#` was rejected: both render with `target="_blank"`, so `#` opens a duplicate tab of the current page, and an unmarked `#` would be published in the schema's `sameAs`. The key is gone, with the footer list and the contact page's "Follow" block. Restoring it means adding the key back and re-adding both blocks. | Client, if accounts ever exist |
| ~~`app/privacy/page.tsx` — 13 markers~~ | **Written 2026-07-29.** Six clauses in plain English covering what the form collects, why, retention, cookies and analytics, who else sees it, and how to ask for deletion. It opens by saying the site is a concept project and that the form has no destination, so nothing is processed — which is true today. **If this ever becomes a live site, a qualified person must review it**, and the opening paragraph has to be replaced rather than deleted. | You → a lawyer, if it goes live |
| ~~`content/team.json` — 16 markers~~ | **Written 2026-07-29.** Four invented people with names, roles and bios: Elena Marsh, Priya Raman, Daniel Okonjo, Marcus Bell. Two carry a LinkedIn URL and two do not, so both card paths render. **They are not real people**, the LinkedIn URLs are `example-*` and resolve to nothing, and the portraits are **real photographs as of 2026-07-30**, which makes the
invented names a sharper problem rather than a softer one: there are now faces
attached to them. Elena Marsh is also the attribution on the About pull-quote — the two must not drift apart, **and they had, until 2026-07-30**: the quote said "Founder" where this file says "Founder and Principal". Both now read "Founder and Principal". The four portrait alts were written on 2026-07-30 as "Portrait of {name}, {role}", so each alt is a third place the role string appears. | Client, if it goes live |
| ~~`components/ui/StatsBand.tsx` — 4 figures~~ | **Done 2026-07-29.** 340 homes delivered, 12 years building, 3 markets, 9 projects completed. They are a set, not four independent numbers: three markets is the three cities named in the hero, and nine completed is what the three selected projects are a selection from. Changing one without the others makes the page contradict itself, and a unit test now pins the two that tie to other copy. **This band also renders on `/about`,** so these are the figures on both pages. | — |

---

## Content — projects

| File | What it needs | Who |
| --- | --- | --- |
| ~~`content/projects/monterra-ridge/index.mdx`~~ (12) | **Written 2026-07-30.** Address is now `4200 E Riverside Drive, Austin, TX 78741` — unmarked, so it now feeds the `Residence` JSON-LD where before it was dropped. Three body paragraphs, hero alt, four gallery alts, one caption. The two floor-plan alts went with the `floorPlans` block on 2026-08-02; they stated 1,400 sq ft / three bedrooms and 2,100 sq ft / four bedrooms and were the only copy bracketing `sqftRange`, which now appears in the spec table alone. | — |
| ~~`content/projects/the-larkin/index.mdx`~~ (8) | **Written 2026-07-30.** Three body paragraphs, hero alt, four gallery alts. The body names the three retail tenants (bakery, bike shop, physical therapist) and an eighteen-month approval fight — specifics, so they are wrong rather than vague if they are wrong. | — |
| ~~`content/projects/monterra-bay/index.mdx`~~ (3) | **Written 2026-07-30.** Two short paragraphs and the hero alt. Deliberately sparse and pointed at the contact form, which is what an upcoming project should do. The hero alt says "architectural rendering", so the image that lands there has to be a rendering, not a photograph. | — |
| **The Larkin has no `coords`** | Not a marker, a gap. `lib/structured-data.ts` emits a `Residence` block only when a project has coordinates, so The Larkin and Monterra Bay currently emit none and only Monterra Ridge gets structured data. Supply the latitude and longitude and the block appears on its own — **do not invent them.** | Client |

---

## Copy — pages and sections

All of it is now approved copy. The one row still open is an image alt, not a
line of prose — it is here rather than under Artwork because the string lives in
a component next to copy that is done.

| File | What it needs | Who |
| --- | --- | --- |
| ~~`app/page.tsx`~~ | **Done 2026-07-29.** Closing heading and body both approved. | — |
| ~~`components/home/Hero.tsx`~~ | **Done 2026-07-29.** Headline kept as written; subhead now names Austin, Tampa and Denver, which are the three cities the seeded projects are in and the three the statistics count as markets. | — |
| ~~`components/home/Positioning.tsx`~~ | **Done.** Statement 2026-07-29. Image alt rewritten 2026-08-02 against the real photograph, replacing "A completed Monterra street on a clear afternoon" — which the placeholder-era alt described and this frame is not. It now names the three staff at the table, the drawings, the crane and the hoarding. | — |
| ~~`components/home/ProcessPreview.tsx`~~ | **Done 2026-07-29.** Find the site / Design for the block / Build and deliver. The first three stages on `/process` now use the same words in the same order — if one side changes, change the other. | — |
| ~~`components/home/FeaturedProjects.tsx`~~ | **Done 2026-07-29.** Eyebrow "Recent work" over heading "Selected work" — two labels, one hierarchy. | — |
| ~~`app/about/page.tsx`~~ | **Done.** Hero, pull-quote and attribution 2026-07-29; CTA band body 2026-07-30. The pull-quote attribution was corrected on 2026-07-30 from "Elena Marsh, Founder" to "Elena Marsh, Founder and Principal" — it had drifted from `content/team.json`, and the comment above it wrongly claimed the two already matched. Both now say the same thing, and the comment says which file is the other half. | — |
| ~~`components/about/CompanyStory.tsx`~~ | **Done.** Three paragraphs 2026-07-29, image alt 2026-07-30 — "The first Monterra duplex in East Austin, completed 2014". States the company began in 2014 and has delivered 340 homes; both are load-bearing against the statistics band, and the alt now repeats the 2014 date, so that is a third place it has to move from. **Rewrite the alt when the real photograph lands.** | — |
| ~~`components/about/ValuesGrid.tsx`~~ | **Done 2026-07-29.** Site first / Built to last / One team / Straight answers. **Not numbered**, though the brief listed them 01–04: this is a set, not a sequence, and Our Process is the only page where order carries information. Say so if you want the numerals. | — |
| ~~`components/process/ProcessStages.tsx`~~ | **Done.** Stage copy 2026-07-29, image alts 2026-07-30. Stage 04's title is the single word "Build", which the two-tone lockup cannot split, so it renders as the bronze lede alone — the only heading on the site that does not split. The five image alts are **written against the real photographs**, one per stage, and no longer generated from the stage title — so they describe what is in the frame rather than what the heading says. The two-year structural warranty in stage 05 is signed off — see the flagged-claims note at the foot of this document. | — |
| ~~`app/process/page.tsx`~~ | **Done 2026-07-30.** Subhead "Forty sites a year. We buy three." and the CTA body. The subhead is a claim about deal flow, not a description of the page — it sets up the five stages rather than summarising them. | — |
| ~~`app/team/page.tsx`~~ | **Done 2026-07-30.** Subhead, intro and CTA body. The subhead says twelve people where the grid shows four, which is correct — the grid is the leadership, not the payroll — but it is the kind of pair that reads as a bug if either side moves. An intro paragraph was added to match the one on `/projects`. The CTA body was the last unwritten line of copy on the site; it says the company is usually hiring for one role at a time, **which is a recruiting claim that goes stale on its own** and points at the contact form as the way in. | — |
| ~~`app/projects/page.tsx`~~ | **Done 2026-07-30.** Subhead "Nine completed, one under construction, one on the way." and the intro. The subhead counts nine completed against the statistics band, and one-and-one against the two non-completed projects seeded on disk — it is pinned to both, so a fourth project means editing this line. | — |
| ~~`app/contact/page.tsx`~~ | **Done 2026-07-30.** Subhead "Tell us what you are planning." | — |
| ~~`components/project/StatusTracker.tsx`~~ | **Done 2026-07-30.** Three lines: "In design. Details to follow." / "Under construction." / "Delivered and sold." They no longer interpolate the project title, so the component **no longer takes a `title` prop** — the heading and breadcrumb above have already named the development twice by the time a reader reaches the line. | — |
| ~~`components/project/ProjectsEmptyState.tsx`~~ | **Done 2026-07-30.** The message now says why the filter is empty — three projects on the site — rather than restating what the listing holds. | — |
| ~~`components/layout/ContactBand.tsx`~~ | **Done 2026-07-30.** "We reply within two business days", signed off as written; see the flagged-claims note at the foot of this document. | — |
| ~~`components/forms/InquirySuccess.tsx`~~ | **Done 2026-07-30.** One approved line — "Thanks — we will be in touch within two business days." — and **the supporting paragraph was deleted rather than rewritten.** No copy was supplied for it, and a confirmation that has said the one thing a reader needs does not need a second sentence. The panel is now heading plus "Send another message". | — |

---

## Artwork

Real photography landed for two slots on 2026-07-30 and for ten more on
2026-08-02. **One image slot is still a solid-colour placeholder** — the location
map — and that is the complete list. The Monterra Bay hero and both Monterra
Ridge floor plans were supplied on 2026-08-02; the plans were briefly dropped
from the frontmatter earlier that day and restored when the real drawings
arrived. Struck-through rows are done and are kept as a record of what was
supplied and what is still wrong with it.

| Slot | State | Who |
| --- | --- | --- |
| ~~`public/process/stage-0*`~~ | **Real, 2026-07-30.** Five photographs, WebP, 1920x1072. `OffsetFeature` sets no `aspect-*`, so intrinsic dimensions drive the box and nothing is cropped. | — |
| ~~`public/team/*.webp`~~ | **Real, 2026-07-30.** Four portraits. See the note below on the crop. | — |
| ~~`public/about/team-photo.webp`~~ | **Removed 2026-08-02**, with the `TeamPhoto` section that held it and its unit test. It was the same frame as the story image below, so `/about` showed one photograph twice. The full-measure treatment and the caption "The team at the Austin office, where every project starts." are recoverable from the history if a second, distinct group shot is ever supplied. | — |
| `components/ui/Logo.tsx`, `components/ui/logoPaths.ts` | A redrawn logo. The current mark is auto-traced from the supplied artwork and still carries tracer artefacts. Already on the deferred list in `docs/build-increments.md`. | You (commission) |
| Favicon set | Derived from the redrawn monogram, once it exists. | You |
| `components/layout/PageHero.tsx` | A flat navy band with a scrim, on `/about`, `/process`, `/team`, `/projects`, `/contact` and `/privacy`. **It has no image slot at all** — there is no `<Image>` to swap, so this is a component change, not an asset drop. A group photograph was offered for `/team` on 2026-07-30 and declined: the band is 3.37:1 at 1280x380 and a 16:9 source centre-cropped cuts the heads off, and one photographed hero among six flat ones costs more in consistency than it buys. | Client + you |
| `components/project/LocationBlock.tsx` | Still a placeholder at a map's aspect ratio. Alt text done 2026-07-30 — "Map showing the project location". Needs either a real map or a decision to drop the block. | You |
| ~~`content/projects/monterra-ridge/hero.webp` + `gallery/01-04`~~ | **Real, 2026-08-02.** Hero 1920x1072 (source frame kept whole — the band is 100vw at a fixed height with `object-cover`, so no ratio is imposed); gallery 1600x1067, cropped to exactly the 3:2 the thumbnail's `aspect-[3/2]` asks for. Sized for the lightbox at 85vw, not the 336px thumbnail. All five alts rewritten against the photographs. **Two defects in the supplied files:** two adjacent front doors in the hero both carry the number 108, and the wall oven in the kitchen shot has a garbled badge on its trim (illegible at any rendered size). Neither is worth a re-export on its own. | Client (re-export, low priority) |
| ~~`content/projects/monterra-ridge/plans/plan-a,b.webp`~~ | **Real, 2026-08-02.** Two three-plate drawings, 1024x687 lossless WebP — 222KB and 648KB. Lossless is deliberate and the weight is not the delivered weight: `next/image` re-encodes to lossy AVIF at request time, so the browser never downloads these files. They replace the solid-colour `plan-a,b.png`, which are **deleted** — `scripts/generate-placeholders.mjs` would write them again if it were ever re-run. **No PDF was supplied, so no row renders a download.** `plan-a.pdf` is still on disk and still generated, but it is the 554-byte solid placeholder and nothing links to it: it stays only as a `project-media.test.ts` fixture, which is what keeps the resolver's pdf branch covered now that no content authors one. Drop a real drawing set in and the download returns by adding the `pdf:` key back. **Plan B's source had "Plan B" set into the artwork** while the component renders its own label, so the title was patched out with background lifted from the same image rather than cropped, which keeps both plates at one 1.491 ratio. The two alts describe every room the drawings label. The block was briefly dropped earlier the same day and restored; the alts no longer state square footages, so `sqftRange` is unbracketed by any copy. | — |
| ~~`content/projects/the-larkin/hero.webp` + `gallery/01-04`~~ | **Real, 2026-08-02.** Same sizing rule as Monterra Ridge. Five storeys, brick corner, Denver mountains on the horizon — all matching the copy. The gallery 02 alt no longer describes a roof deck: that slot is now the lobby. **Two things to know:** the building's own name is legible signage in three of the five frames (retail sign, lobby desk plaque), approved on 2026-08-02 as the project's own name rather than foreign branding; and `gallery/01` carries a reversed, half-cropped sign at its extreme right edge, which is a rendering defect worth a re-export. | Client (re-export of gallery/01) |
| ~~`content/projects/monterra-bay/hero.webp`~~ | **Real, 2026-08-02.** `building1-5.png` was rejected earlier the same day for showing no water against copy that said "waterfront" four times. That was resolved the other way instead: the copy dropped every waterfront claim — summary, body, SEO description and alt — and the image was accepted. 1920x1072 WebP q86, 323KB, same sizing rule as the other two heroes. `hero.png` is deleted. **The site is inland**, and the page no longer says otherwise anywhere; if a waterfront parcel is ever what this becomes, the copy is what has to change back. The rendering is a tall tower, not the mid-rise it was described as — nothing on the page states a height, so the two do not contradict, but a storey count added later has to be checked against the frame. | — |
| ~~`public/home/positioning.webp`~~ | **Real, 2026-08-02.** Replaces `positioning-placeholder.png`, which is deleted, along with its entry in `scripts/generate-placeholders.mjs` — nothing under `public/home/` is generated now. 1200x670 WebP q90, 253KB, resized whole from a 2752x1536 source. 1200 is the widest the offset slot can request, the same ceiling as `public/about/story.webp`; the height is 670 rather than 675 because the source is 1.792, not 16:9, and `OffsetFeature` imposes no aspect box, so the frame was kept whole rather than cropped to a ratio nothing asks for. Not `priority`: it sits below the fold. **Two things to know about the frame:** the site hoardings carry Monterra's own name and tagline, approved 2026-08-02 as the company's own site rather than foreign branding; and the drawing on the table carries reversed lettering, accepted the same day and deliberately not cropped out. The alt quotes neither. | — |
| ~~`public/about/story.webp`~~ | **Real, 2026-08-02.** Replaces `story-placeholder.png`, which is deleted. 1200x675 WebP q90, 121KB, resized from the same 1672x941 source as `team-photo.webp` — 1200 is the widest the offset slot can request, since the container caps at 1200px and the column renders at most 527 CSS px. Not `priority`: it sits below the hero. It is now the only photograph on `/about`. **One defect in the supplied file:** the sign behind the group reads "BULLDNG COMMUNITIES", not "BUILDING" — not legible at the 456px this slot renders at, but a corrected export would replace this file at the same path and dimensions with no code change. | Client (re-export) |
| `public/home/home-hero.webp` | **Not a placeholder** — real photography since increment 8. **Swapped 2026-08-02** from a street-level avenue to an elevated golden-hour view of a residential tower cluster, replaced in place at the same path so the reference and both e2e assertions hold. Still 2560x1429 and still `priority` — it is the LCP element on the site's most-visited route. WebP q58, 382KB, down from a 9.6MB source: 2560 wide and a sub-400KB ceiling together force that quality, and the 62% navy scrim is what makes it hold up. **Three signs in the frame carry garbled lettering, one of them large and near the front** — accepted on instruction 2026-08-02, not cropped, and not quoted in the alt. A cleaner export would replace this file at the same path and dimensions with no code change. Listed here so nobody replaces it by accident. | Client (re-export, optional) |

**The Larkin's roof deck has no photograph.** The 2026-08-02 set supplied two
exteriors and three interiors — lobby, living room, bike store — and no roof
deck. The body copy still ends its second paragraph with "The shared roof deck
faces the mountains.", and "Shared roof deck" is still an amenity. Both are now
unevidenced by any image on the page. Nothing is broken and no copy was changed;
either a roof deck frame is supplied, or that sentence is rewritten.

**The portrait crop.** The four supplied portraits are 9:16 full-length standing
shots and the card is 4:5, so cover shows 70% of the frame. `TeamGrid` pins that
to `object-top`, which gives head and torso and cuts the shoes — approved as the
intended framing on 2026-07-30. Two consequences worth knowing: the subject sits
small in frame because these are wide environmental shots, so the illuminated
Monterra sign behind reads larger than the person; and **if a portrait is ever
resupplied already cropped to 4:5, `object-top` stops mattering rather than
starting to fight it.** The name-to-face mapping came from the supplied
filenames, not from anyone identifying the people.

---

## Internal only — not public

Worth finishing, but nothing here is indexed or shipped to a visitor.

| File | What it needs | Who |
| --- | --- | --- |
| `app/styleguide/page.tsx` (1) | The note on the logo section, which will be obsolete once the mark is redrawn. | You |
| `app/styleguide/_components/PrimitiveGallery.tsx` (3) | Sample strings demonstrating the primitives. Fine to leave marked — they are `noindex` and they carry the marker, which is what makes them obviously samples. Worth knowing that one of them attributes a quote to "Elena Marsh, Managing Partner", a third spelling of a role that is "Founder and Principal" everywhere real. It is marked, so it is not drift; **do not unmark it without fixing the title.** | You |

---

## Placeholder, but carrying no marker

**These do not appear in a `grep` for `[REPLACE]`.** They were left unmarked on
purpose so that links work and layouts hold, which also means nothing will flag
them before launch. Check this list by hand.

| Where | What is actually placeholder |
| --- | --- |
| `lib/site.ts` — the whole `contact` block | Unmarked since 2026-08-02 and rendering as real on every route: address, phone, email and hours. **Every one of them is invented.** The `mailto:` and `tel:` targets are well-formed so the links function, which means a reader can dial a number that does not ring and mail an inbox nobody reads. This is now the most convincing untrue thing on the site, and the footer disclaimer is the only thing qualifying it. |
| `content/team.json` — `linkedin` | Two of the four are `example-<name>` URLs and resolve to nothing. Unmarked, and they are live external links on a public page. |
| `content/team.json` — the four people | Names, roles and bios are written and unmarked, but **these are invented people**. On a concept project that is fine and the footer says so; on a live site every one of them has to be replaced with someone real. |
| `app/privacy/page.tsx` — the policy | Unmarked and readable, but it describes what *would* happen rather than what does, because nothing is wired up. Its first paragraph is what makes that honest. |
| `lib/seo.ts` — the eight page descriptions | Clean of markers by design, because a marker would be published into search results and eat 10 of the 160 characters. **They are still unapproved copy.** The `/about` one was corrected from 2008 to 2014 on 2026-07-29 — it had begun contradicting the company story on the same page. The `/` one says "across Texas, Florida and Colorado" where the hero says "Austin, Tampa and Denver": the same three places at different granularity, consistent today, but they move together. |
| `content/projects/*/index.mdx` — `seo.description` | Same as above: clean, deliberately unmarked, unapproved, and each states unit counts and dates as fact. Monterra Bay's said the site was "bought in 2026" where the body approved on 2026-07-30 says only that we have been trying to buy it since 2021. **The clause was cut on 2026-07-30** rather than rewritten — removing a claim the approved copy contradicts is a correction; writing a new one would have been inventing. Monterra Ridge's still says the first homes are handed over "in late 2027" where the body and the frontmatter both say Q3 — soft, but the same kind of drift. |
| `content/projects/*/index.mdx` — every alt string | Written and unmarked as of 2026-07-30, but written against solid-colour placeholders. They describe images that do not exist yet. Every one has to be checked against the real photograph when it lands, and the same goes for the `Positioning` and `CompanyStory` alts. **The process and team alts are no longer in this category** — they were rewritten on 2026-07-30 against the photographs that actually shipped. |
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
