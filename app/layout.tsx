import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/**
 * Fonts are self-hosted by next/font at build time, so there is no third-party
 * request and no layout reflow beyond the `swap` fallback.
 */

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

/** Preloaded: it owns the lede word of every h1/h2, so it is always above the fold. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
