"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the contact band on the routes that already carry the same details.
 *
 * /contact lists the address, phone and email in the column beside the form, and
 * the footer lists them again below. A third copy between the two is noise, and
 * it makes the page look like it is padding itself out.
 *
 * A client wrapper around server-rendered children rather than a client
 * ContactBand: the band's markup is still built on the server and passed
 * through, so the only thing that ships to the browser is the path check.
 * usePathname, unlike useSearchParams, does not opt a route out of static
 * prerendering.
 */

const HIDDEN_ON: readonly string[] = ["/contact"];

type ContactBandSlotProps = {
  readonly children: React.ReactNode;
};

export function ContactBandSlot({ children }: ContactBandSlotProps) {
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return null;

  return <>{children}</>;
}
