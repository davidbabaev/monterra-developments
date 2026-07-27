import { cx } from "@/lib/cx";
import { FIELD_BASE, FIELD_BORDER } from "./Input";

/**
 * A native select, deliberately. A custom listbox would have to re-implement
 * typeahead, keyboard support and the platform's own picker on a phone, and it
 * would do all three worse.
 *
 * The chevron is drawn on the wrapper rather than the control, so the arrow
 * cannot swallow a click meant for the field.
 */

type SelectOption = {
  readonly value: string;
  readonly label: string;
};

type SelectProps = React.ComponentProps<"select"> & {
  readonly options: readonly SelectOption[];
  readonly invalid?: boolean;
};

export function Select({ options, invalid = false, className, ...props }: SelectProps) {
  return (
    <span className="relative block">
      <select
        {...props}
        aria-invalid={invalid || undefined}
        className={cx(
          FIELD_BASE,
          invalid ? FIELD_BORDER.invalid : FIELD_BORDER.valid,
          "appearance-none pr-10",
          className,
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-body text-[12px] text-navy"
      >
        ▾
      </span>
    </span>
  );
}
