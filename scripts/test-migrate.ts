import { ConvexHttpClient } from "convex/browser";

const DEV_URL = "https://intent-akita-728.convex.cloud";
const PROD_URL = "https://canny-mule-83.convex.cloud";

const devClient = new ConvexHttpClient(DEV_URL);
const prodClient = new ConvexHttpClient(PROD_URL);

async function testInsert() {
  console.log("Fetching one item from dev...");
  const all = await devClient.query("content:getAllPublishedContent", {});
  const item = all[0];
  console.log("Dev item title:", item.title);
  console.log("Dev item keys:", Object.keys(item));

  const { author, ...rest } = item as any;

  console.log("\nAttempting insert into prod...");
  try {
    const result = await prodClient.mutation("import:insertContentBatch", {
      items: [rest],
    });
    console.log("Insert result:", result);
  } catch (error: any) {
    console.error("Insert error:", error.message);
    console.error("Full error:", error);
  }
}

testInsert();
