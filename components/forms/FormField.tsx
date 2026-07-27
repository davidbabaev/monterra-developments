import { FieldError } from "@/components/ui/FieldError";

/**
 * Label, control and message, wired together once.
 *
 * The aria plumbing is the part that quietly breaks — an id that does not match,
 * a describedby pointing at an element that is not rendered — so it is computed
 * here and handed to the control rather than repeated at five call sites.
 *
 * Required is marked in words as well as in the accessibility tree. An asterisk
 * alone is a convention, not an explanation, and a screen reader that reads it
 * as "star" tells the reader nothing.
 */

type ControlProps = {
  readonly id: string;
  readonly required: boolean;
  readonly invalid: boolean;
  readonly "aria-describedby": string | undefined;
};

type FormFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly children: (control: ControlProps) => React.ReactNode;
};

export function FormField({ id, label, required = false, error, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const invalid = error !== undefined;

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-2">
        <span className="font-display text-[15px] font-semibold text-navy">{label}</span>
        <span className="font-body text-[13px] text-slate">
          {required ? "Required" : "Optional"}
        </span>
      </label>

      <div className="mt-2">
        {children({
          id,
          required,
          invalid,
          "aria-describedby": invalid ? errorId : undefined,
        })}
      </div>

      <FieldError id={errorId} message={error} />
    </div>
  );
}
