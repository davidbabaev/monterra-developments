import { cx } from "@/lib/cx";
import { FIELD_BASE, FIELD_BORDER } from "./Input";

/** The same field treatment as Input, sized for prose. See Input for the border. */

type TextareaProps = React.ComponentProps<"textarea"> & {
  readonly invalid?: boolean;
};

export function Textarea({ invalid = false, className, rows = 6, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cx(
        FIELD_BASE,
        invalid ? FIELD_BORDER.invalid : FIELD_BORDER.valid,
        "resize-y",
        className,
      )}
    />
  );
}
