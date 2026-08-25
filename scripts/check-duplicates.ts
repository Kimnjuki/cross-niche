import { ConvexHttpClient } from "convex/browser";

const PROD_URL = "https://canny-mule-83.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);

async function checkDuplicates() {
  const all = await client.query("content:getAllPublishedContent", {});
  const byTitle = new Map<string, any[]>();
  
  for (const item of all) {
    const key = item.title.toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(item);
  }
  
  for (const [title, items] of byTitle.entries()) {
    if (items.length > 1) {
      console.log(`\nDuplicate: "${title}"`);
      for (const item of items) {
        console.log(`  - ${item._id}: ${item.slug} (created: ${item._creationTime})`);
      }
    }
  }
}

checkDuplicates();
