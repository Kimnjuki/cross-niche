/**
 * IOC reputation lookup — real threat-intel data.
 *
 * Wires the IOC Lookup tool to the free GreyNoise Community API (no key, IP-only,
 * ~50 lookups/day per IP) via a server-side action, so the browser never needs
 * an API key and never hits CORS. Non-IP indicator types (domain/hash/email/URL)
 * require a paid VirusTotal or AbuseIPDB key and return an honest "not wired"
 * result rather than fabricated data.
 *
 * Run from the client with useAction(api.iocLookup.lookupIOC).
 */
import { action } from './_generated/server';
import { v } from 'convex/values';

const GREYNOISE_COMMUNITY = 'https://api.greynoise.io/v3/community/';
const VT_BASE = 'https://www.virustotal.com/api/v3/';

function classifyFromVt(stats: Record<string, number>): string {
  if ((stats.malicious ?? 0) > 0) return 'malicious';
  if ((stats.suspicious ?? 0) > 0) return 'suspicious';
  if ((stats.harmless ?? 0) > 0) return 'benign';
  return 'unknown';
}

export const lookupIOC = action({
  args: { ioc: v.string(), type: v.string() },
  handler: async (_ctx, args) => {
    const { ioc, type } = args;

    // ── IP → GreyNoise Community (keyless) ────────────────────────────────
    if (type === 'ip') {
      try {
        const res = await fetch(`${GREYNOISE_COMMUNITY}${encodeURIComponent(ioc)}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (res.status === 429) {
          return { ok: false, ioc, type, reason: 'GreyNoise rate limit reached (~50 lookups/day on the free Community tier). Try again later.' };
        }
        if (res.status === 404) {
          // IP not seen by GreyNoise — treat as clean, not an error.
          return { ok: true, ioc, type, data: { ip: ioc, noise: false, riot: false, classification: 'unknown', message: 'Success' } };
        }
        if (!res.ok) {
          return { ok: false, ioc, type, reason: `GreyNoise returned HTTP ${res.status}.` };
        }
        const data = await res.json();
        return { ok: true, ioc, type, data };
      } catch (err) {
        return { ok: false, ioc, type, reason: `Lookup failed: ${(err as Error).message}` };
      }
    }

    // ── Non-IP → VirusTotal (VIRUSTOTAL_API_KEY) ───────────────────────────
    if (type === 'email') {
      return { ok: false, ioc, type, reason: 'Email lookup is not supported by these free tiers. Try the domain part instead.' };
    }

    const key = process.env.VIRUSTOTAL_API_KEY;
    if (!key) {
      return { ok: false, ioc, type, reason: 'VIRUSTOTAL_API_KEY is not configured on the server.' };
    }

    // URL needs a submit-then-fetch flow.
    if (type === 'url') {
      try {
        const submitRes = await fetch(`${VT_BASE}urls`, {
          method: 'POST',
          headers: { 'x-apikey': key, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ url: ioc }).toString(),
        });
        if (!submitRes.ok) {
          return { ok: false, ioc, type, reason: `VirusTotal submit returned HTTP ${submitRes.status}.` };
        }
        const submit = await submitRes.json();
        const id = submit?.data?.id;
        if (!id) return { ok: false, ioc, type, reason: 'VirusTotal submit returned no analysis id.' };
        const getRes = await fetch(`${VT_BASE}urls/${id}`, { headers: { 'x-apikey': key } });
        if (!getRes.ok) return { ok: false, ioc, type, reason: `VirusTotal URL lookup returned HTTP ${getRes.status}.` };
        const getData = await getRes.json();
        const stats = getData?.data?.attributes?.last_analysis_stats ?? {};
        return {
          ok: true, ioc, type,
          data: { source: 'virustotal', classification: classifyFromVt(stats), vtMalicious: stats.malicious ?? 0, vtSuspicious: stats.suspicious ?? 0, vtHarmless: stats.harmless ?? 0, vtTotal: (stats.malicious ?? 0) + (stats.suspicious ?? 0) + (stats.harmless ?? 0) + (stats.undetected ?? 0) },
        };
      } catch (err) {
        return { ok: false, ioc, type, reason: `VirusTotal URL lookup failed: ${(err as Error).message}` };
      }
    }

    // Domain / hash → direct lookup.
    const endpoint = type === 'domain' ? `domains/${encodeURIComponent(ioc)}` : `files/${encodeURIComponent(ioc)}`;
    try {
      const res = await fetch(`${VT_BASE}${endpoint}`, { headers: { 'x-apikey': key } });
      if (res.status === 404) {
        return { ok: true, ioc, type, data: { source: 'virustotal', classification: 'unknown', riskScore: 0 } };
      }
      if (!res.ok) {
        return { ok: false, ioc, type, reason: `VirusTotal returned HTTP ${res.status}.` };
      }
      const data = await res.json();
      const stats = data?.data?.attributes?.last_analysis_stats ?? {};
      return {
        ok: true, ioc, type,
        data: { source: 'virustotal', classification: classifyFromVt(stats), vtMalicious: stats.malicious ?? 0, vtSuspicious: stats.suspicious ?? 0, vtHarmless: stats.harmless ?? 0, vtTotal: (stats.malicious ?? 0) + (stats.suspicious ?? 0) + (stats.harmless ?? 0) + (stats.undetected ?? 0) },
      };
    } catch (err) {
      return { ok: false, ioc, type, reason: `VirusTotal failed: ${(err as Error).message}` };
    }
  },
});
