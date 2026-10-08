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

export const lookupIOC = action({
  args: { ioc: v.string(), type: v.string() },
  handler: async (_ctx, args) => {
    const { ioc, type } = args;

    if (type !== 'ip') {
      return {
        ok: false,
        ioc,
        type,
        reason: `Free tier covers IP addresses only. ${type} lookup requires a VirusTotal or AbuseIPDB API key (not yet wired).`,
      };
    }

    try {
      const res = await fetch(`${GREYNOISE_COMMUNITY}${encodeURIComponent(ioc)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (res.status === 429) {
        return {
          ok: false,
          ioc,
          type,
          reason: 'GreyNoise rate limit reached (~50 lookups/day on the free Community tier). Try again later.',
        };
      }
      if (res.status === 404) {
        // IP not seen by GreyNoise — treat as clean, not an error.
        return {
          ok: true,
          ioc,
          type,
          data: { ip: ioc, noise: false, riot: false, classification: 'unknown', message: 'Success' },
        };
      }
      if (!res.ok) {
        return { ok: false, ioc, type, reason: `GreyNoise returned HTTP ${res.status}.` };
      }

      const data = await res.json();
      return { ok: true, ioc, type, data };
    } catch (err) {
      return { ok: false, ioc, type, reason: `Lookup failed: ${(err as Error).message}` };
    }
  },
});
