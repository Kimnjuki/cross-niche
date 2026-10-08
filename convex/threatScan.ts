/**
 * Threat scan via urlscan.io (URLSCAN_API_KEY, server-side).
 *
 * Submits a URL to urlscan.io and polls for the verdict. Returns the real
 * malicious/suspicious/clean classification, score, page info and the report
 * link — replacing the previous Math.random() mock. The API key lives in a
 * Convex env var and never reaches the browser.
 *
 * Run from the client with useAction(api.threatScan.scanUrl).
 */
import { action } from './_generated/server';
import { v } from 'convex/values';

export const scanUrl = action({
  args: { url: v.string() },
  handler: async (_ctx, args) => {
    const key = process.env.URLSCAN_API_KEY;
    if (!key) return { ok: false, reason: 'URLSCAN_API_KEY is not configured on the server.' };

    let target = args.url.trim();
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

    try {
      const submitRes = await fetch('https://urlscan.io/api/v1/scan/', {
        method: 'POST',
        headers: { 'API-Key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, visibility: 'public' }),
      });
      if (!submitRes.ok) {
        return { ok: false, reason: `urlscan.io submit returned HTTP ${submitRes.status}.` };
      }
      const submit = await submitRes.json();
      const uuid = submit?.uuid;
      const api = submit?.api;
      if (!uuid || !api) return { ok: false, reason: 'urlscan.io returned no scan uuid.' };

      // Poll for the result (bounded ~30s; urlscan scans typically take 10–60s).
      for (let i = 0; i < 10; i += 1) {
        await new Promise((r) => setTimeout(r, 3000));
        const res = await fetch(api, { headers: { 'API-Key': key } });
        if (res.status === 200) {
          const data = await res.json();
          const overall = data?.verdicts?.overall ?? {};
          return {
            ok: true,
            uuid,
            resultUrl: data?.task?.reportURL ?? `https://urlscan.io/result/${uuid}/`,
            pageUrl: data?.page?.url ?? target,
            domain: data?.page?.domain ?? '',
            ip: data?.page?.ip ?? '',
            tlsValid: data?.page?.tlsValid === true,
            malicious: overall.malicious === true,
            score: overall.score ?? 0,
            categories: overall.categories ?? [],
            brands: overall.brands ?? [],
            requests: data?.stats?.requests?.total ?? 0,
            uniqIps: data?.stats?.uniqIPs ?? 0,
          };
        }
        // 404 / not-ready — keep polling.
      }
      return { ok: true, pending: true, uuid, resultUrl: `https://urlscan.io/result/${uuid}/`, message: 'Scan still processing — check the report link.' };
    } catch (err) {
      return { ok: false, reason: `urlscan.io scan failed: ${(err as Error).message}` };
    }
  },
});
