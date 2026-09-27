/**
 * Renders a Schema.org JSON-LD block. Escapes "<" so a value containing
 * "</script>" (e.g. a product description) can't break out of the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
