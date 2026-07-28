/**
 * The placeholder marker, and the one question worth asking about it.
 *
 * Copy that is still `[REPLACE]` is fine on a page — a person reads it, sees the
 * marker and writes the real thing. It is not fine in anything a crawler or a
 * social preview consumes, because nobody looks at that before it is published.
 *
 * So metadata omits a marked value rather than emitting it, on the same principle
 * the project schema already follows for missing coordinates: a field left out is
 * a gap, a field filled with a marker is a false statement.
 */

export const PLACEHOLDER_MARKER = "[REPLACE]";

export function isPlaceholder(value: string | undefined): boolean {
  return value === undefined || value.includes(PLACEHOLDER_MARKER);
}

/** The value when it is real, or undefined when it is still a placeholder. */
export function realOrUndefined(value: string | undefined): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}
