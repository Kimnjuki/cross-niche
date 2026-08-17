import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

async function clean() {
  if (!client) {
    console.warn("Skipping placeholder cleanup: missing Convex URL (set VITE_CONVEX_URL or CONVEX_URL).");
    process.exit(0);
  }

  try {
    const result = await client.mutation("admin:cleanPlaceholderContent", {});
    console.log("Cleanup result:", result);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

clean();
