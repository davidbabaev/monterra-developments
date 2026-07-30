import { Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { StoneSlab } from "@/components/ui/StoneSlab";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site";

/**
 * A stone bar that ties the last content section to the footer instead of
 * letting the footer start cold.
 *
 * On desktop it is translated down by a third of its own height so its bottom
 * third sits over the navy; the footer carries matching top padding so nothing
 * is covered. Below 1280px the overlap is dropped entirely — the composition
 * does not survive a narrow column, so the band simply sits flush above.
 *
 * All text here is navy or ink: this is a stone surface, where ivory measures
 * 1.9:1 and slate 2.62:1.
 *
 * The band is an `aside` — a complementary landmark — with an accessible name.
 * It sits between `main` and `footer`, so without one its three items belong to
 * no landmark at all and a screen reader moving by landmark skips straight past
 * the address, phone and email. axe reports this as `region` on every route the
 * band appears on. The name is what makes the landmark worth having: an unnamed
 * complementary is announced only as "complementary", which locates nothing.
 */

type BandItem = {
  readonly icon: LucideIcon;
  readonly heading: string;
  readonly lines: readonly string[];
  readonly href?: string;
};

const { contact } = siteConfig;

const ITEMS: readonly BandItem[] = [
  {
    icon: MapPin,
    heading: "Office",
    lines: [contact.address.street, contact.address.locality],
  },
  {
    icon: Phone,
    heading: "Phone",
    lines: [contact.phone.label, contact.hours],
    href: contact.phone.href,
  },
  {
    icon: Mail,
    heading: "Email",
    // Approved 2026-07-29. A service promise, signed off as written.
    lines: [contact.email.label, "We reply within two business days"],
    href: contact.email.href,
  },
];

export function ContactBand() {
  return (
    <aside aria-label="Contact details" className="relative z-10 xl:translate-y-1/3">
      <Container>
        <StoneSlab padding="lg">
          <ul className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {ITEMS.map((item) => (
              <li key={item.heading} className="flex min-w-0 gap-4">
                <Icon icon={item.icon} size={32} className="text-navy" />
                {/* min-w-0 lets the text column shrink; without it an email
                    address is an unbreakable string that overflows at 320px. */}
                <div className="min-w-0 break-words">
                  <h2 className="font-display text-[19px] font-semibold text-navy">
                    {item.heading}
                  </h2>
                  {/* The link is inline-block, not inline-flex: a flex box
                      sizes to its content, so an email address could never wrap
                      and would push the page wider than the viewport at 320px. */}
                  {item.href === undefined ? (
                    <p className="mt-1 font-body text-[15px] text-ink">{item.lines[0]}</p>
                  ) : (
                    <a
                      href={item.href}
                      className="mt-1 inline-block min-h-11 max-w-full break-words border-b border-transparent py-2.5 font-body text-[15px] text-ink hover:border-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
                    >
                      {item.lines[0]}
                    </a>
                  )}
                  <p className="font-body text-[15px] text-ink">{item.lines[1]}</p>
                </div>
              </li>
            ))}
          </ul>
        </StoneSlab>
      </Container>
    </aside>
  );
}
