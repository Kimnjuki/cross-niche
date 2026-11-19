/**
 * Apply SERP-safe metaTitle overrides to the content snapshot.
 *
 * Why this exists: buildTitle() in generate-static-articles.mjs deliberately
 * keeps the editorial title intact up to ~70 chars rather than amputating it to
 * make room for the brand suffix. That is the right trade for most articles, but
 * 16 indexable articles ship titles of 62-74 chars, which Google truncates in
 * the SERP — cutting off the words a searcher actually matches and clicks.
 *
 * This script rewrites ONLY the `metaTitle` field for the slugs listed below,
 * leaving `title` (the on-page H1) untouched. Each override is hand-written to
 * lead with the searcher's query and stay <= 60 chars so nothing is truncated.
 *
 * Idempotent: re-running produces the same snapshot.
 *
 * Usage: node scripts/apply-meta-title-overrides.mjs [--check]
 *   --check  report over-long titles without writing (exits 1 if any remain)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SNAPSHOT_PATH } from './lib/content-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

/**
 * slug -> SERP-safe metaTitle (<= 60 chars, query-first).
 * Ordered by the length of the title they replace.
 */
const OVERRIDES = {
  'doxxing-swatting-protection-streamers': 'Doxxing and Swatting Protection for Streamers',
  'sim-swap-attack-defense-gaming-accounts': 'SIM Swap Attack Defense for Gaming Accounts',
  'passkeys-for-gamers-platform-support': 'Passkeys for Gamers: Platform Support in 2026',
  'public-wifi-gaming-security-lan-events': 'Public Wi-Fi Gaming Security: LAN and Hotels',
  'router-security-gamers-network-protection': 'Gaming Router Security: Protect Your Network',
  'steam-api-trade-scam-cs2-skins': 'Steam API Trade Scam: How CS2 Skins Get Stolen',
  'roblox-account-security-parental-controls': 'Roblox Parental Controls and Account Safety',
  'ddos-attack-streamer-ip-protection': 'DDoS & IP Protection for Streamers and Gamers',
  'discord-token-theft-qr-login-scams': 'Discord Token Theft & QR-Login Scams Explained',
  'fake-game-cheats-infostealer-malware': 'Infostealer Malware in Fake Game Cheats',
  'account-boosting-trading-bans': 'Account Boosting & Trading Bans: Riot, Valve Rules',
  'in-app-purchase-chargeback-fraud-gaming': 'In-App Purchase Fraud & Chargebacks',
  'minecraft-mod-malware-fracturiser-bleedingpipe': 'Minecraft Mod Malware: Fracturiser & BleedingPipe',
  'pirated-games-emulators-malware-risk': 'Pirated Games & Emulator Malware: The Real Risk',
  'ultimate-guide-improve-security-online-gaming': 'How to Improve Security for Online Gaming',
  'ultimate-guide-steam-xbox-playstation-discord-security': 'Steam, Xbox, PlayStation and Discord Security',
};

const TITLE_MAX = 60;

/**
 * Length of the title as it appears in the served HTML.
 *
 * buildTitle() measures the raw string, but the generator HTML-escapes it, so
 * every "&" costs 5 chars ("&") instead of 1. Four titles that measured
 * exactly 60 raw chars shipped as 63-64 chars in dist/ and were still
 * truncated by Google. Always budget against this, not the raw length.
 */
function escapedLen(title) {
  return String(title).replace(/&/g, '&').length;
}

function loadSnapshot() {
  const raw = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  const items = Array.isArray(raw) ? raw : (raw.items || raw.articles || raw.content || []);
  return { raw, items, isArray: Array.isArray(raw) };
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const { raw, items, isArray } = loadSnapshot();

  if (!items.length) {
    console.error(`No items found in ${path.relative(projectRoot, SNAPSHOT_PATH)}`);
    process.exit(1);
  }

  // Guard: every override must target a real slug and fit the SERP budget.
  const missing = Object.keys(OVERRIDES).filter((slug) => !items.some((i) => i.slug === slug));
  if (missing.length) {
    console.error(`Override slugs not present in snapshot: ${missing.join(', ')}`);
    process.exit(1);
  }
  const tooLong = Object.entries(OVERRIDES).filter(([, t]) => escapedLen(t) > TITLE_MAX);
  if (tooLong.length) {
    console.error(`Overrides exceeding ${TITLE_MAX} chars as served: ${tooLong.map(([s, t]) => `${s} (${escapedLen(t)})`).join(', ')}`);
    process.exit(1);
  }

  let changed = 0;
  for (const item of items) {
    const next = OVERRIDES[item.slug];
    if (next && item.metaTitle !== next) {
      item.metaTitle = next;
      changed++;
    }
  }

  // Report the resulting state of every overridden slug.
  const report = [];
  for (const slug of Object.keys(OVERRIDES)) {
    const item = items.find((i) => i.slug === slug);
    const effective = item.metaTitle || item.title || '';
    const brand = ` | The Grid Nexus`;
    const withBrand = effective + brand;
    const shipped = escapedLen(withBrand) <= TITLE_MAX ? withBrand : effective;
    report.push({ slug, shipped, len: escapedLen(shipped) });
  }

  const stillLong = report.filter((r) => r.len > TITLE_MAX);

  if (checkOnly) {
    if (stillLong.length) {
      console.error(`${stillLong.length} title(s) still exceed ${TITLE_MAX} chars:`);
      for (const r of stillLong) console.error(`  ${r.len}\t${r.slug}\t${r.shipped}`);
      process.exit(1);
    }
    console.log(`OK: all ${report.length} overridden titles are <= ${TITLE_MAX} chars.`);
    return;
  }

  if (changed === 0) {
    console.log(`No changes needed — ${report.length} overrides already applied.`);
  } else {
    const out = isArray ? items : raw;
    fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
    console.log(`Updated ${changed} metaTitle value(s) in ${path.relative(projectRoot, SNAPSHOT_PATH)}.`);
  }

  for (const r of report) console.log(`  ${r.len}\t${r.slug}\t${r.shipped}`);
}

main();