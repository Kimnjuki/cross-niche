import { action, internalAction, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// NVD 2.0 API documentation: https://nvd.nist.gov/developers/vulnerabilities
// We support optional API key via Convex env var: NVD_API_KEY
const NVD_API_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";

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
        tags: ["cve"],
        raw: {
          cveId,
          cvssBaseScore: score,
          weaknesses: cve?.weaknesses,
          references: cve?.references,
          lastModified: cve?.lastModified,
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
