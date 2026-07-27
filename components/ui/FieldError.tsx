import { AlertCircle } from "lucide-react";
import { Icon } from "./Icon";

/**
 * A validation message, beneath the field it belongs to.
 *
 * Colour is never the only cue: the message carries an icon and reads as a
 * sentence, so it survives greyscale, colour blindness and a screen reader that
 * announces it through the field's description.
 *
 * Renders nothing when there is no message — a permanently reserved slot would
 * put an empty element under every field.
 */

type FieldErrorProps = {
  readonly id: string;
  readonly message?: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  if (message === undefined) return null;

  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 font-body text-[13px] text-error">
      <Icon icon={AlertCircle} size={16} className="mt-px text-error" />
      <span>{message}</span>
    </p>
  );
}
