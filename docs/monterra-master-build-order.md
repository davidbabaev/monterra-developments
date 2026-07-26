# Master build order — Monterra Developments website

`[type: feature | greenfield]`

> Paste this into Claude Code **after** CLAUDE.md exists. This is the full product spec.
> Do not execute it in one run — Step 8 splits it into committed increments.

---

## Context

Greenfield marketing website for **Monterra Developments**, a US real estate development company that builds and sells apartments and houses. This is a corporate/brochure site, not an application: no auth, no payments, no dashboards, no marketplace. The single conversion goal is an inquiry submission.

Repository is new and empty. Nothing to migrate.

---

## Stack (pinned — do not substitute)

| Concern | Choice |
|---|---|
| Framework | Next.js 16.x, App Router, **fully static** |
| Language | TypeScript, `strict: true` |
| Runtime | Node.js 20+ |
| Bundler | Turbopack (Next 16 default) |
| Styling | Tailwind CSS v4, CSS-first `@theme` config |
| Content | MDX files on disk + `gray-matter` + Zod validation |
| MDX rendering | `next-mdx-remote/rsc` |
| Fonts | `next/font/google`, self-hosted at build |
| Forms | React Hook Form + Zod resolver |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright |
| Deploy | Vercel |

Scaffold with `npx create-next-app@latest` (TypeScript, Tailwind, App Router, ESLint, `src/` **no**, import alias `@/*`). Record the exact resolved versions in CLAUDE.md §2 after install.

Every route is statically generated. No route may opt into dynamic rendering. Middleware/`proxy.ts` is not used.

---

## Directory structure

```
monterra-developments/
├── app/
│   ├── layout.tsx                    root: fonts, header, footer, metadata base
│   ├── page.tsx                      Home
│   ├── not-found.tsx                 404
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx           default OG card
│   ├── projects/
│   │   ├── page.tsx                  listing + status filter
│   │   └── [slug]/
│   │       ├── page.tsx              detail (generateStaticParams)
│   │       └── opengraph-image.tsx   per-project OG card
│   ├── about/page.tsx
│   ├── process/page.tsx
│   ├── team/page.tsx
│   ├── contact/page.tsx
│   └── privacy/page.tsx
├── components/
│   ├── layout/    Header MobileNav Footer Container Section SectionHeading SkipLink
│   ├── ui/        Button Card Eyebrow StatusBadge Input Textarea Select FieldError ElevationRule
│   ├── project/   ProjectCard ProjectGrid StatusFilter ProjectHero SpecTable AmenityList
│   │              Gallery Lightbox FloorPlanList LocationBlock InquiryCta
│   ├── home/      Hero FeaturedProjects StatsBand ProcessPreview
│   └── forms/     ContactForm
├── content/
│   ├── projects/
│   │   ├── monterra-ridge/  index.mdx + hero.jpg, gallery/*, plans/*
│   │   ├── monterra-bay/    index.mdx + hero.jpg
│   │   └── the-larkin/      index.mdx + hero.jpg, gallery/*
│   └── team.json
├── lib/
│   ├── schema.ts        Zod schemas (project, team, contact form)
│   ├── projects.ts      loader: read, parse, validate, sort, filter
│   ├── seo.ts           buildMetadata() helper
│   └── site.ts          site-wide constants: name, tagline, nav, contact, socials
├── public/
│   ├── logo/            monterra-horizontal.svg, -dark.svg, monogram.svg
│   └── favicon files
├── styles/globals.css   @theme tokens
├── tests/
│   ├── unit/            schema, loader, filter, form validation
│   └── e2e/             navigation, filter, form, responsive
├── CLAUDE.md
└── README.md
```

Folder names must match the words used in prompts. Keep every component file single-responsibility.

---

## Design system

### Tokens — `styles/globals.css`, Tailwind v4 `@theme`

```css
@import "tailwindcss";

@theme {
  /* Color */
  --color-navy:      #14263D;   /* primary: headers, footer, headings, primary buttons */
  --color-stone:     #C8B9A3;   /* secondary: section backgrounds, borders, decorative */
  --color-bronze:    #A87842;   /* accent: active nav, hover, numerals, rules — sparingly */
  --color-ivory:     #F7F5F0;   /* page background — never pure white for large areas */
  --color-surface:   #FFFFFF;   /* cards, content panels */
  --color-ink:       #252A30;   /* body text */
  --color-slate:     #66707A;   /* metadata, labels, captions, dates */

  /* Type */
  --font-display: var(--font-manrope);
  --font-body:    var(--font-inter);
  --font-editorial: var(--font-cormorant);

  /* Radius — architectural restraint, not soft */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;

  /* Spacing rhythm: 4px base. Section vertical padding */
  --space-section-mobile:  64px;
  --space-section-desktop: 120px;
}
```

### Type scale

| Role | Font | Size (mobile → desktop) | Weight | Tracking |
|---|---|---|---|---|
| Hero headline | Manrope | 36px → 64px | 700 | -0.02em |
| Page title (h1) | Manrope | 32px → 52px | 600 | -0.02em |
| Section heading (h2) | Manrope | 26px → 38px | 600 | -0.01em |
| Card / sub heading (h3) | Manrope | 19px → 22px | 600 | normal |
| Eyebrow | Manrope | 12px | 600 | 0.14em, uppercase |
| Body | Inter | 16px → 17px | 400 | normal, line-height 1.65 |
| Body large (intro) | Inter | 18px → 20px | 400 | line-height 1.6 |
| Metadata / label | Inter | 13px | 500 | 0.04em, uppercase |
| Editorial pull-quote | Cormorant Garamond | 26px → 38px | 300 italic | normal |

Cormorant appears **at most twice per page**, and never in navigation, buttons, forms, or body copy.

Max body measure: 68 characters.

### Signature element — the elevation rule

The logo is built from hairline architectural outlines. Carry that one idea through the site as the memorable element:

`ElevationRule` is a 1px bronze horizontal line that sits beneath every section eyebrow. On scroll into view it draws from 0 → 48px width over 500ms with `ease-out`. Under `prefers-reduced-motion: reduce`, it renders at full width with no animation.

This is the only decorative motif. Spend the boldness here and keep everything else quiet — no gradients, no shadows heavier than `0 1px 3px rgba(20,38,61,0.06)`, no glassmorphism, no floating blobs.

### Buttons

| Variant | Default | Hover | Focus |
|---|---|---|---|
| Primary | navy bg, white text, radius-sm | bronze bg, 150ms | 2px bronze ring, 2px offset |
| Secondary | transparent, 1px navy border, navy text | navy bg, white text | same |
| Text link | navy text, 1px transparent underline | bronze text, bronze underline | same |

Minimum hit target 44×44px everywhere.

### Cards

White surface on ivory page. 1px `stone` border. `radius-md`. No shadow at rest; on hover the border shifts to bronze and the card lifts 2px over 200ms. Entire card is one link; the "View project" text is styled, not a nested anchor.

### Imagery

Architectural photography, generous crops, no people-heavy stock. All images through `next/image` with explicit dimensions. Hero images `priority`; everything below the fold lazy. Aspect ratios: hero 16:9 desktop / 4:5 mobile, cards 3:2, gallery 3:2.

### Contrast requirement

Bronze `#A87842` on ivory `#F7F5F0` is approximately 3.4:1 — **fails WCAG AA for body text**. Bronze is permitted only for: large text ≥24px, decorative rules, icons paired with a text label, and non-text UI borders. Never for paragraph text, form labels, or small links. Verify every bronze usage with a contrast check.

---

## Content layer

### Zod schema — `lib/schema.ts`

```ts
const media = z.object({ src: z.string(), alt: z.string().min(1) });

const projectBase = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "current", "upcoming"]),
  location: z.object({
    city: z.string(),
    state: z.string().length(2),
    address: z.string().optional(),
    coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  specs: z.object({
    propertyTypes: z.array(z.string()).min(1),
    units: z.number().int().positive().optional(),
    sqftRange: z.string().optional(),
    completion: z.string().optional(),
  }),
  summary: z.string().min(40).max(220),
  amenities: z.array(z.string()).optional(),
  media: z.object({
    hero: media,
    gallery: z.array(media.extend({ caption: z.string().optional() })).optional(),
    floorPlans: z.array(z.object({
      label: z.string(),
      image: z.string(),
      pdf: z.string().optional(),
    })).optional(),
  }),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
});
```

**Conditional validation by status** — refine the base schema:

- `completed` → `specs.completion` **required**, `media.gallery` **required** with ≥3 items
- `current` → `specs.completion` **required**
- `upcoming` → only `hero`, `summary`, `location.city/state`, `specs.propertyTypes` required; everything else optional

A file that fails validation must **fail the build** with a message naming the file and the offending field. Never render a partial project.

### Loader — `lib/projects.ts`

```ts
getAllProjects(): Project[]              // sorted by `order` asc
getProjectBySlug(slug): Project | null
getFeaturedProjects(limit = 3): Project[]
getProjectsByStatus(status): Project[]
getAdjacentProjects(slug): { prev, next } // wraps around
```

Read from disk at build time only. Images are colocated with each project and referenced relatively; resolve to importable paths so `next/image` gets intrinsic dimensions.

### Seed content

Create the three projects from the approved sample data: `monterra-ridge` (current, full), `monterra-bay` (upcoming, minimal), `the-larkin` (completed, SEO override). Placeholder text is marked `[REPLACE]`. Use solid-color placeholder images at correct aspect ratios where real photography is missing — never a broken image, never a third-party placeholder service.

---

## Pages

### Global — header, footer, navigation

**Header.** Sticky, full-width. Ivory background at scroll-top with no border; after 40px scroll it gains `rgba(247,245,240,0.92)` + `backdrop-blur-sm` + 1px stone bottom border, transitioning over 200ms.

- Desktop ≥1024px: horizontal logo left, nav center-right (Projects · About · Our Process · Team), "Contact us" primary button far right. Active route gets a 2px bronze underline. Hover on inactive gives bronze text.
- Mobile <1024px: monogram + wordmark left, hamburger right (44×44). Tapping opens a **full-screen navy overlay** — not a slide-in drawer — with links in Manrope 28px ivory, staggered fade-in 40ms apart, "Contact us" as a full-width bronze button at the bottom. Close via X, Escape, or route change. Body scroll locks while open. Focus is trapped; on close, focus returns to the hamburger.

**SkipLink** — visually hidden until focused, jumps to `#main`.

**Footer.** Navy background, ivory text.
Row 1: four columns — logo + tagline + one-line description / Company (About, Our Process, Team) / Projects (Completed, Current, Upcoming — deep links to filtered listing) / Contact (address, phone, email, socials).
Row 2: 1px stone divider, then `© {year} Monterra Developments` left, Privacy Policy right.
Mobile: columns stack, contact first.

---

### Home — `app/page.tsx`

Section order, top to bottom:

1. **Hero** — full-bleed architectural image, navy scrim at 45% opacity for text contrast. Manrope 700 headline (`[REPLACE]` — a claim about building, not selling). One-line Inter subhead. Two CTAs: "View our projects" (primary) + "Start a conversation" (secondary). Desktop 88vh, mobile 78vh so the next section peeks and signals scroll.
2. **Positioning statement** — ivory background, centered, max 3 lines, set in Cormorant Garamond. This is one of the two allowed editorial moments.
3. **Featured projects** — eyebrow "Selected work" + ElevationRule. Three `ProjectCard`s in a row on desktop, horizontal snap-scroll carousel on mobile (cards 82vw with a peek of the next). "View all projects" text link below.
4. **Stats band** — stone background. Four figures in Manrope 600 bronze at 40px with Inter slate labels beneath: units delivered, years in operation, markets, projects completed. Numbers count up on scroll into view; static under reduced-motion. `[REPLACE]` all values.
5. **Process preview** — three steps with numerals 01/02/03 (numbering is legitimate here — it is a real sequence). Each: numeral, title, two lines. "How we build" link to `/process`.
6. **Closing CTA** — navy full-bleed band, headline + "Contact us" primary button.

### Projects listing — `app/projects/page.tsx`

1. Page header: h1 "Projects", one-line intro, ElevationRule.
2. **StatusFilter** — four pill buttons: All · Current · Completed · Upcoming, each showing a count. Selected pill is navy with white text; others are 1px stone outline. State lives in the URL as `?status=current` via `useSearchParams` so filtered views are linkable and shareable (the footer deep-links here). Filtering is instant client-side over the prebuilt list — no loading state, no refetch.
3. **ProjectGrid** — 3 columns ≥1280px, 2 columns 768–1279px, 1 column <768px. Gap 32px desktop / 20px mobile.
4. **Empty state** — when a filter matches nothing: stone-outlined panel, heading "No projects in this stage yet", one line of explanation, and a "View all projects" button that clears the filter. Required even though it cannot trigger with three seeded projects.

**ProjectCard** — image (3:2, `object-cover`), `StatusBadge` pinned top-left on the image, then title (h3), `city, ST` in slate, and a metadata line.

- `completed` / `current` variant metadata: `{propertyTypes.join(" · ")} · {units} units · {completion}`
- **`upcoming` variant**: metadata reduces to `{propertyTypes.join(" · ")} · {city}, {ST}`, the badge reads "Upcoming", and the CTA text is "Register interest" instead of "View project". This variant is mandatory — Monterra Bay has no units and no completion date, and the card must read as intentional rather than broken.

`StatusBadge` colors: completed → navy bg/white text; current → bronze bg/white text; upcoming → stone bg/navy text.

### Project detail — `app/projects/[slug]/page.tsx`

`generateStaticParams` from the loader. Unknown slug → `notFound()`.

Fixed section order. **Optional sections render nothing at all when their data is absent — no empty headings, no "TBA" placeholders.**

1. **ProjectHero** — full-bleed hero image, navy scrim, overlaid: `StatusBadge`, h1 title, `city, ST`. Breadcrumb "Projects / {title}" above the title, navy on the scrim.
2. **Overview** — two columns on desktop: left is the MDX body (long-form narrative, max 68ch); right is a sticky `SpecTable` (property types, units, sq ft range, completion, status). Single column on mobile, spec table first. *Sticky only ≥1024px.*
3. **Location** — city/state/address in Inter. If `coords` exist, render a static map image with a link that opens directions in a new tab; if not, render the address block alone. No embedded interactive map — it costs an API key and a large script for negligible value.
4. **Amenities** *(optional)* — two-column list on desktop, one on mobile. Each item gets a small bronze line-icon plus its label; icon and label together, never icon alone.
5. **Gallery** *(optional)* — masonry-ish grid, 3 columns desktop / 2 tablet / 1 mobile. Click opens `Lightbox`: full-viewport navy backdrop at 96%, image centered, caption below in slate, prev/next arrows, counter "3 / 12". Keyboard: `←` `→` navigate, `Esc` closes. Focus trapped inside, returns to the triggering thumbnail on close. Swipe left/right on touch.
6. **Floor plans** *(optional)* — one row per plan: label, thumbnail, and a "Download PDF" secondary button when `pdf` is present. The button opens in a new tab with `rel="noopener"`; when `pdf` is absent, the row shows the image only with no dead button.
7. **Development status** — a horizontal three-node tracker (Upcoming → Current → Completed) with the project's node filled bronze and the others stone outline. Small, quiet, one line of context beneath.
8. **InquiryCta** — navy band: "Interested in {title}?" + "Contact us about this project" button linking to `/contact?project={slug}`, which pre-selects the project in the contact form's dropdown.
9. **Prev / next** — two-up navigation to adjacent projects by `order`, wrapping at the ends. Each shows a thumbnail, title, and direction arrow.

### About — `app/about/page.tsx`

Page title + intro → company story (MDX-free, plain content from `lib/site.ts` for now, `[REPLACE]`) → values grid (3 or 4 items: eyebrow, title, two lines) → one Cormorant pull-quote from leadership → stats band reused from Home → CTA band.

### Our Process — `app/process/page.tsx`

Five numbered stages, alternating image-left/image-right on desktop, stacked with image-above on mobile. Numerals 01–05 in Manrope 600 bronze at 48px. Each stage: numeral, title, one paragraph, and a short outcome line. Ends with a CTA band. Numbering is meaningful here — it is a real sequence.

### Team — `app/team/page.tsx`

Data from `content/team.json`, Zod-validated: `name, role, bio, photo{src,alt}, linkedin?`.
Grid: 4 columns ≥1280px, 2 at 768–1279px, 1 below. Portrait 4:5 grayscale by default, transitioning to full color on hover over 300ms; always full color on touch devices (no hover). Name (h3), role in bronze uppercase metadata, two-line bio. LinkedIn icon link only when present. `[REPLACE]` all members.

### Contact — `app/contact/page.tsx`

Two columns on desktop (form 60% / details 40%), stacked on mobile with the form first.

**ContactForm** fields: Full name*, Email*, Phone, Project of interest (select: General enquiry + all project titles), Message*.

- Validation with Zod via React Hook Form, `mode: "onBlur"`. Errors appear beneath the field in a 13px error color, with `aria-invalid` and `aria-describedby` wired to the message.
- Reads `?project=` from the URL and pre-selects that option.
- Submit is a **stub**: `lib/submitInquiry.ts` validates, waits 800ms, logs the payload, resolves `{ ok: true }`. Wire the UI as if it were real so swapping in a destination later touches one file. Add a `TODO: connect destination` comment.
- **All four states required and reachable:** idle · submitting (button disabled, label "Sending…", spinner, fields locked) · success (form replaced by a stone-bordered panel: "Thanks — we'll be in touch within two business days" plus a "Send another message" reset) · error (a stone/red banner above the form, "Something went wrong. Please try again or email us directly at {email}." — the form keeps every value entered).
- Never clear the form on error.

Right column: office address, phone (`tel:`), email (`mailto:`), business hours, social links.

### Privacy — `app/privacy/page.tsx`

Single prose column, max 68ch. `[REPLACE]` full policy text — a real one is required before launch.

### 404 — `app/not-found.tsx`

Ivory, centered. Large Manrope "404", one line ("This page has not been built."), two buttons: "Back to home" and "View projects". Do not send a bare Next.js default.

---

## SEO & metadata

- `metadataBase` set in root layout. Title template: `%s | Monterra Developments`.
- Every page exports `metadata` with a unique title and a 150–160 char description. Project pages use `seo.title`/`seo.description` when present, otherwise derive from `title` and `summary`.
- One `<h1>` per page. Heading levels never skip.
- OG images: a default card at `app/opengraph-image.tsx`, and a per-project card at `app/projects/[slug]/opengraph-image.tsx` generated via `ImageResponse` — navy background, monogram, project title, `city, ST`. Twitter card `summary_large_image`.
- `sitemap.ts` enumerates all static routes plus every project slug. `robots.ts` allows all and points to the sitemap.
- JSON-LD: `Organization` in the root layout; `Place` (or `Residence`) on each project page when `coords` exist.
- Canonical URL on every page.

## Performance

- Lighthouse targets on the production build: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 100.
- Three font families is a real cost: load Manrope and Inter with `display: "swap"` and only the weights listed in the type scale. Load **Cormorant Garamond in a single weight (300) with `preload: false`** — it appears at most twice per page.
- Hero image `priority`; everything else lazy. `sizes` set correctly on every `next/image` so mobile never downloads desktop assets.
- No client-side JS beyond what genuinely needs it: the mobile nav, the status filter, the lightbox, the stats counter, and the contact form. Everything else stays a server component.

## Accessibility

- Keyboard-reachable end to end; visible bronze focus ring on every interactive element.
- Focus trapped and restored in the mobile nav overlay and the lightbox.
- Every image has meaningful `alt`; decorative images get `alt=""`.
- Form inputs have real `<label>` elements, never placeholder-as-label.
- `prefers-reduced-motion: reduce` disables the elevation rule draw-in, the stat count-up, the card lift, and all scroll reveals.
- Landmarks: `header`, `nav`, `main#main`, `footer`. Skip link present.

## Responsive — three designed layouts

| | 390px | 768px | 1280px |
|---|---|---|---|
| Nav | hamburger → full-screen navy overlay | hamburger | horizontal, full |
| Home hero | 78vh, 4:5 image, headline 36px, CTAs stacked full-width | 84vh, headline 48px | 88vh, 16:9, headline 64px, CTAs inline |
| Featured projects | snap-scroll carousel, 82vw cards | 2-up grid | 3-up grid |
| Project grid | 1 col | 2 col | 3 col |
| Detail overview | stacked, specs first | stacked | 2 col, sticky specs |
| Gallery | 1 col | 2 col | 3 col |
| Team | 1 col | 2 col | 4 col |
| Contact | stacked, form first | stacked | 60/40 |
| Section padding | 64px | 88px | 120px |

---

## Testing

**Unit (Vitest)**
- Zod schema accepts all three seed projects
- Schema rejects: a `completed` project with no gallery; a `current` project with no completion; a gallery image with an empty `alt`
- `getAllProjects` sorts by `order`
- `getProjectsByStatus` filters correctly and returns `[]` for an unmatched status
- `getAdjacentProjects` wraps at both ends
- Contact form schema rejects a malformed email and an empty message

**E2E (Playwright)** — run at both 390×844 and 1280×800
- Home → Projects → a project detail → Contact, via visible UI only
- Status filter changes the visible cards **and** the URL; a direct visit to `?status=upcoming` renders pre-filtered
- Empty state renders when a filter matches nothing (force it with a mocked empty set)
- Mobile nav: opens, traps focus, closes on Escape, closes on route change
- Lightbox: opens, arrow keys navigate, Escape closes, focus returns to the thumbnail
- Contact form: submit with errors shows field-level messages; a valid submit shows the success panel; the project dropdown pre-selects from `?project=monterra-ridge`
- 404 renders for an unknown slug
- `axe` accessibility scan on Home, Projects, a project detail, and Contact — zero critical violations

---

## Done-when (behavioral — observable in a browser, not "tests pass")

- [ ] All nine routes load with no console errors and no hydration warnings
- [ ] The three seeded projects appear on `/projects`; each card links to a working detail page
- [ ] **Monterra Bay** (upcoming, minimal data) renders a complete, intentional-looking card and detail page — no empty headings, no blank spec rows, no broken images, and its CTA reads "Register interest"
- [ ] **The Larkin** detail page shows its gallery, and the lightbox opens, navigates with arrow keys, and closes with Escape
- [ ] Filtering to "Upcoming" shows exactly one card and changes the URL; reloading that URL keeps the filter
- [ ] The filter empty state is reachable and offers a way back
- [ ] Contact form: all four states are watchable — idle, submitting, success, error. On error, the entered values survive.
- [ ] Clicking "Contact us about this project" from Monterra Ridge lands on `/contact` with "Monterra Ridge" already selected
- [ ] Mobile nav at 390px: opens full-screen, Tab stays inside it, Escape closes it, focus returns to the hamburger
- [ ] Every page renders correctly at **390px, 768px, and 1280px** — no horizontal scroll at any width
- [ ] Keyboard-only pass through Home and Contact: every interactive element is reachable with a visible focus ring
- [ ] With OS reduced-motion enabled, no scroll animation, count-up, or rule draw-in plays
- [ ] Each page's `<title>` and meta description are unique; view-source confirms it
- [ ] `/sitemap.xml` lists all static routes plus all three project slugs
- [ ] A production build (`next build`) succeeds with zero TypeScript errors and zero ESLint errors
- [ ] Deliberately corrupting one MDX frontmatter field **fails the build** with a message naming the file and field
- [ ] Lighthouse on the production build hits the four targets above

---

## Decisions (pre-answered — decide and continue, do not stop to ask)

- **New repository** named `monterra-developments`. The existing `aiFirstWebsite` Vite scaffold is a separate learning sandbox and is not touched, migrated, or referenced.
- **Fully static.** No API routes, no server-side data fetching, no `proxy.ts`.
- **No CMS, no database.** MDX on disk is the content layer.
- **No interactive map.** Static map image plus a directions link, or an address block alone.
- **Filters:** status only. No city, price, or property-type filters at this scale.
- **Contact form has no destination.** Stub it behind one swappable module.
- **Placeholder assets:** solid-color images at the correct aspect ratio. Never a broken image; never an external placeholder service.
- **Copy:** write plausible, brand-appropriate English marked `[REPLACE]`. Sentence case, active voice, plain verbs. Do not write "elevate", "curated", "bespoke", "nestled", "unparalleled", or "luxury living".
- **`aria-current="page"`** on the active nav link, in addition to the bronze underline.
- Anything else not specified here: follow the convention already established elsewhere in this codebase before inventing a new one.

---

## Guardrails

- Work on a branch: `ai/<type>-<short-description>`. **Never commit to `main`.**
- Never touch `.env` files.
- Do not add dependencies beyond the pinned stack without saying why in the commit message.
- Do not install a UI component library. Components are built from the tokens above.
- Do not modify this build order document.
- Every increment ends with the full test suite passing **before** the commit.
