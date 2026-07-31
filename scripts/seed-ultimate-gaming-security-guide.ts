/**
 * seed-ultimate-gaming-security-guide.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Uploads the 3 article images into thegridnexus.com Convex storage, then calls
 * seedUltimateGamingSecurityGuide to insert:
 *   authors -> topics -> feeds -> tags -> content -> contentTags -> contentFeeds
 *   -> media -> editorialStandards
 *
 * Source images (relative to repo root):
 *   assets/steam-security-guide-image1.jpeg
 *   assets/steam-security-guide-image2.jpeg
 *   assets/steam-security-guide-image3.png
 *
 * Run via:  npx tsx scripts/seed-ultimate-gaming-security-guide.ts
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? "https://intent-akita-728.convex.cloud";

const IMAGE_FILES = [
  { path: "assets/steam-security-guide-image1.jpeg", contentType: "image/jpeg" },
  { path: "assets/steam-security-guide-image2.jpeg", contentType: "image/jpeg" },
  { path: "assets/steam-security-guide-image3.png", contentType: "image/png" },
];

async function uploadImage(
  client: ConvexHttpClient,
  filePath: string,
  contentType: string
): Promise<string> {
  const uploadUrl = (await client.mutation("generateUploadUrl:generateUploadUrl" as any)) as string;
  const fileBytes = await readFile(resolve(filePath));

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body: fileBytes,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed for ${filePath}: ${response.status} ${await response.text()}`
    );
  }

  const result = (await response.json()) as { storageId: string };
  if (!result.storageId) {
    throw new Error(`No storageId returned for ${filePath}: ${JSON.stringify(result)}`);
  }

  console.log(`✅ Uploaded ${filePath} -> storageId ${result.storageId}`);
  return result.storageId;
}

async function main() {
  console.log("🚀 Starting Ultimate Gaming Security Guide seed...");
  console.log(`🌐 Convex URL: ${CONVEX_URL}`);

  const client = new ConvexHttpClient(CONVEX_URL);

  // ── Step 1: Upload all 3 images → storageIds ─────────────────────────────
  const storageIds: string[] = [];
  for (const image of IMAGE_FILES) {
    const storageId = await uploadImage(client, image.path, image.contentType);
    storageIds.push(storageId);
  }

  console.log("🖼️  All 3 images uploaded to Convex storage.");
  console.log("📝 Calling seedUltimateGamingSecurityGuide mutation...");

  // ── Step 2: Seed authors / topics / feeds / tags / content / joins / media ─
  const result = await client.mutation("seedUltimateGamingSecurityGuide:seedUltimateGamingSecurityGuide" as any, {
    image1StorageId: storageIds[0],
    image2StorageId: storageIds[1],
    image3StorageId: storageIds[2],
  });

  console.log("🎉 Seed result:");
  console.log(JSON.stringify(result, null, 2));

  if (result?.skipped) {
    console.log(`⚠️  ${result.message}`);
  } else {
    console.log(`✅ ${result?.message ?? "Seed completed successfully."}`);
    console.log(`   Content ID: ${result?.contentId}`);
    console.log(`   Author Kim ID: ${result?.authorKimId}`);
    console.log(`   Author Jackson ID: ${result?.authorJacksonId}`);
    console.log(`   Topic ID: ${result?.topicId}`);
    console.log(`   Feed ID: ${result?.feedId}`);
    console.log(`   Tags: ${Object.keys(result?.tagIds ?? {}).length}`);
    console.log(`   ContentTags created: ${result?.contentTagsCreated}`);
    console.log(`   Media inserted: ${result?.mediaInserted}`);
    console.log(`   EditorialStandards: ${result?.editorialStandardsCreated}`);
  }
}

main().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});