/**
 * Generate the static "Gamer Threat Report" page (dist/threats/index.html) from
 * src/data/gamer-threats.json — a crawlable list of actively-exploited
 * vulnerabilities that affect gamers, ranked by gamerImpactScore.
 *
 * Run (after export-gamer-threats.mjs):
 *   node scripts/generate-threat-page.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const FILE = path.join(projectRoot, 'src', 'data', 'gamer-threats.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const threats = data.threats || [];

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sevColor(s) {
  return { critical: '#f87171', high: '#fb923c', medium: '#facc15', low: '#94a3b8' }[s] || '#94a3b8';
}

function shortDesc(desc, max = 200) {
  const clean = String(desc ?? '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max).replace(/\s+\S*$/, '') + '…' : clean;
}

const rows = threats
  .slice(0, 40)
  .map((t) => {
    const platforms = (t.gamingPlatforms || []).join(', ') || 'All';
    return `<tr>
      <td style="padding:0.7rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);vertical-align:top">
        <a href="${esc(t.url || '#')}" rel="nofollow noopener" style="color:#60a5fa;text-decoration:none">${esc(t.title)}</a>
        <div style="color:#94a3b8;font-size:0.85rem;margin-top:0.25rem">${esc(shortDesc(t.description))}</div>
      </td>
      <td style="padding:0.7rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);text-align:center;white-space:nowrap"><span style="color:${sevColor(t.severity)};font-weight:700;text-transform:uppercase;font-size:0.8rem">${esc(t.severity)}</span></td>
      <td style="padding:0.7rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);color:#94a3b8">${esc(platforms)}</td>
      <td style="padding:0.7rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);text-align:center;font-weight:700;color:#f8fafc">${esc(String(t.gamerImpactScore ?? 0))}</td>
    </tr>`;
  })
  .join('');

const title = `Gamer Threat Report — Which Exploits Affect Players | ${SITE_NAME}`;
const description = 'Actively-exploited vulnerabilities that affect gamers, ranked by gamer impact: Windows, Chrome, Android, iOS, GPU drivers and game platforms. Updated from CISA KEV.';
const canonical = `${BASE_URL}/threats`;

const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Gamer Threat Report',
      itemListElement: threats.slice(0, 40).map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: t.url || canonical })),
    })}</script>
  </head>
  <body style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;line-height:1.6">
    <header style="margin-bottom:2rem">
      <a href="/" style="color:#60a5fa;text-decoration:none;font-weight:700">${SITE_NAME}</a>
      <nav style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem">
        <a href="/" style="color:#94a3b8;text-decoration:none">Home</a>
        <a href="/games" style="color:#94a3b8;text-decoration:none">Security Grades</a>
        <a href="/threats" style="color:#94a3b8;text-decoration:none">Threat Report</a>
      </nav>
    </header>
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.5rem">Gamer Threat Report</h1>
      <p style="color:#e2e8f0;max-width:70ch">Actively-exploited vulnerabilities that affect players — Windows, Chrome, Android, iOS, GPU drivers and game platforms. Sourced from the CISA Known Exploited Vulnerabilities catalog and ranked by gamer impact.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:1.5rem">
        <thead><tr style="text-align:left;color:#94a3b8;border-bottom:1px solid rgba(148,163,184,0.3)">
          <th style="padding:0.7rem 0.5rem">Threat</th>
          <th style="padding:0.7rem 0.5rem;text-align:center">Severity</th>
          <th style="padding:0.7rem 0.5rem">Platforms</th>
          <th style="padding:0.7rem 0.5rem;text-align:center">Impact</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:1.5rem;font-size:0.85rem;color:#64748b">Impact score is a heuristic (0–100) combining severity with gamer-relevance. Initial assessment — verify before acting.</p>
    </article>
  </body>
</html>`;

const outDir = path.join(projectRoot, 'dist', 'threats');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
console.log(`Generated /threats with ${Math.min(threats.length, 40)} threats.`);
