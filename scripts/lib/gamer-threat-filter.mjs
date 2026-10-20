/**
 * Gamer-relevance filter + platform mapping + Gamer Impact Score v2.
 *
 * Fixes the audit findings on /threats:
 *   F1 — the old score saturated (every row = 100). v2 spreads scores across
 *        0–100 with a transparent, deterministic multi-factor model.
 *   F2 — platform tagging was hardcoded ["PC","Mobile"] for everything. Platforms
 *        are now derived from vendor/product/description with an explicit map.
 *   F5 — titles repeated the vendor; titleClean strips the "Vendor — Product —"
 *        prefix to a short, scannable vulnerability type.
 *
 * Used by generate-threat-page.mjs and generate-research-report.mjs so the two
 * pages never disagree.
 */

/** Consumer vendors a gamer actually patches. */
const GAMER_VENDORS = new Set([
  'Microsoft', 'Google', 'Apple', 'Android', 'Samsung', 'Qualcomm',
  'NVIDIA', 'AMD', 'Intel', 'Mozilla',
  'Steam', 'Valve', 'Discord', 'Epic', 'Riot', 'Sony', 'Nintendo', 'Ubisoft', 'EA', 'Activision',
]);

/** Platform enum (from the spec's normalized schema). */
export const PLATFORMS = [
  'windows', 'macos', 'linux', 'android', 'ios',
  'browser', 'console', 'gpu-driver', 'game-platform', 'network-device',
];

/** Gamer install-base weight per platform (documented, versioned table). */
export const PLATFORM_GAMER_SHARE = {
  windows: 0.92,
  'gpu-driver': 0.90,
  browser: 0.88,
  'game-platform': 0.85,
  android: 0.78,
  ios: 0.70,
  console: 0.65,
  linux: 0.50,
  macos: 0.42,
  'network-device': 0.20,
};

/** Vendor the title belongs to (KEV titles are "{Vendor} — {Product} — …"). */
function vendorOf(threat) {
  return String(threat.title ?? '').split(' — ')[0].trim();
}

function productOf(threat) {
  return String(threat.title ?? '').split(' — ')[1]?.trim() ?? '';
}

export function isGamerRelevant(threat) {
  return GAMER_VENDORS.has(vendorOf(threat));
}

/**
 * Derive platforms from vendor + product + description (F2). Never defaults to
 * "all"; each platform must be evidenced by a keyword in the text.
 */
export function platformsFor(threat) {
  const text = `${threat.title ?? ''} ${threat.description ?? ''}`.toLowerCase();
  const vendor = vendorOf(threat).toLowerCase();
  const out = new Set();

  if (/\bwindows\b|win32k|microsoft (windows|edge)|nt kernel/.test(text) || vendor === 'microsoft') out.add('windows');
  if (/\bchrome\b|chromium|firefox|safari|edge \(chromium|browser/.test(text) || /skia|v8\b|webgpu/.test(text)) out.add('browser');
  if (/\bandroid\b/.test(text)) out.add('android');
  if (/\bios\b|ipados\b|iphone|ipad|visionos\b/.test(text)) out.add('ios');
  if (/\bmacos\b|os x/.test(text)) out.add('macos');
  if (/\blinux\b/.test(text)) out.add('linux');
  if (/\bnvidia|geforce|quadro|amd radeon|radeon|gpu driver|graphics driver|intel.*(graphics|gpu)|display driver|dxgk/.test(text) || ['nvidia', 'amd'].includes(vendor)) out.add('gpu-driver');
  if (/\bplaystation|psn|xbox|nintendo switch|console\b/.test(text) || ['sony', 'nintendo'].includes(vendor)) out.add('console');
  if (/\bsteam|discord|epic games|riot|valorant|league of legends|game platform|launcher|anti-?cheat/.test(text) || ['steam', 'valve', 'discord', 'epic', 'riot', 'ubisoft', 'ea', 'activision'].includes(vendor)) out.add('game-platform');
  if (/\brouter\b|firewall|gateway\b|vpn appliance/.test(text)) out.add('network-device');

  // A desktop OS vendor with no platform matched is at minimum a PC/windows surface.
  if (out.size === 0 && vendor === 'microsoft') out.add('windows');
  if (out.size === 0 && ['nvidia', 'amd', 'intel'].includes(vendor)) out.add('gpu-driver');
  if (out.size === 0 && ['qualcomm', 'samsung'].includes(vendor)) out.add('android');

  return [...out].sort();
}

export function platformLabel(p) {
  return {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    android: 'Android',
    ios: 'iOS/iPadOS',
    browser: 'Browser',
    console: 'Console',
    'gpu-driver': 'GPU driver',
    'game-platform': 'Launcher/Platform',
    'network-device': 'Network',
  }[p] ?? p;
}

/** Strip the "Vendor — Product —" prefix to a short vulnerability-type title (F5). */
export function titleClean(threat) {
  const parts = String(threat.title ?? '').split(' — ');
  if (parts.length >= 3) return parts.slice(2).join(' — ').replace(/ Vulnerability$/, '').trim();
  return String(threat.title ?? '').replace(/ Vulnerability$/, '');
}

/**
 * Gamer Impact Score v2 (0–100) — transparent, deterministic, spreading.
 * Factors (weights sum to 1.0):
 *   exploitation_confidence 0.20  (severity proxy: KEV = actively exploited)
 *   attack_reach            0.20  (remote/web-delivered vs local-only)
 *   user_interaction        0.10  (drive-by high; requires-install low)
 *   platform_gamer_share    0.20  (install-base weight, max across platforms)
 *   gaming_surface          0.10  (GPU/launcher/browser/anti-cheat)
 *   recency                 0.20  (exponential decay on days since dateAdded)
 * Returns an integer 0–100 plus a breakdown for the UI.
 */
export function gamerImpactV2(threat) {
  const sevConf = { critical: 1.0, high: 0.8, medium: 0.5, low: 0.3 }[threat.severity] ?? 0.5;

  const desc = String(threat.description ?? '').toLowerCase();
  const remote = /\bremote|crafted html|crafted web|network|web page|drive-?by\b/.test(desc);
  const attackReach = remote ? 1.0 : 0.4;

  const requiresOpen = /\bmalicious application|opening a|open a|local attacker|user interaction\b/.test(desc);
  const userInteraction = requiresOpen ? 0.3 : 1.0; // 1.0 = no interaction needed (worse)

  const plats = platformsFor(threat);
  const share = plats.length ? Math.max(...plats.map((p) => PLATFORM_GAMER_SHARE[p] ?? 0.5)) : 0.5;

  const gamingSurface = plats.some((p) => ['gpu-driver', 'game-platform', 'browser', 'console'].includes(p)) ? 1.0 : 0.3;

  const days = Math.max(0, (Date.now() - (threat.publishedAt || Date.now())) / 86400000);
  const recency = Math.exp(-days / 90); // 1.0 today → ~0.37 at 90 days

  const factors = {
    exploitation_confidence: sevConf,
    attack_reach: attackReach,
    user_interaction: userInteraction,
    platform_gamer_share: share,
    gaming_surface: gamingSurface,
    recency,
  };
  const weights = {
    exploitation_confidence: 0.20,
    attack_reach: 0.20,
    user_interaction: 0.10,
    platform_gamer_share: 0.20,
    gaming_surface: 0.10,
    recency: 0.20,
  };
  const total = Object.keys(factors).reduce((sum, k) => sum + factors[k] * weights[k], 0);
  return {
    score: Math.round(total * 100),
    tier: tierFor(Math.round(total * 100)),
    factors,
  };
}

export function tierFor(score) {
  if (score >= 80) return { tier: 'Act now', severity: 'critical', color: '#f87171' };
  if (score >= 60) return { tier: 'Patch soon', severity: 'high', color: '#fb923c' };
  if (score >= 35) return { tier: 'Monitor', severity: 'medium', color: '#facc15' };
  return { tier: 'Low relevance', severity: 'low', color: '#94a3b8' };
}

export function severityColor(s) {
  return { critical: '#f87171', high: '#fb923c', medium: '#facc15', low: '#94a3b8' }[s] ?? '#94a3b8';
}

/** Plain-language "what players should do" line for a threat (F4). */
export function actionFor(threat) {
  const vendor = vendorOf(threat);
  const plats = platformsFor(threat);
  const map = {
    Microsoft: 'Apply the latest Windows/Edge security update and reboot.',
    Google: 'Update Chrome and Android to the latest version, then restart the app.',
    Apple: 'Update iOS, iPadOS and macOS to the latest version on every device.',
    Android: 'Install the latest Android security update on your device.',
    Samsung: 'Install the latest Samsung security update on your device.',
    Qualcomm: 'Install your device firmware update (Qualcomm chipset patch).',
    NVIDIA: 'Update your NVIDIA GPU driver from the NVIDIA app or nvidia.com.',
    AMD: 'Update your AMD GPU driver from AMD Software or amd.com.',
    Intel: 'Update your Intel driver/firmware from the Intel site.',
    Mozilla: 'Update Firefox to the latest version and restart it.',
  };
  if (map[vendor]) return map[vendor];
  if (plats.includes('gpu-driver')) return 'Update your graphics driver from the vendor site.';
  if (plats.includes('browser')) return 'Fully restart your browser after updating.';
  return 'Update the affected software to the patched version.';
}
