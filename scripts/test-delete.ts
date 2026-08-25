import { ConvexHttpClient } from "convex/browser";

const PROD_URL = "https://canny-mule-83.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);

async function testDelete() {
  try {
    const result = await client.mutation("admin/runSoftDeleteContent:runSoftDeleteContent", {
      contentId: "jd7344nsgjxd1bpxbtbv4sngh58d5qy5",
    });
    console.log("Delete result:", result);
  } catch (error: any) {
    console.error("Delete error:", error.message);
    console.error("Full error:", error);
  }
}

testDelete();
