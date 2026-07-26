import { cx } from "@/lib/cx";
import { siteConfig } from "@/lib/site";

/**
 * [REPLACE] — a typographic stand-in, not the real mark.
 *
 * `docs/brand/logo2.svg` has never been supplied, so there is nothing to
 * optimise and a logo must not be invented. This renders the company name as
 * type so the shell is complete and correctly sized; swapping in the real
 * SVG later touches this one file.
 */

type WordmarkVariant = "horizontal" | "monogram";
type WordmarkTone = "light" | "dark";

type WordmarkProps = {
  readonly variant?: WordmarkVariant;
  /** `dark` means "sits on a dark surface", so the type goes ivory. */
  readonly tone?: WordmarkTone;
  readonly className?: string;
};

export function Wordmark({ variant = "horizontal", tone = "light", className }: WordmarkProps) {
  const [first, ...restOfName] = siteConfig.name.split(" ");
  const colour = tone === "dark" ? "text-ivory" : "text-navy";

  if (variant === "monogram") {
    return (
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center border font-display text-[18px] font-bold leading-none",
          tone === "dark" ? "border-ivory text-ivory" : "border-navy text-navy",
          className,
        )}
      >
        {first.charAt(0)}
      </span>
    );
  }

  return (
    <span
      className={cx(
        "font-display text-[17px] leading-none tracking-[-0.01em] xl:text-[19px]",
        colour,
        className,
      )}
    >
      <span className="font-bold">{first}</span>{" "}
      <span className="font-medium">{restOfName.join(" ")}</span>
    </span>
  );
}
