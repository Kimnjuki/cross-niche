import { ConvexHttpClient } from "convex/browser";
import { writeFile } from "fs/promises";
import { resolve } from "path";

// Convex URL - falls back to production deployment for CI/Docker builds
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://intent-akita-728.convex.cloud";

if (!CONVEX_URL || CONVEX_URL.includes("your-deployment")) {
  console.warn("VITE_CONVEX_URL not set; using fallback:", CONVEX_URL);
}

const client = new ConvexHttpClient(CONVEX_URL);

type ContentItem = {
  id: string;
  slug: string;
  // Add other fields as needed
};

type GuideItem = {
  id: string;
  slug: string;
  // Add other fields as needed
};

async function fetchPublishedContent(): Promise<ContentItem[]> {
  try {
    // Use the existing query to get all published content
    const content = await client.query("content:getAllPublishedContent", {});
    // Filter to ensure we only get published items (the query should already do this)
    return content.map((item: any) => ({
      id: item._id || item.id,
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Error fetching published content:", error);
    return [];
  }
}

async function fetchPublishedGuides(): Promise<GuideItem[]> {
  try {
    // Use the guides list query to get all published guides
    // We'll call it without filters to get all, then filter by isPublished
    const response = await client.query("guides:list", {
      limit: 1000, // Fetch a large number to get all
    });
    const guides = response as any[];
    // Filter to only published guides
    return guides
      .filter((g: any) => g.isPublished !== false)
      .map((g: any) => ({
        id: g._id || g.id,
        slug: g.slug,
      }));
  } catch (error) {
    console.error("Error fetching published guides:", error);
    return [];
  }
}

async function main() {
  try {
    // Fetch published content and guides in parallel
    const [contentItems, guideItems] = await Promise.all([
      fetchPublishedContent(),
      fetchPublishedGuides(),
    ]);

    // Build routes array
    const routes: string[] = [
      // Static routes
      "/",
      "/tech",
      "/security",
      "/gaming",
      "/news",
      "/topics",
      "/guides",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/roadmap",
      "/blog",
      "/security-profile",
      "/community-threats",
      "/tools",
    ];

    // Add dynamic routes for articles
    contentItems.forEach((item) => {
      if (item.slug) {
        routes.push(`/article/${item.slug}`);
      }
    });

    // Add dynamic routes for guides
    guideItems.forEach((item) => {
      if (item.slug) {
        routes.push(`/guides/${item.slug}`);
      }
    });

    // Remove duplicates (though unlikely) and sort for consistency
    const uniqueRoutes = [...new Set(routes)].sort();

    // Write to file
    const outputPath = resolve(process.cwd(), "prerender-routes.json");
    await writeFile(outputPath, JSON.stringify(uniqueRoutes, null, 2), "utf8");
    console.log(`Generated ${uniqueRoutes.length} routes for prerendering`);
  } catch (error) {
    console.error("Failed to generate routes:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error in generate-routes:", error);
  process.exit(1);
});