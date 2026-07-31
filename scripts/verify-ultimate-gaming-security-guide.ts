import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? "https://intent-akita-728.convex.cloud";
const SLUG = "ultimate-guide-steam-xbox-playstation-discord-security";

const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  console.log(`Verifying seed for slug "${SLUG}" on ${CONVEX_URL}`);
  const content: any = await client.query("content:getContentBySlug" as any, { slug: SLUG });
  if (!content) {
    console.error("Content NOT found!");
    process.exit(1);
  }
  console.log("=== Content ===");
  console.log("ID:", content._id);
  console.log("Title:", content.title);
  console.log("Status:", content.status);
  console.log("FeaturedImageUrl:", content.featuredImageUrl);
  console.log("AuthorId:", content.authorId);
  console.log("Body length:", content.body?.length);
  console.log("Has placeholder {{IMAGE_1_URL}}:", content.body?.includes("{{IMAGE_1_URL}}"));
  console.log("Body has storage URL:", content.body?.includes("intent-akita-728.convex.cloud/api/storage/"));
  console.log("WordCount:", content.wordCount);
  console.log("ContentType:", content.contentType);
  console.log("GamingPlatforms:", JSON.stringify(content.gamingPlatforms));
}

main().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});