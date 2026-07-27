import { LOGO_PATHS, MARK_VIEWBOX } from "@/components/ui/logoPaths";
import { BRAND_COLORS, DERIVED_COLORS } from "@/lib/design-tokens";

/**
 * The shared body of both Open Graph cards.
 *
 * These render through Satori, not a browser: no Tailwind, no CSS variables, no
 * stylesheet at all. Every value has to be a literal, which is the one place in
 * this codebase where a colour is written out — so it is read from
 * lib/design-tokens.ts, the same table the contrast audit uses, rather than
 * retyped as a hex that could drift from the palette.
 *
 * Satori also has no default font in some environments, so the type here is
 * deliberately the system stack rather than the brand faces: a card that renders
 * in the wrong font is recoverable, one that fails to render is not. Loading
 * Manrope into the OG route is a nicety left for when the real logo lands.
 */

const colorOf = (name: string): string => {
  const color = [...BRAND_COLORS, ...DERIVED_COLORS].find((entry) => entry.name === name);
  if (color === undefined) throw new Error(`Unknown brand colour "${name}"`);
  return color.hex;
};

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NAVY = colorOf("navy");
const IVORY = colorOf("ivory");
const BRONZE = colorOf("bronze");
const STONE = colorOf("stone");

/** The skyline mark alone, at the size the card uses. */
function Monogram() {
  return (
    <svg width={96} height={134} viewBox={MARK_VIEWBOX} fill="none">
      {LOGO_PATHS.filter((path) => path.inMark).map((path, index) => (
        <path key={index} d={path.d} fill={path.tone === "accent" ? BRONZE : IVORY} />
      ))}
    </svg>
  );
}

type CardProps = {
  /** The bronze line above the title: the site name, or the project's status. */
  readonly eyebrow: string;
  readonly title: string;
  /** The tagline, or "City, ST". */
  readonly footnote: string;
};

export function OgCard({ eyebrow, title, footnote }: CardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: NAVY,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <Monogram />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: BRONZE,
            marginBottom: 20,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.1, color: IVORY, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 30, color: STONE, marginTop: 24 }}>{footnote}</div>
      </div>
    </div>
  );
}
