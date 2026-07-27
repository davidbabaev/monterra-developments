import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";

/**
 * The column beside the form: the ways to reach the office that are not the
 * form. Every value comes from lib/site.ts, so the placeholders are replaced in
 * one file rather than in each page that shows them.
 *
 * Phone and email are real tel: and mailto: links, so a phone dials and a mail
 * client opens rather than the reader copying a string by hand.
 */

type Detail = {
  readonly icon: LucideIcon;
  readonly heading: string;
  readonly lines: readonly string[];
  readonly href?: string;
};

const { contact, socials } = siteConfig;

const DETAILS: readonly Detail[] = [
  {
    icon: MapPin,
    heading: "Office",
    lines: [contact.address.street, contact.address.locality],
  },
  { icon: Phone, heading: "Phone", lines: [contact.phone.label], href: contact.phone.href },
  { icon: Mail, heading: "Email", lines: [contact.email.label], href: contact.email.href },
  { icon: Clock, heading: "Hours", lines: [contact.hours] },
];

const LINK =
  "inline-block min-h-11 max-w-full break-words border-b border-transparent py-2.5 " +
  "hover:border-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze";

export function ContactDetails() {
  return (
    <div className="flex flex-col gap-8">
      {/* Office, Phone, Email and Hours are h3s. Without a level above them the
          outline steps from the page title to an h3; hidden, because the column
          reads as what it is without a label. */}
      <h2 className="sr-only">Other ways to reach us</h2>

      <ul className="flex flex-col gap-6">
        {DETAILS.map((detail) => (
          <li key={detail.heading} className="flex min-w-0 gap-4">
            <Icon icon={detail.icon} className="mt-0.5 text-navy" />
            <div className="min-w-0">
              <h3 className="font-display text-[15px] font-semibold text-navy">
                {detail.heading}
              </h3>
              {detail.href === undefined ? (
                detail.lines.map((line) => (
                  <p key={line} className="mt-1 font-body text-[15px] text-ink">
                    {line}
                  </p>
                ))
              ) : (
                <a href={detail.href} className={`font-body text-[15px] text-ink ${LINK}`}>
                  {detail.lines[0]}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="font-display text-[15px] font-semibold text-navy">Follow</h3>
        <ul className="mt-1 flex flex-wrap gap-x-6">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                className={`font-body text-[15px] text-ink ${LINK}`}
                target="_blank"
                rel="noopener"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
