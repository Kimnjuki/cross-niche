/**
 * CVE lookup via the NVD API (NVD_API_KEY, server-side).
 *
 * Queries the NIST National Vulnerability Database for recent CVEs matching a
 * software keyword. The key lives in a Convex env var and never reaches the
 * browser. Used by the Exploit Risk Meter to show real, dated CVE data.
 *
 * Run from the client with useAction(api.cveLookup.lookupCVEs).
 */
import { action } from './_generated/server';
import { v } from 'convex/values';

export const lookupCVEs = action({
  args: { keyword: v.string() },
  handler: async (_ctx, args) => {
    const key = process.env.NVD_API_KEY;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (key) headers.apiKey = key;

    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(args.keyword)}&resultsPerPage=5`;

    try {
      const res = await fetch(url, { headers });
      if (res.status === 403) {
        return { ok: false, reason: 'NVD rate limit reached — try again later.' };
      }
      if (!res.ok) {
        return { ok: false, reason: `NVD returned HTTP ${res.status}.` };
      }
      const data = await res.json();
      const cves = (data?.vulnerabilities ?? []).map((v: Record<string, any>) => {
        const cve = v?.cve ?? {};
        const metrics = cve?.metrics?.cvssMetricV31?.[0]?.cvssData
          ?? cve?.metrics?.cvssMetricV30?.[0]?.cvssData
          ?? cve?.metrics?.cvssMetricV2?.[0]?.cvssData;
        return {
          id: cve?.id ?? 'unknown',
          description: (cve?.descriptions?.[0]?.value ?? '').slice(0, 220),
          cvss: metrics?.baseScore ?? null,
          severity: metrics?.baseSeverity ?? null,
          published: cve?.published ?? '',
        };
      });
      return { ok: true, cves, total: data?.totalResults ?? cves.length };
    } catch (err) {
      return { ok: false, reason: `NVD lookup failed: ${(err as Error).message}` };
    }
  },
});
