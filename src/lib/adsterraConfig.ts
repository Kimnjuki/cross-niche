/**
 * Adsterra Configuration — central place for all Adsterra keys.
 *
 * Real production codes are wired below (no placeholders).
 * To disable anything, flip its `enabled`/`configured` flag —
 * no other file needs editing.
 *
 * Popunder:
 *   <script src="https://pl31630046.profitableratecpmnetwork.com/70/2d/27/702d2739edb6ffc48f229d3c28bf2327.js"></script>
 *
 * Native Banner (new container-style format):
 *   <script async data-cfasync="false" src="https://pl31630047.profitableratecpmnetwork.com/e6830354de6d25dd478d5176091bd278/invoke.js"></script>
 *   <div id="container-e6830354de6d25dd478d5176091bd278"></div>
 */

const NATIVE_INVOKE_SRC =
  'https://pl31630047.profitableratecpmnetwork.com/e6830354de6d25dd478d5176091bd278/invoke.js';
const NATIVE_CONTAINER_ID = 'container-e6830354de6d25dd478d5176091bd278';

export const ADSTERRA_CONFIG = {
  enabled: true,

  // ── Popunder (site-wide, frequency-capped) ──────────────────────────────
  popunder: {
    enabled: true,
    scriptSrc:
      'https://pl31630046.profitableratecpmnetwork.com/70/2d/27/702d2739edb6ffc48f229d3c28bf2327.js',
    configured: true,
    // Frequency cap: show at most once per X hours (per browser).
    frequencyCapHours: 24,
    // Delay after page load before the script is injected (ms).
    delayMs: 4000,
    // Only fire after first user interaction (scroll/click) — best for UX + SEO.
    requireInteraction: true,
  },

  // ── Native Banners (container + invoke.js, iframe-isolated) ─────────────
  // NOTE: all four slots share the same Adsterra native unit. Each slot
  // renders inside its own iframe document, so the shared container ID
  // never collides (same-document duplicate IDs would break all but the
  // first placement — the classic React failure mode).
  native: {
    // Homepage — below lead story / above Featured strip (highest viewability)
    homepageTop: {
      invokeSrc: NATIVE_INVOKE_SRC,
      containerId: NATIVE_CONTAINER_ID,
      configured: true,
    },
    // Homepage — in-feed, after the 9-card grid (native feel, high CTR)
    homepageFeed: {
      invokeSrc: NATIVE_INVOKE_SRC,
      containerId: NATIVE_CONTAINER_ID,
      configured: true,
    },
    // Article — mid-article, after body content / before tags (best earner)
    inArticle: {
      invokeSrc: NATIVE_INVOKE_SRC,
      containerId: NATIVE_CONTAINER_ID,
      configured: true,
    },
    // Article — end of article, before Related Intelligence (second best)
    endOfArticle: {
      invokeSrc: NATIVE_INVOKE_SRC,
      containerId: NATIVE_CONTAINER_ID,
      configured: true,
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
