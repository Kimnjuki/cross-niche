/**
 * Generate the static "Gamer Threat Report" page (dist/threats/index.html)
 * as a "Nexus Console": stat strip, scored threat cards with CVE chips,
 * platform tags, dates, "what to do" guidance, and a transparent methodology.
 *
 * Addresses audit findings F1 (spread scores), F2 (correct platforms), F3 (CVE
 * IDs), F4 (actionability), F5 (clean titles), F7 (dates), F8 (scanability),
 * F9 (methodology). Server-rendered (crawlable, no-JS-safe).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { staticShell } from './lib/static-chrome.mjs';
import {
  isGamerRelevant,
  gamerImpactV2,
  platformsFor,
  platformLabel,
  titleClean,
  severityColor,
  actionFor,
} from './lib/gamer-threat-filter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const FILE = path.join(projectRoot, 'src', 'data', 'gamer-threats.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const all = data.threats || [];

const threats = all
  .filter(isGamerRelevant)
  .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function relTime(ts) {
  const d = Date.now() - ts;
  const days = Math.floor(d / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const MAX = 60;

// ── Stat strip ───────────────────────────────────────────────────────────────
const now = Date.now();
const total = threats.length;
const new7d = threats.filter((t) => now - (t.publishedAt || 0) < 7 * 86400000).length;
const actNow = threats.filter((t) => gamerImpactV2(t).score >= 80).length;
const gamingSpecific = threats.filter((t) =>
  platformsFor(t).some((p) => ['gpu-driver', 'game-platform', 'console', 'browser'].includes(p))
).length;

function scoreRing(score, tier) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return `<svg width="46" height="46" viewBox="0 0 46 46" role="img" aria-label="Impact ${score} of 100, ${tier.tier}">
    <circle cx="23" cy="23" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
    <circle cx="23" cy="23" r="${r}" fill="none" stroke="${tier.color}" stroke-width="4" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 23 23)"/>
    <text x="23" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="#f8fafc" style="font-family:'JetBrains Mono',monospace">${score}</text>
  </svg>`;
}

function severityBadge(sev, color) {
  return `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:${color};border:1px solid ${color}44;background:${color}14;padding:0.1rem 0.45rem;border-radius:999px">${esc(sev)}</span>`;
}

const cards = threats.slice(0, MAX).map((t) => {
  const cve = (t.cveIds && t.cveIds[0]) || '';
  const nvd = cve ? `https://nvd.nist.gov/vuln/detail/${cve}` : '#';
  const v = gamerImpactV2(t);
  const plats = platformsFor(t);
  const title = titleClean(t);
  const action = actionFor(t);
  const dateStr = new Date(t.publishedAt).toISOString().slice(0, 10);
  const rel = relTime(t.publishedAt);
  const platformChips = plats
    .map((p) => `<span style="font-size:0.7rem;color:#9AA7C7;border:1px solid rgba(120,160,255,0.18);padding:0.05rem 0.4rem;border-radius:999px">${esc(platformLabel(p))}</span>`)
    .join('');

  return `
    <div style="background:rgba(16,24,48,0.45);border:1px solid rgba(120,160,255,0.14);border-radius:0.9rem;padding:1rem 1.1rem;transition:border-color 0.15s ease,transform 0.15s ease">
      <div style="display:flex;gap:0.9rem;align-items:flex-start">
        <div style="flex-shrink:0">${scoreRing(v.score, v.tier)}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;flex-wrap:wrap;gap:0.45rem;align-items:center;margin-bottom:0.4rem">
            ${cve ? `<a href="${esc(nvd)}" rel="nofollow noopener" style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#00F0FF;text-decoration:none" title="View on NVD">${esc(cve)}</a>` : ''}
            ${severityBadge(v.tier.severity, v.tier.color)}
            <span style="font-size:0.75rem;color:#6B7799" title="${esc(dateStr)}">${esc(rel)}</span>
          </div>
          <h3 style="font-size:1rem;margin:0 0 0.35rem;font-weight:600;color:#E8EEFF;line-height:1.3">${esc(title)}</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.4rem">${platformChips}</div>
          <p style="margin:0;font-size:0.85rem;color:#9AA7C7"><strong style="color:#38F2D0;font-weight:600">What to do:</strong> ${esc(action)}</p>
        </div>
      </div>
    </div>`;
}).join('');

const title = `Gamer Threat Report — Which Exploits Affect Players | ${SITE_NAME}`;
const description = 'Actively-exploited vulnerabilities that affect players, ranked by gamer impact with CVE IDs, platform tags, dates and plain-language fixes. Sourced from CISA KEV.';
const canonical = `${BASE_URL}/threats`;

const body = `
<article>
  <p style="color:#00F0FF;font-size:0.85rem;margin:0 0 0.4rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;text-transform:uppercase">Threat intelligence console</p>
  <h1 style="font-size:clamp(1.9rem,4vw,2.75rem);margin:0 0 0.5rem;line-height:1.1">Gamer Threat Report</h1>
  <p style="color:#9AA7C7;max-width:70ch;margin:0">Actively-exploited vulnerabilities that affect players — Windows, Chrome, iOS, Android, GPU drivers and game platforms. Ranked by <strong style="color:#E8EEFF">gamer impact</strong>, not just severity. Sourced from the CISA Known Exploited Vulnerabilities catalog.</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:0.7rem;margin:1.6rem 0">
    <div style="background:rgba(16,24,48,0.45);border:1px solid rgba(120,160,255,0.14);border-radius:0.9rem;padding:0.9rem 1rem"><div style="font-size:1.6rem;font-weight:700;color:#E8EEFF;font-family:'JetBrains Mono',monospace">${total}</div><div style="font-size:0.78rem;color:#6B7799">Tracked threats</div></div>
    <div style="background:rgba(16,24,48,0.45);border:1px solid rgba(120,160,255,0.14);border-radius:0.9rem;padding:0.9rem 1rem"><div style="font-size:1.6rem;font-weight:700;color:#38F2D0;font-family:'JetBrains Mono',monospace">${new7d}</div><div style="font-size:0.78rem;color:#6B7799">Added in 7 days</div></div>
    <div style="background:rgba(16,24,48,0.45);border:1px solid rgba(120,160,255,0.14);border-radius:0.9rem;padding:0.9rem 1rem"><div style="font-size:1.6rem;font-weight:700;color:#f87171;font-family:'JetBrains Mono',monospace">${actNow}</div><div style="font-size:0.78rem;color:#6B7799">Act-now tier</div></div>
    <div style="background:rgba(16,24,48,0.45);border:1px solid rgba(120,160,255,0.14);border-radius:0.9rem;padding:0.9rem 1rem"><div style="font-size:1.6rem;font-weight:700;color:#7A5CFF;font-family:'JetBrains Mono',monospace">${gamingSpecific}</div><div style="font-size:0.78rem;color:#6B7799">Gaming-specific</div></div>
  </div>

  <h2 style="font-size:1.2rem;margin:0 0 0.6rem">${Math.min(MAX, threats.length)} highest-impact threats</h2>
  <div style="display:grid;gap:0.7rem">${cards}</div>

  <h2 style="font-size:1.2rem;margin:2rem 0 0.6rem">How we score</h2>
  <p style="color:#9AA7C7;max-width:70ch;margin:0">The <strong style="color:#E8EEFF">Gamer Impact Score</strong> (0–100) combines six transparent factors: exploitation confidence (severity of an actively-exploited flaw), attack reach (remote vs local), user interaction, platform gamer share, gaming-surface relevance (GPU, launcher, browser, console), and recency. Tiers: <strong style="color:#f87171">Act now</strong> 80–100 · <strong style="color:#fb923c">Patch soon</strong> 60–79 · <strong style="color:#facc15">Monitor</strong> 35–59 · <strong style="color:#94a3b8">Low relevance</strong> 0–34.</p>
  <p style="color:#6B7799;font-size:0.85rem;margin-top:0.6rem">Scores are a heuristic based on public CISA KEV data — not a substitute for the vendor advisory. Verify before acting. Full <a href="/methodology">methodology</a>.</p>
</article>`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Gamer Threat Report',
  description,
  numberOfItems: Math.min(MAX, threats.length),
  itemListElement: threats.slice(0, MAX).map((t, i) => {
    const cve = (t.cveIds && t.cveIds[0]) || '';
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: cve ? `${cve} — ${titleClean(t)}` : titleClean(t),
      url: cve ? `https://nvd.nist.gov/vuln/detail/${cve}` : (t.url || canonical),
    };
  }),
};

const html = staticShell(title, description, canonical, body, jsonLd, '/threats');

const outDir = path.join(projectRoot, 'dist', 'threats');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
console.log(`Generated /threats console: ${Math.min(MAX, threats.length)} threats (${total} tracked, ${actNow} act-now, ${gamingSpecific} gaming-specific).`);
