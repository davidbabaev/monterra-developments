import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { siteConfig } from "@/lib/site";

/**
 * The default share card, used by every route that does not provide its own.
 * Generated at build time, so there is no runtime cost and nothing to cache.
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow={siteConfig.name} title={siteConfig.tagline} footnote={siteConfig.description} />,
    size,
  );
}
