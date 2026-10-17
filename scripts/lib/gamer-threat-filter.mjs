/**
 * Gamer-relevance filter + impact score for the CISA KEV triage.
 *
 * The raw export classified ~200 entries as "gamer-relevant" but included
 * enterprise/dev products (WatchGuard firewalls, Laravel, Prettier, Sitecore,
 * MikroTik routers, etc.) that no player patches. This module narrows to
 * consumer products a gamer actually runs: OS, browsers, mobile chipsets, GPU
 * drivers, and game platforms.
 *
 * Used by generate-threat-page.mjs and generate-research-report.mjs so the
 * two pages never disagree on what counts as a gamer threat.
 */

/** Consumer vendors a gamer actually patches. */
const GAMER_VENDORS = new Set([
  'Microsoft', // Windows, Edge, Office
  'Google', // Chrome, Android
  'Apple', // iOS, macOS, Safari
  'Android', // Android OS (some KEV entries list "Android" as vendor)
  'Samsung', // Android devices
  'Qualcomm', // mobile chipsets / Adreno GPU
  'NVIDIA', // GeForce GPU drivers
  'AMD', // Radeon GPU drivers
  'Intel', // CPU/GPU drivers
  'Mozilla', // Firefox
  // game platforms / stores (rare in KEV, but keep the door open)
  'Steam',
  'Valve',
  'Discord',
  'Epic',
  'Riot',
  'Sony',
  'Nintendo',
  'Ubisoft',
  'EA',
  'Activision',
]);

/** Vendor the title belongs to (KEV titles are "{Vendor} — {Product} — …"). */
function vendorOf(threat) {
  return String(threat.title ?? '').split(' — ')[0].trim();
}

export function isGamerRelevant(threat) {
  return GAMER_VENDORS.has(vendorOf(threat));
}

/**
 * Gamer-impact score (0–100), documented:
 *   base = severity (critical 70 / high 55 / medium 40 / low 25)
 *   + platform exposure: Nintendo Switch +20, Mobile +15, PC +5
 *   capped at 100.
 */
export function gamerImpact(threat) {
  const sevBase = { critical: 70, high: 55, medium: 40, low: 25 }[threat.severity] ?? 40;
  const plats = threat.gamingPlatforms || [];
  let bonus = 0;
  if (plats.includes('Nintendo Switch')) bonus += 20;
  if (plats.includes('Mobile')) bonus += 15;
  if (plats.includes('PC')) bonus += 5;
  return Math.min(100, sevBase + bonus);
}

/** Plain-language "what players should do" line for a threat. */
export function actionFor(threat) {
  const vendor = vendorOf(threat);
  const map = {
    Microsoft: 'Apply the latest Windows/Edge security update and reboot.',
    Google: 'Update Chrome/Android to the latest version and restart it.',
    Apple: 'Update iOS/macOS to the latest version on every device.',
    Android: 'Install the latest Android security update on your device.',
    Samsung: 'Install the latest Samsung security update on your device.',
    Qualcomm: 'Install your device firmware update (Qualcomm chipset patch).',
    NVIDIA: 'Update your NVIDIA GPU driver from the NVIDIA app or nvidia.com.',
    AMD: 'Update your AMD GPU driver from the AMD software or amd.com.',
    Intel: 'Update your Intel driver/firmware from the Intel site.',
    Mozilla: 'Update Firefox to the latest version and restart it.',
  };
  return map[vendor] ?? 'Update the affected software to the patched version.';
}
