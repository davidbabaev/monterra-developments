/** Joins class names, dropping anything falsy. No dependency needed for this. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
