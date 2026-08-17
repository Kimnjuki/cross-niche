import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const PLACEHOLDER_PATTERNS = [
  /^Sec\s+\d+(\s*\|.*)?$/i,
  /^Tech\s+\d+(\s*\|.*)?$/i,
  /^Game\s+\d+(\s*\|.*)?$/i,
  /^Rivacy(\s*\|.*)?$/i,
];

function isPlaceholderTitle(title: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(title.trim()));
}

async function audit() {
  if (!client) {
    console.warn("Skipping placeholder audit: missing Convex URL (set VITE_CONVEX_URL or CONVEX_URL).");
    process.exit(0);
  }

  try {
    const results = await client.query("content:listAll", {});

    const published = (results ?? []).filter(
      (c: any) => c.status === "published" && c.isDeleted !== true
    );

    const offenders = published.filter((c: any) => isPlaceholderTitle(c.title ?? ""));

    if (offenders.length > 0) {
      console.error(`Found ${offenders.length} published placeholder content row(s):`);
      for (const item of offenders) {
        console.error(` - ${item._id}: ${item.title}`);
      }
      process.exit(1);
    }

    console.log(`Placeholder audit passed. Checked ${published.length} published content rows.`);
  } catch (error) {
    console.error("Audit failed:", error);
    process.exit(1);
  }
}

audit();
