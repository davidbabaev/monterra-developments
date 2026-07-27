/**
 * A JSON-LD block.
 *
 * `JSON.stringify` rather than a template literal, so a value carrying a quote
 * or an angle bracket cannot break out of the script element. The type is
 * `application/ld+json`, which browsers do not execute, and React does not
 * escape the contents of a script tag — hence dangerouslySetInnerHTML, which is
 * the documented way to do this and the reason the serialisation matters.
 */

type JsonLdProps = {
  readonly data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
