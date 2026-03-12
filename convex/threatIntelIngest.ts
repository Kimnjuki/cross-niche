import { action, internalAction, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";

const CISA_KEV_URL =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

type KevVulnerability = {
  cveID?: string;
  vendorProject?: string;
  product?: string;
  vulnerabilityName?: string;
  shortDescription?: string;
  dateAdded?: string;
  dueDate?: string;
  requiredAction?: string;
  knownRansomwareCampaignUse?: string;
  notes?: string;
};

type KevFeed = {
  title?: string;
  catalogVersion?: string;
  dateReleased?: string;
  count?: number;
  vulnerabilities?: KevVulnerability[];
};

function parseDateMs(value?: string): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function toSeverity(v: KevVulnerability): "critical" | "high" | "medium" | "low" {
  const ransomware = (v.knownRansomwareCampaignUse ?? "").toLowerCase();
  if (ransomware.includes("known")) return "critical";
  return "high";
}

function toTitle(v: KevVulnerability): string {
  const parts = [v.vendorProject, v.product, v.vulnerabilityName].filter(Boolean);
  const base = parts.join(" — ");
  return base || (v.cveID ? `CVE ${v.cveID}` : "CISA KEV Item");
}

async function runKevLogic(
  ctx: ActionCtx
): Promise<{ ok: boolean; ingested: number; errors?: string[] }> {
  const errors: string[] = [];
  let ingested = 0;

  let res: Response;
  try {
    res = await fetch(CISA_KEV_URL);
  } catch (e) {
    errors.push(`CISA KEV fetch: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, ingested: 0, errors };
  }

  if (!res.ok) {
    errors.push(`CISA KEV fetch failed: ${res.status} ${res.statusText}`);
    return { ok: false, ingested: 0, errors };
  }

  let data: KevFeed;
  try {
    data = (await res.json()) as KevFeed;
  } catch (e) {
    errors.push(`CISA KEV JSON parse: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, ingested: 0, errors };
  }

  const items = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];
  const catalogUrl = "https://www.cisa.gov/known-exploited-vulnerabilities-catalog";

  for (const v of items) {
    const cveId = (v.cveID ?? "").trim();
    if (!cveId) continue;

    const publishedAt = parseDateMs(v.dateAdded) ?? Date.now();

    try {
      const result = await ctx.runMutation(api.threatIntel.upsertThreat, {
        source: "cisa_kev",
        sourceId: cveId,
        title: toTitle(v),
        description: v.shortDescription ?? v.requiredAction ?? undefined,
        severity: toSeverity(v),
        category: "CISA KEV",
        publishedAt,
        url: catalogUrl,
        cveIds: [cveId],
        affected: [v.vendorProject, v.product].filter(Boolean) as string[],
        tags: [
          "kev",
          (v.knownRansomwareCampaignUse ?? "").toLowerCase().includes("known")
            ? "ransomware"
            : "",
        ].filter(Boolean) as string[],
        raw: {
          ...v,
          catalogVersion: data.catalogVersion,
          dateReleased: data.dateReleased,
        },
      });
      if (result?.inserted) ingested++;
    } catch (e) {
      errors.push(`Upsert ${cveId}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return { ok: errors.length === 0 || ingested > 0, ingested, errors: errors.length ? errors : undefined };
}

export const runKevIngestion = internalAction({
  args: {},
  handler: async (ctx) => {
    return runKevLogic(ctx);
  },
});

export const runKevIngestionPublic = action({
  args: {},
  handler: async (ctx) => {
    return runKevLogic(ctx);
  },
});
