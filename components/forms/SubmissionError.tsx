import { AlertCircle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";

/**
 * The banner above the form when a submission fails.
 *
 * It sits above rather than replacing anything, because the form underneath
 * still holds every value the reader typed and losing that is worse than the
 * failure itself. It offers the email address as the way through, so a reader
 * who hits this twice is not stuck.
 *
 * role="alert" so it is announced the moment it appears, and an icon beside the
 * words so the meaning does not rest on the colour.
 */

export function SubmissionError() {
  const { email } = siteConfig.contact;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 border-l-2 border-error bg-surface p-4"
    >
      <Icon icon={AlertCircle} size={20} className="mt-0.5 text-error" />
      <p className="font-body text-[15px] leading-[1.6] text-ink">
        <span className="font-medium text-error">Something went wrong.</span> Please try again, or
        email us directly at{" "}
        <a
          href={email.href}
          className="border-b border-bronze text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          {email.label}
        </a>
        .
      </p>
    </div>
  );
}
