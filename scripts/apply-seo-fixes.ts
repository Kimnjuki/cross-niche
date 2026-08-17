import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

async function applyHomepageRepositioning() {
  if (!client) {
    console.warn("Skipping SEO fix: missing Convex URL (set VITE_CONVEX_URL or CONVEX_URL).");
    process.exit(0);
  }

  try {
    const result = await client.mutation("admin:updateHomepagePositioning", {
      title: "Gaming Security Intelligence for Players | The Grid Nexus",
      description: "Protect gaming accounts, PCs, and identity with security checkups, threat explainers, and tested guides. Practical gaming-security intelligence from The Grid Nexus.",
      heroHeadline: "Gaming security intelligence for players, parents, and competitive teams.",
      heroSubheadline: "Protect accounts, PCs, consoles, communities, and digital identity with practical security checkups, threat explainers, and tested guides.",
      primaryCta: "Run the free Gaming Security Checkup / Steam Security Scanner",
      secondaryCta: "Explore latest gaming-security intelligence",
    });
    console.log("Homepage repositioning applied:", result);
  } catch (error) {
    console.error("Failed to apply homepage repositioning:", error);
    process.exit(1);
  }
}

applyHomepageRepositioning();
