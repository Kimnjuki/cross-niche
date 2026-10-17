/**
 * Generate a data-backed "State of Gaming Security 2026" report page + CSV
 * download from the real data this session produced:
 *   - gameLibrary grades (src/data/game-library.json)
 *   - gamer threat triage (src/data/gamer-threats.json)
 *
 * Outputs:
 *   dist/research/state-of-gaming-security-2026/index.html  (report + Dataset JSON-LD)
 *   dist/research/state-of-gaming-security-2026/data.csv     (downloadable dataset)
 *
 * Run after export-gamer-threats.mjs + export-game-library.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isGamerRelevant } from './lib/gamer-threat-filter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const games = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/game-library.json'), 'utf8')).games || [];
const threats = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/gamer-threats.json'), 'utf8')).threats || [];

const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
const gradeCounts = {};
for (const g of games) gradeCounts[g.securityGrade] = (gradeCounts[g.securityGrade] || 0) + 1;

const sevCounts = {};
const gamerThreats = threats.filter(isGamerRelevant);
for (const t of gamerThreats) sevCounts[t.severity] = (sevCounts[t.severity] || 0) + 1;

const platformCounts = {};
for (const t of gamerThreats) for (const p of t.gamingPlatforms || []) platformCounts[p] = (platformCounts[p] || 0) + 1;

const gamerRelevant = gamerThreats.length; // narrowed to consumer products a player patches

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// CSV
const csvHeader = 'game,platforms,security_grade,security_notes';
const csvRows = games.map((g) =>
  [g.name, (g.platforms || []).join(';'), g.securityGrade, `"${String(g.securityNotes || '').replace(/"/g, '""')}"`].join(',')
);
const csv = [csvHeader, ...csvRows].join('\n');

const gradeBar = (c, color) =>
  `<span style="display:inline-block;background:${color};width:${Math.max(4, c * 18)}px;height:1em;border-radius:3px;margin-right:0.5rem"></span>`;

const title = `State of Gaming Security 2026 — Data Report | ${SITE_NAME}`;
const description =
  'Original data on gaming account security in 2026: security grades for 14 major games and platforms, and a gamer-impact triage of 1,741 actively-exploited vulnerabilities. Methodology and CSV download included.';
const canonical = `${BASE_URL}/research/state-of-gaming-security-2026`;

const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'State of Gaming Security 2026',
      description,
      url: canonical,
      datePublished: '2026-10-13',
      publisher: { '@type': 'Organization', name: SITE_NAME },
      distribution: { '@type': 'DataDownload', contentUrl: `${canonical}/data.csv`, encodingFormat: 'text/csv' },
      variableMeasured: ['security grade', 'platform', 'gamer impact score'],
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
      <h1 style="font-size:2rem;margin:0 0 0.5rem">State of Gaming Security 2026</h1>
      <p style="color:#e2e8f0;max-width:70ch">Original data on how well the games and platforms players use actually protect their accounts. Two datasets below: a security-grade assessment of 14 major games/platforms, and a gamer-impact triage of actively-exploited vulnerabilities from the CISA KEV catalog. <a href="${canonical}/data.csv" style="color:#60a5fa">Download the CSV</a>.</p>

      <h2 style="margin-top:2rem">1. Game & platform security grades</h2>
      <p style="color:#94a3b8">Grades are initial assessments based on documented two-factor-authentication support and known account-takeover or breach history — not lab tests.</p>
      <div style="max-width:32rem;margin-top:1rem">
        ${gradeOrder.map((g) => {
          const c = gradeCounts[g] || 0;
          const color = { A: '#22c55e', B: '#a3e635', C: '#facc15', D: '#fb923c', F: '#f87171' }[g];
          return `<div style="display:flex;align-items:center;margin:0.4rem 0">${gradeBar(c, color)}<span style="width:1.2rem;font-weight:700">${g}</span><span style="color:#94a3b8;margin-left:0.5rem">${c} of ${games.length} assessed</span></div>`;
        }).join('')}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:1.5rem">
        <thead><tr style="text-align:left;color:#94a3b8;border-bottom:1px solid rgba(148,163,184,0.3)">
          <th style="padding:0.5rem">Game / platform</th><th style="padding:0.5rem;text-align:center">Grade</th><th style="padding:0.5rem">Platforms</th>
        </tr></thead>
        <tbody>
          ${games.map((g) => `<tr><td style="padding:0.5rem;border-bottom:1px solid rgba(148,163,184,0.15)"><a href="/games/${esc(g.slug)}" style="color:#60a5fa;text-decoration:none">${esc(g.name)}</a></td><td style="padding:0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);text-align:center;font-weight:700">${esc(g.securityGrade)}</td><td style="padding:0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);color:#94a3b8">${esc((g.platforms || []).join(', '))}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2 style="margin-top:2.5rem">2. Gamer-impact threat triage</h2>
      <p style="color:#e2e8f0;max-width:70ch">We ingested 1,741 actively-exploited vulnerabilities from the CISA Known Exploited Vulnerabilities catalog and classified which affect players (consumer OS, browsers, GPU drivers, game platforms) versus enterprise/server software. <strong>${gamerRelevant}</strong> were gamer-relevant.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-top:1rem">
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Critical</strong><br>${sevCounts.critical || 0}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">High</strong><br>${sevCounts.high || 0}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Medium</strong><br>${sevCounts.medium || 0}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Low</strong><br>${sevCounts.low || 0}</div>
      </div>
      <p style="color:#94a3b8;margin-top:0.75rem">Affected platforms: ${Object.entries(platformCounts).map(([p, c]) => `${esc(p)} (${c})`).join(', ') || '—'}</p>

      <h2 style="margin-top:2.5rem">Methodology</h2>
      <ul style="color:#e2e8f0;max-width:70ch;padding-left:1.25rem">
        <li><strong>Grades:</strong> assigned from documented 2FA support (TOTP/passkeys) and publicly reported account-takeover or breach history. Sentiment metrics are not yet measured and are excluded.</li>
        <li><strong>Threat triage:</strong> keyword classification of CVE title/description against gaming-relevant platforms, with an enterprise/server exclusion list. Impact score is severity-based (0–100).</li>
        <li><strong>Caveat:</strong> initial assessment, not a penetration test. Verify before acting; corrections are published with a date note.</li>
      </ul>
    </article>
  </body>
</html>`;

const outDir = path.join(projectRoot, 'dist', 'research', 'state-of-gaming-security-2026');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
fs.writeFileSync(path.join(outDir, 'data.csv'), csv, 'utf-8');
console.log(`Generated research report: ${games.length} games, ${gamerRelevant} gamer threats, CSV download.`);
