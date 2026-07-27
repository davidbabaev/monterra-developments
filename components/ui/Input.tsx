import { cx } from "@/lib/cx";

/**
 * A text input, and the reason the border is navy rather than stone.
 *
 * Stone on ivory is 1.76:1. On a card that is fine — the content identifies the
 * card, not its edge — but on an input the border is the only thing marking
 * where the field is, so it has to clear 3:1 under WCAG 1.4.11. Navy on ivory
 * measures 14.02:1.
 *
 * An invalid field takes the error colour on its border as well as beneath it,
 * which is a second, redundant cue rather than the only one.
 */

type InputProps = React.ComponentProps<"input"> & {
  readonly invalid?: boolean;
};

export const FIELD_BASE =
  "w-full min-h-11 rounded-sm border bg-surface px-3 py-2.5 font-body text-[16px] text-ink " +
  "placeholder:text-slate focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-bronze disabled:opacity-60";

export const FIELD_BORDER = {
  valid: "border-navy",
  invalid: "border-error",
} as const;

export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cx(FIELD_BASE, invalid ? FIELD_BORDER.invalid : FIELD_BORDER.valid, className)}
    />
  );
}
