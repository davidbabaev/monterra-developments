# Design reference — Monterra Developments

Extracted from three reference screenshots (Hompark, a 2019-era real estate template).
This document is the **authoritative visual spec**. It supersedes the "Design system" section of the master build order wherever the two disagree.

**Rule: adapt the structural ideas, not the styling.** The reference is structurally strong and stylistically dated. Take its layout devices; rebuild the surface on Monterra's brand.

---

## 1 · What the reference does well (adopt these)

### 1.1 The two-tone heading lockup — **the signature**

The reference's strongest and most repeatable move. Every major heading is split across two typefaces and two colors:

> *Zaga* **Construction**
> *One Room* **47m² Homepark Flat**
> *Property* **Inner Gallery**

The first word or phrase is an editorial serif in warm metal; the remainder is a bold sans in dark navy. It reads as considered rather than templated, and it costs nothing to implement.

**Monterra translation:**

```
<h2>
  <span class="lede">Selected</span> <span class="rest">work</span>
</h2>
```

| Part | Font | Weight | Color | Case |
|---|---|---|---|---|
| Lede word | Cormorant Garamond | 300 | bronze `#A87842` | Title case |
| Remainder | Manrope | 600 | navy `#14263D` | Title case |

Both parts sit on the same baseline at the same optical size. Set the Cormorant ~8% larger in `font-size` to compensate for its smaller x-height.

**Rules:**
- The lede is 1–2 words, never more, and is always a real word from the heading — never a decorative prefix bolted on.
- Applies to `h1` and `h2` only. `h3` and below are Manrope alone.
- Minimum size 26px, so bronze-on-ivory (3.4:1) clears WCAG large-text.
- **This replaces the "elevation rule" as the site's signature element.** It is stronger, it comes from the client's own reference, and it carries the brand's editorial register. Drop the elevation rule entirely.

### 1.2 The inner-page hero + offset breadcrumb block

Used identically on the About and Project pages, and it's the most distinctive structural idea in the reference.

```
┌──────────────────────────────────────────────┐
│  ▓▓▓ dark architectural photo + navy scrim   │
│                                              │
│   About Monterra          ← serif, bronze    │
│   One line of context     ← sans, ivory      │
│                                              │
│  ┌───────────────────────┐                   │
└──┤ Home · About Monterra ├───────────────────┘
   └───────────────────────┘  ← stone block,
      overlaps hero edge,        sits half in
      offset from left gutter    the hero,
                                 half in the
                                 white below
```

**Spec:**
- Hero band: 320px mobile / 380px desktop. Full-bleed photo, navy `#14263D` overlay at 62%.
- Title: two-tone lockup, left-aligned to the container, ~34px mobile / 52px desktop. Bronze reads clean on the dark scrim.
- Subhead: Inter 400, ivory at 88% opacity, one line.
- Breadcrumb block: stone `#C8B9A3`, navy text, ~64px tall, starting at the container's left edge and running ~480px wide (not full width). Translated down so it overlaps the hero's bottom edge by 50%. On mobile it goes full-width and stops overlapping — just sits flush beneath.
- Every page except Home uses this pattern. Home gets the tall photographic hero instead.

### 1.3 The stone block as a structural device

Warm Stone is not a background tint in the reference — it's a **solid slab** that carries content and anchors compositions. Five uses, all worth adopting:

| Use | Where |
|---|---|
| Breadcrumb slab | under every inner-page hero |
| Stats panel | project detail, About |
| Pull-quote panel | project detail, About |
| Contact band | above the footer on every page |
| Offset backdrop | sitting behind/beside an image in a two-up composition |

**Contrast correction — mandatory.** The reference sets **white text on tan**, which measures ~1.9:1 and fails WCAG at every size. On Monterra, **all text on stone is navy `#14263D`** (7.0:1) for headings and ink `#252A30` (6.2:1) for body. White on stone is forbidden. Slate `#66707A` on stone is also forbidden — too low.

### 1.4 Offset / overlapping compositions

Two-up blocks where the image and a stone slab overlap rather than sitting in tidy columns:

```
   ┌─────────────┐
   │▓▓ stone ▓▓▓▓│              02
┌──┴──────────┐  │        Homepark Property
│             │  │        ─────────────────
│    photo    │  │        Two lines of body
│             │  │        copy sit here.
└─────────────┴──┘        → See our projects
```

The photo is translated ~40px down and ~40px right of the stone slab, so ~15% of the slab shows on two edges. Direction alternates down the page.

**Adopt on:** About (story section), Our Process (each stage), Home (positioning section).
**Do not adopt on:** project cards, galleries, team grid — those need a clean, scannable grid.
**Mobile:** the overlap collapses. Image full-width, stone slab becomes a thin 6px bronze rule above it. Overlapping compositions do not survive 390px.

### 1.5 Section numerals

The reference numbers every section `01`–`09`. The device is good; the application is indiscriminate.

**Adopt with restraint** — numerals only where the order carries real information:
- **Our Process** — `01`–`05`. A genuine sequence.
- **Home** — nowhere. Numbering "Selected work" as `03` tells the reader nothing.

Style: Manrope 600, stone `#C8B9A3`, 44px desktop / 32px mobile, sitting above the heading with 8px clearance. Not bronze — the numerals must stay quieter than the heading.

### 1.6 The statistic treatment

Big figure, superscript unit, small label beneath, thin vertical rules between items:

```
    28ᵐⁱⁿ          32              15%            79ᵐ²
  Near subway   Spaces avail.   Sold        Avg. size
```

**Monterra spec:**
- Figure: Manrope 700, 40px mobile / 52px desktop, navy on ivory — or navy on stone when inside a slab
- Unit: 60% of the figure size, baseline-shifted up, bronze
- Label: Inter 500, 13px, `0.04em` tracking, uppercase, slate
- Separator: 1px stone vertical rule, 60% of the block's height, centered. Rules disappear below 768px, where stats become a 2×2 grid.

### 1.7 The contact band overlapping the footer

A stone bar carrying three items — line icon, heading, two lines of detail — positioned so its bottom third sits over the dark footer. It ties the page's last content section to the footer instead of letting the footer start cold.

**Adopt.** Three items: office address · phone and hours · email. Line icons only, 32px, navy stroke, 1.5px weight. Mobile: stacks to one column, no overlap.

### 1.8 The footer

Dark, four zones: brand block (logo, one-line description) · two nav columns · a right-aligned contact zone with the phone number set large. Bottom rule, then a thin copyright bar.

**Adopt the structure.** Rebuild on navy `#14263D` with ivory text. Drop the language selector (English only) and the template credit.

---

## 2 · What the reference does badly (do not copy)

| Problem in the reference | What Monterra does instead |
|---|---|
| White text on tan — ~1.9:1, fails WCAG at every size | Navy on stone, always |
| Body text ~14px with tight leading | 16–17px, line-height 1.65, max 68ch |
| Nine homepage sections — the message dilutes | Six sections, each earning its place |
| Section numerals on everything | Numerals only on Our Process |
| Dotted decorative scatter patterns | Nothing. Dated, and it decorates without meaning |
| Hero clutter: vertical rails, slide counters, side arrows | One hero image, headline, two CTAs. Nothing else |
| Full-width photo sliders with dot indicators | Static grid + accessible lightbox |
| Client logo strip | Cut — Monterra has no partner logos |
| Materials icon grid, certificates row | Cut — no real content behind them |
| News cards | Out of scope |
| Bulky drop shadows on cards | 1px stone border; shadow only on hover, at `0 2px 8px rgba(20,38,61,0.08)` |
| Everything animates on scroll | Motion only on: card hover, nav overlay, lightbox, stat count-up |

---

## 3 · Layout system

| Token | Value |
|---|---|
| Container max-width | 1200px |
| Gutter | 20px mobile / 40px tablet / 64px desktop |
| Grid | 12 col desktop, 6 col tablet, 4 col mobile; 24px gap |
| Section padding (vertical) | 64px mobile / 88px tablet / 120px desktop |
| Prose measure | 68ch |
| Overlap offset | 40px (used by offset compositions) |

Full-bleed elements: home hero, inner-page hero, contact band, footer, and any section that takes a stone background.

### 3.1 Bronze-deep — the accessible variant, not a new colour

`--color-bronze-deep` `#976C3B` is **not an eighth brand colour.** It is the accessible variant of bronze, used **only as a filled background behind white text**, where bronze itself measures 3.87:1 and fails.

It never appears as text, as a border, as a rule, or as an icon colour. **Bronze remains the accent everywhere else.**

| | Bronze `#A87842` | Bronze-deep `#976C3B` |
|---|---|---|
| Text | Never below 26px | Never |
| Border / rule / icon | Yes | Never |
| Filled background behind white text | Never — 3.87:1 | Yes — 4.64:1 |

The only current use is the `current` StatusBadge. Anything else that needs small white text on a bronze fill uses it too; anything that does not, uses bronze.

---

## 4 · Revised type scale

Cormorant Garamond is promoted from "rare editorial accent" to a **structural role** — it owns the lede word of every `h1`/`h2`. Load weight 300 only. It never appears in body copy, navigation, buttons, labels, or forms.

| Role | Font | Size (mobile → desktop) | Weight | Color |
|---|---|---|---|---|
| Hero headline — lede | Cormorant Garamond | 40px → 68px | 300 | bronze |
| Hero headline — rest | Manrope | 36px → 64px | 700 | ivory (on scrim) |
| h1 lede / rest | Cormorant / Manrope | 34→56 / 32→52 | 300 / 600 | bronze / navy |
| h2 lede / rest | Cormorant / Manrope | 28→41 / 26→38 | 300 / 600 | bronze / navy |
| h3 | Manrope | 19px → 22px | 600 | navy |
| Eyebrow | Manrope | 12px | 600 | slate, `0.14em`, uppercase |
| Section numeral | Manrope | 32px → 44px | 600 | stone |
| Body | Inter | 16px → 17px | 400 | ink, lh 1.65 |
| Body intro | Inter | 18px → 20px | 400 | slate, lh 1.6 |
| Metadata / label | Inter | 13px | 500 | slate, `0.04em`, uppercase |
| Stat figure | Manrope | 40px → 52px | 700 | navy |
| Stat unit | Manrope | 60% of figure | 600 | bronze |

---

## 5 · Component adjustments

**Buttons.** The reference's gold arrow-button is the right idea. Primary: navy fill, ivory label, 2px radius, a 12px bronze arrow `→` translating 4px right on hover. Secondary: 1px navy outline, transparent fill. Minimum 44×44px.

**Cards.** White surface on ivory, 1px stone border, 4px radius, no shadow at rest. On hover the border goes bronze, the card lifts 2px, and the image scales to 1.03 over 250ms with `overflow: hidden`. Entire card is one link.

**Spec lists.** Two columns on desktop with an `h3` above each. Markers are a 12px bronze hairline dash, not a bullet dot. Row gap 12px.

**Pull-quote.** Stone slab, 32px padding. Quote in Cormorant Garamond 300 italic, navy, 22px → 28px. Attribution below in Manrope 600, 14px, navy, preceded by a 24px bronze rule.

**Line icons.** Single consistent set, 1.5px stroke, navy, no fill, 24px in content and 32px in the contact band. Every icon is paired with a text label — never an icon alone.

---

## 6 · Honest note on the palette

Ivory background + serif display + warm-bronze accent is currently the most common look in AI-generated web design. Monterra's brand is fixed and the client's own reference points the same way, so the palette stays — but it means the palette cannot be what makes this site feel designed.

The differentiation has to come from structure: the two-tone heading lockup, the offset breadcrumb slab, the stone slabs used as load-bearing blocks rather than tints, and the disciplined restraint of six sections where the reference has nine. Execute those precisely and the site reads as art-directed. Skip them and it reads as a template with good colors.

---

## 7 · Overrides to the master build order

Apply these deltas; everything else in that document stands.

1. **Signature element:** the two-tone heading lockup replaces the elevation rule. Delete `ElevationRule`; add `SplitHeading`.
2. **Cormorant:** promoted to structural. Still one weight (300), but now preloaded, since it appears above the fold.
3. **New shared components:** `SplitHeading`, `PageHero` (inner-page hero + breadcrumb slab), `StoneSlab`, `StatBlock`, `PullQuote`, `ContactBand`, `OffsetFeature`.
4. **Every non-Home page** opens with `PageHero`, not a plain title block.
5. **`ContactBand`** sits above the footer on every page, overlapping it.
6. **Contrast rule added:** text on stone is navy or ink only. White and slate on stone are forbidden.
7. **Home section list revised to six:** Hero → Positioning (offset composition) → Featured projects → Stats band → Process preview → Closing CTA.
8. **Overlap compositions collapse at <768px** — this is a required responsive behavior, not a nicety.

---

## 8 · Asset status

| Asset | Status |
|---|---|
| Logo SVG | ⚠️ **Not production-ready.** `logo2.svg` is an auto-trace of the PNG: 105KB, 120 paths, no `viewBox`, and dozens of near-identical navy values instead of the two brand hexes. It will look soft at large sizes and cannot be recolored for the dark/mono variants. **It must be redrawn as clean vector** — the mark is straight-line geometry, so ~10 paths on a proper `viewBox` using exactly `#14263D` and `#A87842`. Target under 4KB. |
| Favicon set | Not produced. Generate from the redrawn monogram. |
| Architectural photography | Not supplied. Build with solid-color placeholders at correct aspect ratios. |
| Floor plan PDFs | Not supplied. |
| Real copy | Not supplied. All `[REPLACE]`. |
