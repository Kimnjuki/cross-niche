import { ConvexHttpClient } from "convex/browser";

const DEV_URL = "https://intent-akita-728.convex.cloud";
const PROD_URL = "https://canny-mule-83.convex.cloud";

const devClient = new ConvexHttpClient(DEV_URL);
const prodClient = new ConvexHttpClient(PROD_URL);

async function testUpsert() {
  const all = await devClient.query("content:getAllPublishedContent", {});
  const item = all[0];
  console.log("Testing upsert with:", item.title);

  try {
    const result = await prodClient.mutation("content:upsertIngestedContent", {
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
    console.log("Upsert result:", result);
  } catch (error: any) {
    console.error("Upsert error:", error.message);
  }
}

testUpsert();
