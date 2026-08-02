import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "@/components/ui/Logo";
import { PROJECT_STATUSES } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

/**
 * Navy, ivory text, four zones. Contact comes first on mobile, per the
 * responsive spec, which the `order` utilities handle without duplicating it.
 *
 * The project links are derived from PROJECT_STATUSES rather than hand-listed,
 * so a new status cannot silently go missing from the footer.
 */

const STATUS_LABEL: Record<(typeof PROJECT_STATUSES)[number], string> = {
  completed: "Completed",
  current: "Current",
  upcoming: "Upcoming",
};

const LINK_BASE =
  "inline-flex min-h-11 items-center font-body text-ivory " +
  "border-b border-transparent hover:border-bronze " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze";

const LINK_CLASS = `${LINK_BASE} text-[15px]`;
/** The reference sets the phone number large in the contact zone. */
const PHONE_CLASS = `${LINK_BASE} mt-2 text-[20px] font-medium`;

function ColumnHeading({ children }: { readonly children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-stone">
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="bg-navy pt-16 xl:pt-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-4 xl:gap-8">
          <div className="order-2 xl:order-1">
            <Logo tone="dark" className="h-10 w-auto" />
            {/*
              Not bronze: at 20px this is below the 24px large-text threshold,
              where bronze on navy measures 3.95:1 and fails. Not Cormorant
              either — the editorial face owns h1/h2 ledes and nothing else.
            */}
            <p className="mt-4 font-display text-[17px] font-medium text-ivory">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-[38ch] font-body text-[15px] text-ivory">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-labelledby="footer-company" className="order-3 xl:order-2">
            <div id="footer-company">
              <ColumnHeading>Company</ColumnHeading>
            </div>
            <ul className="mt-2 flex flex-col">
              {siteConfig.footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK_CLASS}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-projects" className="order-4 xl:order-3">
            <div id="footer-projects">
              <ColumnHeading>Projects</ColumnHeading>
            </div>
            <ul className="mt-2 flex flex-col">
              {PROJECT_STATUSES.map((status) => (
                <li key={status}>
                  <Link href={`/projects?status=${status}`} className={LINK_CLASS}>
                    {STATUS_LABEL[status]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-1 xl:order-4">
            <ColumnHeading>Contact</ColumnHeading>
            <address className="mt-2 flex flex-col not-italic">
              <span className="font-body text-[15px] text-ivory">{contact.address.street}</span>
              <span className="font-body text-[15px] text-ivory">{contact.address.locality}</span>
              <a href={contact.phone.href} className={PHONE_CLASS}>
                {contact.phone.label}
              </a>
              <a href={contact.email.href} className={LINK_CLASS}>
                {contact.email.label}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-stone pt-6 pb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/*
              The disclaimer sits with the copyright rather than in a banner. The
              site has a working contact form and a brand plausible enough to be
              taken for a real developer, so saying so once, permanently, on every
              page is the honest minimum — but it is a footnote, not a warning, and
              it is not styled as one.
            */}
            <p className="font-body text-[13px] text-stone">
              © {year} {siteConfig.name}
              <span className="block sm:inline">
                <span aria-hidden="true" className="hidden sm:inline">
                  {" · "}
                </span>
                A concept project. Monterra Developments is not a real company.
              </span>
            </p>
            <Link
              href={siteConfig.legal.href}
              className="font-body text-[13px] text-stone underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            >
              {siteConfig.legal.label}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
