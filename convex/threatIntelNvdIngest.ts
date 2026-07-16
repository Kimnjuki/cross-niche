import { action, internalAction, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// NVD 2.0 API documentation: https://nvd.nist.gov/developers/vulnerabilities
// We support optional API key via Convex env var: NVD_API_KEY
const NVD_API_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";

// Gaming platforms we care about
const GAMING_PLATFORMS = [
  "steam",
  "epic",
  "epic games",
  "riot",
  "riot games",
  "blizzard",
  "activision",
  "ea",
  "electronic arts",
  "discord",
  "roblox",
  "playstation",
  "ps4",
  "ps5",
  "xbox",
  "xbox one",
  "xbox series x",
  "xbox series s",
  "nintendo",
  "switch",
  "mobile",
  "android",
  "ios",
  "iphone",
  "ipad"
] as const;

// Game-related keywords that might indicate gaming relevance
const GAME_KEYWORDS = [
  "game",
  "gaming",
  "steam",
  "epic",
  "riot",
  "blizzard",
  "activision",
  "ea",
  "electronic arts",
  "discord",
  "roblox",
  "playstation",
  "xbox",
  "nintendo",
  "switch",
  "mobile",
  "android",
  "ios",
  "cheat",
  "hack",
  "aimbot",
  "wallhack",
  "exploit",
  "vulnerability",
  "zero day",
  "0-day",
  "credential",
  "account",
  "login",
  "password",
  "phishing",
  "malware",
  "trojan",
  "ransomware",
  "in-game",
  "virtual currency",
  "skin",
  "loot box",
  "microtransaction",
  "dlc",
  "mod",
  "modded",
  "server",
  "lobby",
  "matchmaking"
] as const;

type NvdReference = { url?: string; source?: string };

type NvdCve = {
  id?: string;
  published?: string;
  lastModified?: string;
  descriptions?: Array<{ lang?: string; value?: string }>;
  metrics?: unknown;
  weaknesses?: Array<{ description?: Array<{ lang?: string; value?: string }> }>;
  references?: NvdReference[];
};

type NvdResponse = {
  vulnerabilities?: Array<{ cve?: NvdCve }>;
};

interface GamingAnalysis {
  isGamingRelated: boolean;
  confidence: number; // 0-1
  detectedPlatforms: string[];
  detectedKeywords: string[];
}

function parseDateMs(value?: string): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function pickEnglish(values?: Array<{ lang?: string; value?: string }>): string | undefined {
  const en = (values ?? []).find((d) => d?.lang === "en" && typeof d.value === "string");
  return en?.value;
}

function extractCvssBaseScore(metrics: any): number | null {
  const containers: any[] = [];
  if (metrics?.cvssMetricV31) containers.push(...metrics.cvssMetricV31);
  if (metrics?.cvssMetricV30) containers.push(...metrics.cvssMetricV30);
  if (metrics?.cvssMetricV2) containers.push(...metrics.cvssMetricV2);

  for (const m of containers) {
    const score = m?.cvssData?.baseScore;
    if (typeof score === "number" && Number.isFinite(score)) return score;
  }
  return null;
}

function toSeverity(score: number | null): "critical" | "high" | "medium" | "low" {
  if (score == null) return "medium";
  if (score >= 9.0) return "critical";
  if (score >= 7.0) return "high";
  if (score >= 4.0) return "medium";
  return "low";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Analyze text for gaming relevance
 */
function analyzeGamingRelevance(text: string): GamingAnalysis {
  if (!text) {
    return { isGamingRelated: false, confidence: 0, detectedPlatforms: [], detectedKeywords: [] };
  }

  const lowerText = text.toLowerCase();
  
  // Detect gaming platforms
  const detectedPlatforms = GAMING_PLATFORMS.filter(platform => 
    lowerText.includes(platform)
  );
  
  // Detect game-related keywords
  const detectedKeywords = GAME_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword)
  );
  
  // Calculate confidence score
  let confidence = 0;
  
  // Platform detection is strong evidence
  if (detectedPlatforms.length > 0) {
    confidence += 0.4;
  }
  
  // Keyword detection contributes to confidence
  if (detectedKeywords.length > 0) {
    confidence += Math.min(0.4, detectedKeywords.length * 0.1);
  }
  
  // Additional boost for specific high-risk terms
  const highRiskTerms = ["cheat", "hack", "aimbot", "wallhack", "credential", "account", "phishing"];
  const highRiskMatches = highRiskTerms.filter(term => lowerText.includes(term));
  if (highRiskMatches.length > 0) {
    confidence += 0.2;
  }
  
  // Cap confidence at 1.0
  confidence = Math.min(1.0, confidence);
  
  // Consider it gaming-related if confidence > 0.3
  const isGamingRelated = confidence > 0.3;
  
  return {
    isGamingRelated,
    confidence,
    detectedPlatforms: [...new Set(detectedPlatforms)], // Remove duplicates
    detectedKeywords: [...new Set(detectedKeywords)]   // Remove duplicates
  };
}

/**
 * Calculate gamer impact score based on CVSS and gaming relevance
 */
function calculateGamerImpactScore(
  cvssScore: number | null,
  isGamingRelated: boolean,
  platforms: string[],
  affectedSystems: string[]
): number {
  if (!isGamingRelated) return 0;
  
  // Base score from CVSS (0-100 scale)
  const baseScore = (cvssScore ?? 5) * 10;  // Convert 0-10 to 0-100
  
  // Platform multiplier (more platforms = higher impact)
  const platformMultiplier = 1 + Math.min(0.5, platforms.length * 0.1);
  
  // Severity bonus for critical/high severity
  const severityBonus = (cvssScore != null && cvssScore >= 7.0) ? 0.2 : 0;
  
  // Calculate final score
  let score = baseScore * (1 + platformMultiplier + severityBonus);
  
  // Cap at 100
  return Math.min(100, Math.round(score));
}

/**
 * Extract potential game slugs from text
 */
function extractGameSlugs(text: string): string[] {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const foundSlugs = new Set<string>();
  
  // Common game titles/keywords that might become slugs
  const gameIndicators = [
    "fortnite", "call of duty", "cod", "warzone", "minecraft", "roblox",
    "league of legends", "lol", "dota 2", "counter-strike", "csgo", "valorant",
    "apex legends", "gta", "grand theft auto", "red dead", "fifa", "madden",
    "nba", "battlefield", "overwatch", "wow", "world of warcraft",
    "hearthstone", "diablo", "starcraft", "heroes of the storm"
  ];
  
  for (const game of gameIndicators) {
    if (lowerText.includes(game)) {
      // Convert to slug format
      const slug = game.replace(/[^a-z0-9]+/g, "-").toLowerCase();
      foundSlugs.add(slug);
    }
  }
  
  return Array.from(foundSlugs);
}

async function runNvdLogic(
  ctx: ActionCtx,
  args: { hoursBack: number; maxResults: number }
): Promise<{ ok: boolean; ingested: number; errors?: string[] }> {
  const errors: string[] = [];
  let ingested = 0;

  const hoursBack = Math.min(Math.max(args.hoursBack, 1), 168);
  const maxResults = Math.min(Math.max(args.maxResults, 10), 2000);

  const now = Date.now();
  const startDate = new Date(now - hoursBack * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    pubStartDate: startDate,
    resultsPerPage: String(Math.min(maxResults, 2000)),
  });

  const apiKey = process.env.NVD_API_KEY;
  const headers: Record<string, string> = apiKey ? { apiKey } : {};

  let res: Response;
  try {
    res = await fetch(`${NVD_API_BASE}?${params.toString()}`, { headers });
  } catch (e) {
    errors.push(`NVD fetch: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, ingested: 0, errors };
  }

  if (!res.ok) {
    errors.push(`NVD fetch failed: ${res.status} ${res.statusText}`);
    return { ok: false, ingested: 0, errors };
  }

  let data: NvdResponse;
  try {
    data = (await res.json()) as NvdResponse;
  } catch (e) {
    errors.push(`NVD JSON parse: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, ingested: 0, errors };
  }

  const vulns: Array<{ cve?: NvdCve }> = Array.isArray(data.vulnerabilities)
    ? data.vulnerabilities
    : [];

  for (const wrapper of vulns) {
    const cve = wrapper.cve;
    const cveId = (cve?.id ?? "").trim();
    if (!cveId) continue;

    const desc = pickEnglish(cve?.descriptions) ?? "";
    const publishedAt = parseDateMs(cve?.published) ?? Date.now();
    const score = extractCvssBaseScore(cve?.metrics);
    const severity = toSeverity(score);

    const referenceUrl = (cve?.references ?? []).find((r: NvdReference) => typeof r?.url === "string")?.url;

    // Gaming relevance analysis
    const gamingAnalysis = analyzeGamingRelevance(`${cveId} ${desc}`);
    const isGamingRelated = gamingAnalysis.isGamingRelated;
    const gamerImpactScore = calculateGamerImpactScore(
      score,
      isGamingRelated,
      gamingAnalysis.detectedPlatforms,
      []  // NVD doesn't directly provide affected systems in a simple format
    );
    const gameSlugs = extractGameSlugs(`${cveId} ${desc}`);

    try {
      const result = await ctx.runMutation(api.threatIntel.upsertThreat, {
        source: "nvd",
        sourceId: cveId,
        title: cveId,
        description: desc || undefined,
        severity,
        category: "NVD CVE",
        publishedAt,
        url: referenceUrl ?? `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cveId)}`,
        cveIds: [cveId],
        tags: ["cve", ...(isGamingRelated ? ["gaming"] : [])],
        raw: {
          cveId,
          cvssBaseScore: score,
          weaknesses: cve?.weaknesses,
          references: cve?.references,
          lastModified: cve?.lastModified,
          // Include gaming analysis in raw data for debugging
          gamingAnalysis
        },
      });
      if (result?.inserted) ingested++;
    } catch (e) {
      errors.push(`Upsert ${cveId}: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Keep well under NVD rate limits.
    await sleep(150);
  }

  return { ok: errors.length === 0 || ingested > 0, ingested, errors: errors.length ? errors : undefined };
}

export const runNvdIngestion = internalAction({
  args: {
    hoursBack: v.number(),
    maxResults: v.number(),
  },
  handler: async (ctx, args) => {
    return runNvdLogic(ctx, args);
  },
});

export const runNvdIngestionPublic = action({
  args: {
    hoursBack: v.optional(v.number()),
    maxResults: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return runNvdLogic(ctx, {
      hoursBack: args.hoursBack ?? 24,
      maxResults: args.maxResults ?? 200,
    });
  },
});