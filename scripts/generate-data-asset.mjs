/**
 * Generate the public gaming-security data asset — a link-worthy, machine-readable
 * dataset that other sites, journalists and researchers can cite and download.
 *
 *   dist/data/games.json               (security grades)
 *   dist/data/games.csv
 *   dist/data/platforms.json           (platform security)
 *   dist/data/platforms.csv
 *   dist/data/safety-verdicts.json     ("is it safe?" verdicts)
 *   dist/data/safety-verdicts.csv
 *   dist/data/recovery-playbooks.json  (recovery guides)
 *   dist/data/index.html               (documentation page)
 *
 * Licensed CC BY 4.0 — cite The Grid Nexus. Data is document-based (official
 * sources + public incident reporting), never a live scan or certification.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { staticShell, BASE_URL } from './lib/static-chrome.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readData(name) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'data', name), 'utf8'));
}

// ── CSV helpers ──────────────────────────────────────────────────────────────
function csvEscape(v) {
  const s = Array.isArray(v) ? v.join('; ') : String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(rows) {
  const headers = Object.keys(rows[0] ?? {});
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => csvEscape(r[h])).join(','));
  return lines.join('\n') + '\n';
}

function writeData(outDir, filename, content) {
  fs.writeFileSync(path.join(outDir, filename), content, 'utf8');
}

function buildGamesCsv(games) {
  return toCsv(
    games.map((g) => ({
      slug: g.slug,
      name: g.name,
      grade: g.securityGrade,
      platforms: g.platforms,
      genres: g.genres,
      publisher: g.publisher,
      releaseYear: g.releaseYear,
      securityNotes: g.securityNotes,
      updatedAt: g.updatedAt,
    })),
  );
}

function buildPlatformsCsv(platforms) {
  return toCsv(
    platforms.map((p) => ({
      slug: p.slug,
      name: p.name,
      mfa: p.mfa,
      mfaNote: p.mfaNote,
      officialDomains: p.officialDomains,
      recoveryPath: p.recoveryPath,
      scamPatterns: p.scamPatterns,
    })),
  );
}

function buildSafetyCsv(verdicts) {
  return toCsv(
    verdicts.map((v) => ({
      slug: v.slug,
      assetName: v.assetName,
      verdict: v.verdict,
      riskLevel: v.riskLevel,
      summary: v.summary,
      lastVerified: v.lastVerified,
    })),
  );
}

function generateDataPage(stats) {
  const url = `${BASE_URL}/data`;
  const title = `Gaming Security Data — Grades, Verdicts & Recovery | The Grid Nexus`;
  const description =
    'Free, machine-readable gaming security data: game security grades, "is it safe?" verdicts, platform security, and recovery playbooks. CC BY 4.0 — cite The Grid Nexus.';

  const fileList = [
    ['games.json', 'Game security grades (14 games) — slug, grade, platforms, publisher, notes.'],
    ['games.csv', 'Same as games.json, CSV for spreadsheets.'],
    ['platforms.json', 'Platform security (7 platforms) — official domains, 2FA, scam patterns, recovery.'],
    ['platforms.csv', 'Same as platforms.json, CSV for spreadsheets.'],
    ['safety-verdicts.json', '"Is it safe?" verdicts (16 entries) — verdict, risk level, summary.'],
    ['safety-verdicts.csv', 'Same as safety-verdicts.json, CSV for spreadsheets.'],
    ['recovery-playbooks.json', 'Account-recovery playbooks (56 guides) — platform × scenario steps.'],
  ];

  const rows = fileList
    .map(([f, desc]) => `<tr>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15)"><a href="/data/${esc(f)}" style="color:#00F0FF">${esc(f)}</a></td>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);color:#94a3b8">${esc(desc)}</td>
      </tr>`)
    .join('');

  const body = `
    <article>
      <p style="color:#00F0FF;font-size:0.9rem;margin:0 0 0.5rem">Data & research</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Gaming security data</h1>
      <p style="color:#e2e8f0;max-width:65ch">Free, machine-readable data on what's safe to download and how to recover accounts. Download it, cite it, build on it — <strong>CC BY 4.0</strong>, attribution to The Grid Nexus.</p>

      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1.1rem 0 1.5rem">
        <span style="font-size:0.82rem;color:#9FB0D0;background:rgba(18,28,48,0.5);border:1px solid rgba(120,160,255,0.16);padding:0.4rem 0.7rem;border-radius:999px">${esc(stats.games)} game grades</span>
        <span style="font-size:0.82rem;color:#9FB0D0;background:rgba(18,28,48,0.5);border:1px solid rgba(120,160,255,0.16);padding:0.4rem 0.7rem;border-radius:999px">${esc(stats.platforms)} platforms</span>
        <span style="font-size:0.82rem;color:#9FB0D0;background:rgba(18,28,48,0.5);border:1px solid rgba(120,160,255,0.16);padding:0.4rem 0.7rem;border-radius:999px">${esc(stats.verdicts)} safety verdicts</span>
        <span style="font-size:0.82rem;color:#9FB0D0;background:rgba(18,28,48,0.5);border:1px solid rgba(120,160,255,0.16);padding:0.4rem 0.7rem;border-radius:999px">${esc(stats.recovery)} recovery guides</span>
      </div>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Downloads</h2>
      <table style="width:100%;border-collapse:collapse">
        <tbody>${rows}</tbody>
      </table>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">How to cite</h2>
      <p style="color:#cbd5e1;margin:0">"The Grid Nexus. <em>Gaming Security Data</em>. Retrieved ${new Date().toISOString().slice(0, 10)}, from https://thegridnexus.com/data."</p>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">What this data is — and isn't</h2>
      <p style="color:#cbd5e1;margin:0;max-width:68ch">Grades and verdicts are document-based: compiled from official platform documentation and public incident reporting, then re-dated when reviewed. They are <strong>not</strong> a live scan of any device, download or account, and <strong>not</strong> a safety certification. Read the <a href="/methodology" style="color:#00F0FF">full methodology</a> before relying on them.</p>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">Licence</h2>
      <p style="color:#cbd5e1;margin:0">CC BY 4.0 — reuse and adapt freely with attribution to The Grid Nexus.</p>

      <p style="margin-top:2rem"><a href="/">← Back to The Grid Nexus</a></p>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'The Grid Nexus Gaming Security Data',
    description,
    url,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    publisher: { '@type': 'Organization', name: 'The Grid Nexus', url: BASE_URL },
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return staticShell(title, description, url, body, jsonLd);
}

function main() {
  const games = readData('game-library.json').games ?? [];
  const platforms = readData('platform-security.json').platforms ?? [];
  const verdicts = readData('safety-verdicts.json').verdicts ?? [];
  const recovery = readData('recovery-playbooks.json').pages ?? [];

  // Clean public projections — strip internal Convex fields (_id, _creationTime,
  // aliases, budget tier, etc.) and format timestamps as ISO dates.
  const iso = (t) => (t ? new Date(t).toISOString().slice(0, 10) : null);
  const cleanGames = games.map((g) => ({
    slug: g.slug,
    name: g.name,
    grade: g.securityGrade,
    platforms: g.platforms ?? [],
    genres: g.genres ?? [],
    publisher: g.publisher ?? null,
    developer: g.developer ?? null,
    releaseYear: g.releaseYear ?? null,
    securityNotes: g.securityNotes ?? '',
    updatedAt: iso(g.updatedAt),
  }));
  const cleanPlatforms = platforms.map((p) => ({
    slug: p.slug,
    name: p.name,
    mfa: p.mfa ?? null,
    mfaNote: p.mfaNote ?? '',
    officialDomains: p.officialDomains ?? [],
    recoveryPath: p.recoveryPath ?? null,
    scamPatterns: p.scamPatterns ?? [],
  }));
  const cleanVerdicts = verdicts.map((v) => ({
    slug: v.slug,
    assetName: v.assetName,
    verdict: v.verdict,
    riskLevel: v.riskLevel,
    summary: v.summary,
    whatItIs: v.whatItIs ?? '',
    scamPatterns: v.scamPatterns ?? [],
    protectionsRequired: v.protectionsRequired ?? [],
    whatToDoIfCompromised: v.whatToDoIfCompromised ?? '',
    lastVerified: v.lastVerified ?? null,
  }));
  const cleanRecovery = recovery.map((p) => ({
    platform: p.platform?.slug,
    platformName: p.platform?.name,
    scenario: p.playbook?.scenario,
    title: p.playbook?.title,
    steps: (p.playbook?.steps?.steps ?? []).map((s) => s.title),
  }));

  for (const dir of ['public', 'dist']) {
    const outDir = path.join(projectRoot, dir, 'data');
    fs.mkdirSync(outDir, { recursive: true });

    writeData(outDir, 'games.json', JSON.stringify({ games: cleanGames, _note: 'Game security grades. Document-based, not a certification. CC BY 4.0.', _source: `${BASE_URL}/data` }, null, 2));
    writeData(outDir, 'games.csv', buildGamesCsv(games));
    writeData(outDir, 'platforms.json', JSON.stringify({ platforms: cleanPlatforms, _note: 'Platform security. CC BY 4.0.', _source: `${BASE_URL}/data` }, null, 2));
    writeData(outDir, 'platforms.csv', buildPlatformsCsv(platforms));
    writeData(outDir, 'safety-verdicts.json', JSON.stringify({ verdicts: cleanVerdicts, _note: 'Safety verdicts. CC BY 4.0.', _source: `${BASE_URL}/data` }, null, 2));
    writeData(outDir, 'safety-verdicts.csv', buildSafetyCsv(verdicts));
    writeData(outDir, 'recovery-playbooks.json', JSON.stringify({ pages: cleanRecovery, _note: 'Recovery playbooks. CC BY 4.0.', _source: `${BASE_URL}/data` }, null, 2));

    // Documentation page (only in dist/, where nginx serves static HTML).
    if (dir === 'dist') {
      writeData(outDir, 'index.html', generateDataPage({ games: games.length, platforms: platforms.length, verdicts: verdicts.length, recovery: recovery.length }));
    }
  }

  console.log(`Generated /data asset: ${games.length} games, ${platforms.length} platforms, ${verdicts.length} verdicts, ${recovery.length} recovery guides.`);

  // ── Agent-discovery api-catalog (RFC 9727 §3) ──────────────────────────────
  // Served at /.well-known/api-catalog and linked from the homepage via a
  // `Link: </.well-known/api-catalog>; rel="api-catalog"` header so AI agents
  // and API clients can discover the machine-readable data resources.
  const catalog = JSON.stringify(
    {
      '@context': 'https://www.w3.org/ns/json-ld',
      '@type': 'APIReference',
      name: 'The Grid Nexus — Gaming Security Data',
      description: 'Machine-readable gaming-security data: game grades, platform security, safety verdicts, and recovery playbooks.',
      url: `${BASE_URL}/data`,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      apis: [
        { name: 'Game Security Grades', url: `${BASE_URL}/data/games.json`, format: 'application/json' },
        { name: 'Platform Security', url: `${BASE_URL}/data/platforms.json`, format: 'application/json' },
        { name: 'Safety Verdicts', url: `${BASE_URL}/data/safety-verdicts.json`, format: 'application/json' },
        { name: 'Recovery Playbooks', url: `${BASE_URL}/data/recovery-playbooks.json`, format: 'application/json' },
        { name: 'Full Text Corpus', url: `${BASE_URL}/llms-full.txt`, format: 'text/plain' },
      ],
    },
    null,
    2,
  );
  for (const dir of ['public', 'dist']) {
    const wellKnownDir = path.join(projectRoot, dir, '.well-known');
    fs.mkdirSync(wellKnownDir, { recursive: true });
    writeData(wellKnownDir, 'api-catalog', catalog);
  }
  console.log('Generated /.well-known/api-catalog (agent-discovery catalog).');
}

main();
