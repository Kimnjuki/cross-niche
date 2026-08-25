import { ConvexHttpClient } from "convex/browser";

const PROD_URL = "https://canny-mule-83.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);

async function fixDuplicates() {
  const all = await client.query("content:getAllPublishedContent", {});
  const byTitle = new Map<string, any[]>();
  
  for (const item of all) {
    const key = item.title.toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(item);
  }
  
  for (const [title, items] of byTitle.entries()) {
    if (items.length > 1) {
      console.log(`\nFixing duplicate: "${title}"`);
      const [keep, ...duplicates] = items.sort((a, b) => a._creationTime - b._creationTime);
      console.log(`  Keeping: ${keep._id} (created: ${keep._creationTime})`);
      
      for (const dup of duplicates) {
        try {
          await client.mutation("admin:runSoftDeleteContent", { contentId: dup._id });
          console.log(`  Deleted: ${dup._id}`);
        } catch (error) {
          console.error(`  Failed to delete ${dup._id}:`, error);
        }
      }
    }
  }
  
  console.log("\nDuplicate fix complete.");
}

fixDuplicates();
