import { getSchemaOrgGraph } from "@/lib/seo/schema";

export function SchemaOrg() {
  const schema = getSchemaOrgGraph();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
