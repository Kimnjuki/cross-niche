/**
 * Adsterra Configuration — central place for all Adsterra keys.
 *
 * You gave ID `6088150`. Paste your REAL codes from
 * Adsterra Dashboard > Websites > (your site) > Ad units into the fields
 * below and everything lights up — no other file needs editing.
 *
 * Popunder example from Adsterra looks like:
 *   <script src="//pl6088150.highperformanceformat.com/ab/cd/ef/abcdef....js"></script>
 *   — paste the full src URL into `popunder.scriptSrc`.
 *
 * Native Banner example from Adsterra looks like:
 *   <script>atOptions = { key:'abc123...', format:'iframe', height:250, width:300, params:{} };</script>
 *   <script src="//www.highperformanceformat.com/abc123.../invoke.js"></script>
 *   — paste `key`, `width`, `height` per placement below.
 */

export const ADSTERRA_CONFIG = {
  enabled: true,

  // ── Popunder (site-wide, frequency-capped) ──────────────────────────────
  popunder: {
    enabled: true,
    // TODO: replace with your real Popunder script URL from Adsterra.
    // Keep the leading `//` (protocol-relative) exactly as Adsterra gives it.
    // Example: '//pl6088150.highperformanceformat.com/xx/yy/zz/...js'
    scriptSrc: '//pl6088150.highperformanceformat.com/placeholder/popunder.js',
    configured: false, // ← flip to `true` once you paste the real scriptSrc
    // Frequency cap: show at most once per X hours (per browser).
    frequencyCapHours: 24,
    // Delay after page load before the script is injected (ms).
    delayMs: 4000,
    // Only fire after first user interaction (scroll/click) — best for UX + SEO.
    requireInteraction: true,
  },

  // ── Native Banners (iframe-isolated, no atOptions collisions) ───────────
  native: {
    // Homepage — below lead story / above Featured strip (highest viewability)
    homepageTop: {
      key: '6088150',
      format: 'iframe' as const,
      width: 300,
      height: 250,
      configured: false,
    },
    // Homepage — in-feed, injected after Nth card (native feel, high CTR)
    homepageFeed: {
      key: '6088150',
      format: 'iframe' as const,
      width: 300,
      height: 250,
      configured: false,
    },
    // Article — mid-article, after body content / before tags (best earner)
    inArticle: {
      key: '6088150',
      format: 'iframe' as const,
      width: 300,
      height: 250,
      configured: false,
    },
    // Article — end of article, before Related Intelligence (second best)
    endOfArticle: {
      key: '6088150',
      format: 'iframe' as const,
      width: 300,
      height: 250,
      configured: false,
    },
  },

  settings: {
    // Respect CookieConsent advertising toggle (same as AdSense).
    requireConsent: true,
    // Never load on localhost / preview — avoids polluting stats.
    disableOnLocalhost: true,
    // Reserve fixed-height wrapper so ads never cause layout shift (CLS).
    reserveSpace: true,
  },
};

export type AdsterraNativeSlot = keyof typeof ADSTERRA_CONFIG.native;

export function isAdsterraSlotConfigured(slot: AdsterraNativeSlot): boolean {
  return ADSTERRA_CONFIG.native[slot].configured === true;
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  return /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname || '');
}
