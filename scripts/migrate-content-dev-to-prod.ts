import { ConvexHttpClient } from "convex/browser";

const DEV_URL = "https://intent-akita-728.convex.cloud";
const PROD_URL = "https://canny-mule-83.convex.cloud";

const devClient = new ConvexHttpClient(DEV_URL);
const prodClient = new ConvexHttpClient(PROD_URL);

async function migrate() {
  console.log("Fetching all content from dev deployment...");
  const allContent = await devClient.query("content:getAllPublishedContent", {});
  const published = allContent.filter((c: any) => c.status === "published");
  console.log(`Found ${published.length} published items in dev`);

  let inserted = 0;
  let failed = 0;

  for (const item of published) {
    try {
      const contentId = await prodClient.mutation("content:upsertIngestedContent", {
        title: item.title,
        slug: item.slug,
        body: item.body,
        summary: item.summary,
        contentType: item.contentType,
        source: item.source,
        originalUrl: item.originalUrl,
        externalId: item.externalId,
        featuredImageUrl: item.featuredImageUrl,
        authorId: item.authorId,
        publishedAt: item.publishedAt,
        isAutomated: item.isAutomated,
        status: item.status,
      });

      await prodClient.mutation("content:updateSEOFields", {
        contentId,
        metaTitle: item.metaTitle,
        seoDescription: item.seoDescription,
        focusKeyword: item.focusKeyword,
      });

      inserted++;
      if (inserted % 10 === 0) {
        console.log(`Inserted ${inserted}/${published.length}...`);
      }
    } catch (error) {
      failed++;
      console.error(`Failed: ${item.title}`, error);
    }
  }

  console.log(`\nMigration complete. Inserted: ${inserted}, Failed: ${failed}`);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
