# Build increments — Monterra Developments

Eleven increments. Each ends in a **testable state and a commit**. Run them in order; do not start one before the previous is reviewed and merged.

**Two documents are required context for every increment:**
- `docs/master-build-order.md` — the full spec
- `docs/design-reference.md` — the authoritative visual spec

**Standing rules for every increment**
- Work on the named branch. Never commit to `main`.
- Full test suite passes **before** the commit, not after.
- End each run with a review packet: what was built, screenshots at 390px and 1280px for each new state, what was verified in-browser, decisions taken, anything deferred.
- "Tests pass" is not "done." Done is observed behavior.

**Sequencing logic:** the content layer is the riskiest foundation, so it is proved with unit tests before a single pixel is designed. Design tokens come next, then the shell, then pages. Nothing is layered on an unproven base.

---

## 1 · Scaffold, tooling, deploy

`ai/setup-scaffold`

**Goal:** an empty but fully wired project, live on Vercel.

**Build**
- `npx create-next-app@latest` — TypeScript, Tailwind v4, App Router, ESLint, no `src/`, alias `@/*`
- Confirm Next 16.x, React 19.x, Node 20+
- Vitest + `@testing-library/react` + `jsdom`; script `test`
- Playwright with projects for 390×844 and 1280×800; script `test:e2e`
- Empty folder skeleton exactly as the master build order specifies
- One smoke unit test and one Playwright test asserting the home page returns 200
- `.gitignore` includes `.claude/settings.local.json`
- Push to GitHub, connect to Vercel, confirm a production deploy

**Done-when**
- `npm run dev` serves the default page with no console errors
- `npm run build` succeeds with zero TS and zero ESLint errors
- `npm test` and `npm run test:e2e` both pass
- The Vercel URL loads the same page

**Commit:** `chore: scaffold Next.js 16 project with Vitest, Playwright and Vercel deploy`

**Not yet:** no design tokens, no content, no components.

> **After this merges, write CLAUDE.md** against the real installed versions — read them out of `package.json`, do not assume. That is Phase 3 of the plan, not part of this increment.

---

## 2 · Content layer (no UI)

`ai/feat-content-layer`

**Goal:** prove that MDX + Zod can express all three projects and reject bad data. This is the risky foundation.

**Build**
- `lib/schema.ts` — the project Zod schema with **conditional validation by status** exactly as specified
- `lib/projects.ts` — `getAllProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getProjectsByStatus`, `getAdjacentProjects`
- Three seed files under `content/projects/<slug>/index.mdx` with `[REPLACE]` copy
- Solid-color placeholder images at the correct aspect ratios, colocated per project
- Image paths resolve so `next/image` receives intrinsic dimensions
- A validation failure **throws at build time** naming the file and the field
- `lib/site.ts` — site name, tagline, nav items, contact details

**Done-when**
- Unit tests pass: all three seeds validate; a `completed` project with no gallery is rejected; a `current` project with no completion is rejected; a gallery image with empty `alt` is rejected
- `getAllProjects` returns sorted by `order`; `getProjectsByStatus("upcoming")` returns exactly Monterra Bay; `getProjectsByStatus` returns `[]` for no match; `getAdjacentProjects` wraps at both ends
- Deliberately corrupting one frontmatter field makes `npm run build` fail with a message naming that file and field — **demonstrate this and revert it**

**Commit:** `feat: MDX content layer with Zod validation and three seed projects`

**Not yet:** nothing renders. No components, no pages.

---

## 3 · Design tokens, fonts, primitives

`ai/feat-design-system`

**Goal:** every visual primitive exists and is inspectable on one page.

**Build**
- `styles/globals.css` with the `@theme` token block
- `next/font/google`: Manrope (500/600/700), Inter (400/500), Cormorant Garamond (300). Cormorant preloaded — it appears above the fold in the heading lockup.
- Primitives: `Container`, `Section`, `Button` (primary/secondary/text, with the bronze arrow), `Card`, `Eyebrow`, `StatusBadge`, `StoneSlab`, `SplitHeading`, `StatBlock`, `PullQuote`, `SectionNumeral`
- `SplitHeading` takes `lede` and `rest`, renders the Cormorant-bronze + Manrope-navy lockup, accepts `as="h1" | "h2"`, and sets the Cormorant 8% larger to match x-height
- `/styleguide` page rendering every primitive, every button state, the full type scale, and all seven brand colors with their measured contrast ratios
- `noindex` on `/styleguide`; exclude it from the sitemap later

**Done-when**
- `/styleguide` shows every primitive correctly at 390px, 768px and 1280px
- The two-tone heading sits on a single baseline with no visible size mismatch
- Every button shows a visible bronze focus ring on keyboard focus
- No text/background pair on the page falls below its required ratio — **bronze-on-ivory appears only at ≥26px**, and no white or slate text sits on stone
- Fonts load without a visible reflow

**Commit:** `feat: brand design tokens, fonts and UI primitives`

**Not yet:** no header, no footer, no real pages.

---

## 4 · Layout shell

`ai/feat-layout-shell`

**Goal:** you can navigate the whole site skeleton on a phone and a desktop.

**Build**
- `Header` — sticky; transparent at scroll-top, gaining `rgba(247,245,240,0.92)` + blur + 1px stone border after 40px
- Desktop nav with bronze underline and `aria-current="page"` on the active route
- `MobileNav` — full-screen navy overlay, staggered link fade-in, focus trap, Escape to close, body scroll lock, focus returns to the hamburger
- `Footer` — navy, four zones, bottom copyright bar
- `ContactBand` — stone slab, three icon+label items, overlapping the footer's top edge on desktop, stacked with no overlap on mobile
- `PageHero` — inner-page hero with navy scrim, `SplitHeading`, subhead, and the offset stone breadcrumb slab
- `SkipLink`, root `layout.tsx`, and placeholder pages for all nine routes

**Done-when**
- Every route is reachable by clicking, at 390px and at 1280px
- At 390px the nav overlay opens full-screen, Tab stays inside it, Escape closes it, focus returns to the hamburger, and the page behind does not scroll
- The header's scroll transition fires at 40px and does not flicker
- The breadcrumb slab overlaps the hero on desktop and sits flush beneath it on mobile
- The contact band overlaps the footer on desktop only
- A keyboard-only pass reaches every interactive element with a visible focus ring
- No horizontal scroll at any width from 320px to 1920px

**Commit:** `feat: header, mobile nav, footer, contact band and page hero`

**Not yet:** pages are placeholders. No project content rendered.

---

## 5 · Projects listing

`ai/feat-projects-listing`

**Goal:** the three real projects appear, filter, and link.

**Build**
- `ProjectCard` with all three status variants — including the **upcoming variant**, which drops units and completion, and whose CTA reads "Register interest"
- `ProjectGrid` — 3 / 2 / 1 columns
- `StatusFilter` — four pills with counts, state held in the URL as `?status=`
- Empty state panel with a button that clears the filter
- `/projects` page assembled with `PageHero`

**Done-when**
- Three cards render; each links to a working detail route
- Monterra Bay's card looks deliberate, not broken — no blank metadata, no missing-image gap, CTA reads "Register interest"
- Clicking "Upcoming" shows one card and changes the URL; reloading that URL keeps the filter
- The footer's status deep-links land pre-filtered
- The empty state is reachable (force it) and its button restores all projects
- Correct at 390 / 768 / 1280

**Commit:** `feat: projects listing with status filter and card variants`

---

## 6 · Project detail

`ai/feat-project-detail`

**Goal:** all three project pages render completely, including the sparse one.

**Build**
- `app/projects/[slug]/page.tsx` with `generateStaticParams`; unknown slug → `notFound()`
- Sections in fixed order: hero → overview (MDX + sticky `SpecTable` ≥1024px) → `LocationBlock` → `AmenityList` → *(gallery slot, next increment)* → `FloorPlanList` → status tracker → `InquiryCta` → prev/next
- **Optional sections render nothing when absent** — no empty headings, no "TBA"
- `InquiryCta` links to `/contact?project={slug}`
- `app/not-found.tsx`

**Done-when**
- All three detail pages load with no console errors
- **Monterra Bay** shows no empty section, no orphan heading, no blank spec row — the page reads as intentionally short
- The Larkin shows its floor plan rows; a plan without a PDF shows no dead download button
- The spec table sticks at 1280px and sits above the prose at 390px
- Prev/next wraps from the last project to the first
- An unknown slug renders the custom 404, not the Next default
- Correct at 390 / 768 / 1280

**Commit:** `feat: project detail pages with conditional sections`

**Not yet:** gallery is a placeholder slot.

---

## 7 · Gallery and lightbox

`ai/feat-gallery-lightbox`

**Goal:** the most interaction-heavy component, isolated so it gets real attention.

**Build**
- `Gallery` — 3 / 2 / 1 column grid, `next/image` with correct `sizes`
- `Lightbox` — navy backdrop at 96%, centered image, caption, prev/next, counter, close
- Keyboard: `←` `→` navigate, `Esc` closes
- Focus trapped inside; returns to the triggering thumbnail on close
- Touch swipe left/right
- `aria-modal`, labelled dialog, background marked inert

**Done-when**
- Opening a thumbnail on The Larkin shows that exact image
- Arrow keys move through the gallery and the counter tracks
- Escape closes and focus lands back on the thumbnail that was clicked
- Tab never escapes the lightbox while it is open
- Swipe works at 390px and the close target is ≥44px
- With reduced-motion enabled, transitions are instant but the lightbox still functions
- Projects with no gallery render no gallery section at all

**Commit:** `feat: project gallery with accessible lightbox`

---

## 8 · Home

`ai/feat-home-page`

**Goal:** the six-section homepage.

**Build**
1. Hero — full-bleed image, navy scrim, two-tone headline, two CTAs, 78vh mobile / 88vh desktop
2. Positioning — offset composition (image + stone slab, 40px overlap), collapsing at <768px
3. Featured projects — three cards desktop, snap-scroll carousel at 82vw on mobile
4. Stats band — stone slab, four `StatBlock`s with vertical rules, count-up on scroll
5. Process preview — three steps, link to `/process`
6. Closing CTA — navy band

**Done-when**
- All six sections render at 390 / 768 / 1280
- The offset overlap is visible at 1280px and fully collapsed at 390px
- The mobile carousel snaps and shows a peek of the next card
- Stats count up once on scroll into view, and render as static final values under reduced-motion
- The hero leaves the next section peeking at 390px
- No layout shift on load (CLS < 0.1)

**Commit:** `feat: homepage with hero, featured projects and stats`

---

## 9 · Contact form

`ai/feat-contact-form`

**Goal:** all four form states are watchable, with no real destination.

**Build**
- `ContactForm` — React Hook Form + Zod, `mode: "onBlur"`
- Fields: name*, email*, phone, project of interest (select), message*
- Reads `?project=` and pre-selects
- `lib/submitInquiry.ts` — validates, waits 800ms, logs, resolves `{ ok: true }`, with a `TODO: connect destination` comment
- States: idle · submitting · success · error
- Right column: address, `tel:`, `mailto:`, hours, socials

**Done-when**
- Submitting empty shows field-level errors with `aria-invalid` and `aria-describedby` wired
- Submitting valid shows the submitting state, then the success panel; "Send another message" resets it
- Forcing an error shows the banner **and every entered value survives**
- Arriving from Monterra Ridge's CTA pre-selects "Monterra Ridge"
- Every input has a real `<label>` — no placeholder-as-label
- Fully operable by keyboard; correct at 390 / 768 / 1280

**Commit:** `feat: contact form with validation and stubbed submission`

---

## 10 · Remaining content pages

`ai/feat-content-pages`

**Goal:** About, Our Process, Team, Privacy — built from existing components.

**Build**
- **About** — `PageHero`, story in an offset composition, values grid, `PullQuote`, stats band, CTA
- **Our Process** — five stages, numerals `01`–`05` in stone, alternating image side, collapsing to stacked at <768px
- **Team** — `content/team.json` Zod-validated; 4 / 2 / 1 grid; 4:5 portraits grayscale → color on hover, always color on touch; LinkedIn icon only when present
- **Privacy** — single prose column at 68ch, `[REPLACE]`

**Done-when**
- All four render at 390 / 768 / 1280
- Process numerals alternate correctly and stack cleanly on mobile
- Team portraits are full color on a touch device, where hover cannot fire
- A team member without a LinkedIn URL shows no icon and no gap
- Corrupting `team.json` fails the build with a named field

**Commit:** `feat: about, process, team and privacy pages`

---

## 11 · SEO, performance, accessibility hardening

`ai/chore-seo-perf-a11y`

**Goal:** the launch gate.

**Build**
- `metadataBase`, title template `%s | Monterra Developments`, unique title + 150–160 char description per page
- Project pages use `seo.*` when present, otherwise derive from `title` and `summary`
- `app/opengraph-image.tsx` and `app/projects/[slug]/opengraph-image.tsx` via `ImageResponse` — navy, monogram, title, `city, ST`
- `sitemap.ts` (all routes + all slugs, excluding `/styleguide`), `robots.ts`, canonical URLs
- JSON-LD: `Organization` in root, `Residence` per project when `coords` exist —
  `Residence` rather than `Place` because it is the more specific schema.org type
  for a development. A project without `coords` emits nothing at all.
- `axe` scans on all ten indexable routes, plus the open lightbox and open mobile nav
- Lighthouse on the production build

**Done-when**
- View-source confirms a unique title and description on every page
- OG cards render correctly in a link-preview validator
- `/sitemap.xml` lists all static routes plus all three slugs, and omits `/styleguide`
- Zero critical and zero serious `axe` violations on all ten scanned routes
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100
- Reduced-motion disables every animation site-wide
- Production build passes with zero TS and zero ESLint errors

**Commit:** `chore: SEO metadata, OG images, sitemap and accessibility hardening`

---

## Deferred beyond these eleven

Not blockers for a working site, but required before the client sees it:

1. **Redrawn logo SVG** — the current trace is 105KB with no `viewBox`
2. **Favicon set** from the redrawn monogram
3. **Real architectural photography** replacing every placeholder
4. **Real copy** — every `[REPLACE]` in every file
5. **A contact form destination** — one file to change
6. **A real privacy policy**
7. **Analytics** — Vercel Analytics plus a conversion event on form success
8. **Coordinates for The Larkin and Monterra Bay** — without them neither emits a
   `Residence` block, so one project of three carries structured data

All of the above are itemised file by file, with who can supply each one, in
[`docs/content-checklist.md`](./content-checklist.md) — the handover document.
