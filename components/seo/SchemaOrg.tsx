import { getActiveReviews } from "@/lib/data/reviews";
import { getSchemaOrgGraph } from "@/lib/seo/schema";

export async function SchemaOrg() {
  const reviews = await getActiveReviews();
  const schema = getSchemaOrgGraph(reviews);

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
