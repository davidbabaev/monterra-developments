# Monterra Developments — brief for Claude Code

## 1 · Project overview

Marketing website for Monterra Developments, a US real estate development company that develops, builds and sells apartments and houses. Audience: prospective buyers, investors, business partners. It presents completed, current and upcoming projects, the company story, the process, and the team. The single conversion goal is an inquiry submission.

This is a brochure website, NOT a web application. No accounts, no payments, no dashboards, no booking, no marketplace, no search. If a task seems to need one of those, the task is wrong — stop and say so.

## 2 · Tech stack + versions

Versions below are the ones actually installed — read from `package.json` / `package-lock.json` on 2026-07-26. Update this section when a version changes.

| Concern | Package | Version |
| --- | --- | --- |
| Framework | `next` (App Router, fully static) | 16.2.12 |
| UI runtime | `react` | 19.2.4 |
| UI runtime | `react-dom` | 19.2.4 |
| Language | `typescript` (strict) | 5.9.3 |
| Types | `@types/node` / `@types/react` / `@types/react-dom` | 20.19.43 / 19.2.17 / 19.2.3 |
| Styling | `tailwindcss` (v4 CSS-first `@theme`, **no** `tailwind.config.js`) | 4.3.3 |
| Styling | `@tailwindcss/postcss` | 4.3.3 |
| Icons | `lucide-react` (icons only — not a component library) | 1.27.0 |
| Lint | `eslint` / `eslint-config-next` | 9.39.5 / 16.2.12 |
| Unit tests | `vitest` | 4.1.10 |
| Unit tests | `@vitejs/plugin-react` | 6.0.4 |
| Unit tests | `jsdom` | 29.1.1 |
| Unit tests | `@testing-library/react` | 16.3.2 |
| Unit tests | `@testing-library/jest-dom` | 7.0.0 |
| Unit tests | `@testing-library/user-event` | 14.6.1 |
| E2E tests | `@playwright/test` (mobile 390x844, desktop 1280x800) | 1.62.0 |
| Content | `gray-matter` (frontmatter parsing at build time) | 4.0.3 |
| Content | `next-mdx-remote` (MDX body rendering; not yet used) | 6.0.0 |
| Validation | `zod` (v4 — content schemas and the contact form) | 4.4.3 |
| Forms | `react-hook-form` (contact form state and validation) | 7.83.0 |
| Forms | `@hookform/resolvers` (the Zod resolver) | 5.5.7 |
| Content | `image-size` (intrinsic dimensions read at build time) | 2.0.2 |
| Image encoding | `sharp` (dev only, placeholder generation; scripts approved via `allowScripts`) | 0.35.3 |
| Runtime | Node.js | v24.18.0 (WSL2 Ubuntu) |
| Bundler | Turbopack | bundled with Next 16.2.12 — the default, not a flag |
| Hosting | Vercel | — |

**Planned, not yet installed** — add these when the increment that needs them lands, and update the table with the real resolved version at that time. Do not guess a version number here:

- Nothing outstanding. Every package the remaining increments need is installed.

### Next 16 specifics that bite

- Turbopack is the default bundler. There is no `--turbopack` flag in `create-next-app` any more; opting out means `--rspack`.
- Route params are async — `params` and `searchParams` are Promises and must be awaited.
- `middleware.ts` is now `proxy.ts`. We do not use it, and must not add it.
- Caching is opt-in, not opt-out. Everything here is prerendered at build time anyway.
- `next lint` was removed. Lint is a standalone `eslint` script and is **not** run by `next build` — run `npm run lint` separately.

## 3 · Project structure

The real tree on disk right now. Folder names map to the words used in prompts.

```
monterra-developments/
├── .claude/
│   ├── hooks/
│   │   ├── block-secret-commits.py      # PreToolUse: refuses commits carrying secrets
│   │   └── run-checks-before-commit.py  # PreToolUse: tsc + lint + vitest before a commit
│   ├── settings.json                    # wires both hooks (committed)
│   └── settings.local.json              # personal permissions (gitignored)
├── app/                                 # App Router — routes, layouts, global CSS
│   ├── favicon.ico
│   ├── globals.css                      # Tailwind v4 entry; @theme tokens live here
│   ├── layout.tsx                       # fonts + SkipLink, Header, main#main, ContactBand, Footer
│   ├── not-found.tsx                    # custom 404
│   ├── page.tsx                         # Home — placeholder until increment 8
│   ├── about|process|team|contact|privacy/   # placeholder pages, each opens with PageHero
│   ├── projects/                        # listing placeholder + [slug] detail placeholder
│   └── styleguide/                      # internal reference page, noindex
│       ├── page.tsx
│       └── _components/                 # styleguide-only, never imported elsewhere
├── components/
│   ├── forms/                           # contact / inquiry form pieces
│   ├── home/                            # homepage-only sections
│   ├── layout/                          # Breadcrumb ContactBand Container Footer Header
│   │                                    # MobileNav NavLink PageHero Section SkipLink
│   │                                    # useFocusTrap useScrolledPast
│   ├── project/                         # ProjectCard ProjectGrid ProjectsBrowser
│   │                                    # ProjectsEmptyState StatusFilter projectCardData
│   └── ui/                              # AmenityMarker Button Card CardMedia Eyebrow Icon
│                                        # PullQuote SectionNumeral SplitHeading StatBlock
│                                        # Logo StatusBadge StoneSlab — from @theme tokens
├── content/
│   └── projects/                        # one folder per project, read at build time
│       ├── monterra-ridge/              # index.mdx + hero.png, gallery/, plans/
│       ├── monterra-bay/                # index.mdx + hero.png (deliberately sparse)
│       └── the-larkin/                  # index.mdx + hero.png, gallery/
├── docs/                                # master-build-order, design-reference, build-increments
├── lib/
│   ├── content-error.ts                 # ContentValidationError + field-path formatting
│   ├── contrast.ts                      # WCAG ratio maths, used by the styleguide and tests
│   ├── cx.ts                            # class-name join helper
│   ├── design-tokens.ts                 # palette mirror + the declared contrast pairs
│   ├── project-loader.ts                # disk read, parse, validate, cache
│   ├── project-media.ts                 # asset paths -> public URLs + intrinsic dimensions
│   ├── projects.ts                      # query surface (all, by slug, featured, status, adjacent)
│   ├── schema.ts                        # Zod schemas; status-conditional validation
│   └── site.ts                          # name, tagline, nav, [REPLACE] contact details
├── public/
│   ├── projects/                        # GENERATED mirror of content assets — gitignored, never edit
│   ├── logo/
│   ├── file.svg                         # create-next-app leftovers, safe to delete
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── generate-placeholders.mjs        # sharp: solid-color placeholder assets, run by hand
│   └── sync-content-assets.mjs          # mirrors content assets -> public/projects (predev/prebuild)
├── styles/                              # additional token/layer CSS if globals.css outgrows itself
├── tests/
│   ├── e2e/
│   │   └── smoke.spec.ts                # asserts / returns 200 on both viewports
│   └── unit/
│       ├── projects.test.ts             # loader + query behaviour
│       ├── schema.test.ts               # schema accept/reject cases
│       └── smoke.test.ts
├── CLAUDE.md                            # this file
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── playwright.config.ts                 # projects: mobile 390x844, desktop 1280x800
├── postcss.config.mjs
├── tsconfig.json                        # strict, alias @/* -> ./*
├── vitest.config.mts                    # jsdom, includes tests/unit/**
└── vitest.setup.ts                      # jest-dom matchers + auto cleanup
```

Every directory that is still empty holds a `.gitkeep`. Delete the `.gitkeep` when the first real file lands.

## 4 · Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack). Use `http://localhost:3000`, not `127.0.0.1` — the HMR socket is origin-checked. |
| `npm run build` | Production build. Must pass with zero TypeScript errors. |
| `npm test` | Vitest, single run. |
| `npm run test:e2e` | Playwright at 390x844 and 1280x800. Builds and serves first. |
| `npm run lint` | ESLint. Separate from `build` — both must be clean. |

## 5 · Conventions

- Server Components by default. `"use client"` only for: mobile nav, status filter, lightbox, stat counter, contact form. Nowhere else.
- One component per file, named to match the file, single responsibility.
- Types inferred from Zod schemas via `z.infer`, never hand-written in parallel.
- Tailwind utilities only. No CSS modules, no styled-components.
- All color and type comes from `@theme` tokens. Never write a raw hex in a component.
- Copy is sentence case, active voice. Banned words: elevate, curated, bespoke, nestled, unparalleled, luxury living, seamless, world-class.
- Placeholder content marked `[REPLACE]` so it is greppable.
- Match the existing exemplar file before inventing a new pattern.
- **Never override a component's own base utility through `className`.** Two unprefixed utilities from the same group (`hidden` vs `inline-flex`, `text-navy` vs `text-ivory`, `px-0` vs `px-5`) have equal specificity, so the winner is decided by stylesheet order, not by the order you wrote them. Wrap the component in an element that carries the class instead, or add a prop. A responsive variant like `lg:hidden` is sorted after base utilities and is safe.

## 6 · Architecture & patterns to respect

**Code style — IMPORTANT!!! : ALL code MUST follow the SOLID design principles. Never write code that violates them.**

- The site is fully static. Every route prerendered. No API routes, no request-time fetching, no `proxy.ts`.
- Content lives on disk as MDX, read at build time only. No database, no CMS.
- Zod validates all content at build time. Invalid frontmatter FAILS THE BUILD naming the file and field. Never render a partially-valid project, never fall back to a default, never silently skip a bad file.
- Optional content renders nothing — no empty heading, no "TBA", no placeholder row.

## 7 · Guardrails — do NOT do these (IMPORTANT!!!)

- Never commit directly to `main`. Work on `ai/<type>-<short-description>`.
- **NEVER use `--no-verify`, `--no-gpg-sign`, or any flag that bypasses a git hook**, for any reason, including a message-only amend. The hooks are the safety net that makes `bypassPermissions` acceptable. If a commit is blocked, fix the cause. If a message is wrong, leave it wrong and tell me.
- **NEVER run a command requiring `sudo`.** You cannot answer a password prompt and it hangs forever. If a step needs sudo, stop and tell me the exact command.
- Never touch `.env` files.
- Never install a UI component library (shadcn, MUI, Chakra, DaisyUI). Build from tokens.
- Never add a dependency outside the stack without saying why in the commit message.
- Never add an API route, database, CMS or authentication.
- Never use an external placeholder image service. Use local solid-color placeholders at correct aspect ratios.
- Never put white or slate text on the stone background — it fails contrast. Text on stone is navy or ink.
- Never use bronze for text below 26px. Bronze on ivory measures 3.55:1 and only clears WCAG at large sizes.
- Never put small text on a bronze *fill* — no palette colour reaches 4.5:1 on it. Use `bronze-deep`, which exists only for that case.
- Never use stone to identify a control (a form input border). At 1.76:1 on ivory it is a decorative edge only; inputs take a navy border.
- Every foreground/background pair the system renders is declared in `lib/design-tokens.ts` and asserted in `tests/unit/contrast.test.ts`. Add the pair there when you introduce one, or the audit is lying.
- Never mark work complete because tests pass. Verify in a browser.

## 8 · Domain notes

- A **project** is a real estate development, not a listing and not a unit for sale. Status is exactly one of: `completed`, `current`, `upcoming`.
- Status drives required data:
  - `completed` — requires a completion date and a gallery of 3+ images.
  - `current` — requires a completion date.
  - `upcoming` — requires only hero image, summary, city/state, and one property type.

  An upcoming project with almost no data is NORMAL and must look deliberate, never broken.
- `order` controls display sequence, not date. Sorting by completion fails — upcoming projects have none.
- `featured` selects projects for the homepage.
- **Property type** is the kind of home (Townhomes, Condominiums, Duplexes). It is not a filter. The only filter is status.
- An **inquiry** is the contact form submission. It has no destination yet and is stubbed in one file.

## 9 · Token discipline

Keep files small, modular, single-responsibility. Components under ~150 lines; split beyond that.

## 10 · Working efficiently — IMPORTANT

Context is the budget. Spend it on the work, not on noise.

DO
- Search before reading. Use grep/glob to find the relevant lines, then read only that file — or only the line range you need. Never read a file "to see what's in it".
- Read a file once per session. If you already read it, use what you have.
- Silence noisy commands. `npm run lint --silent`. Pipe long output through `tail -30`. Never print a full test log when it passed.
- Batch independent tool calls into a single turn instead of one per turn.
- Trust CLAUDE.md and the docs/ specs. Never re-read them to confirm something they already state.
- Report back in short bullets: what changed, what was verified, what failed. Facts, not prose.
- When a task is done, say so and stop. No summary of the summary.

DO NOT
- Never read node_modules/, .next/, package-lock.json, coverage/, build output, or binary files.
- Never echo the contents of a file you just wrote back into the conversation. Name the path instead.
- Never restate the plan before executing it. Execute, then report.
- Never re-explain the stack, the conventions or the domain — they are in this file.
- Never paste a diff into the response. The commit holds it.

QUALITY FLOOR — never cut these to save tokens
- Always read a file fully before editing it.
- Always run the unit tests before committing.
- Always verify in a real browser at 390px and 1280px.
- Always implement every state in the spec: empty, loading, error, success.
- If saving context would mean guessing at a spec, read the spec instead.

If context runs low mid-task, finish the current file, commit it, and tell me to run /clear — do not degrade the work to fit.

## Version control — ALWAYS

Before ANY change, create and check out: `ai/<type>-<short-description>`
Types: `feat`, `fix`, `chore`, `refactor`, `test`. Never commit to `main`. Clear imperative commit messages.

## Definition of done — every task

1. Write tests for new code.
2. Run the full unit suite and make it pass BEFORE committing.
3. Run the dev server and verify in a browser at 390px and 1280px.
4. Confirm each state is reachable: empty, loading, error, success.
5. `npm run build` passes with zero TypeScript and zero ESLint errors.

"Tests pass" is not done. Observed behavior is done.

## Ambiguity

Resolve in this order: `docs/master-build-order.md`, `docs/design-reference.md`, `docs/build-increments.md`, then the convention already in this codebase. Only if all four are silent, decide and continue and record it in the commit message. Do not stop to ask.
