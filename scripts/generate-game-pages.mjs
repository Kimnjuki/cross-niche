/**
 * Generate static, crawlable "Nexus Security Grade" pages from the exported
 * game library (src/data/game-library.json):
 *   - dist/games/index.html          (all games + grades)
 *   - dist/games/{slug}/index.html   (per-game detail)
 *
 * Each page carries full SEO meta + VideoGame JSON-LD so it is indexable and
 * eligible for rich results. The grade is an honest INITIAL assessment based
 * on documented 2FA support and breach history (see securityNotes); sentiment
 * fields are neutral because no sentiment data has been collected yet.
 *
 * Returns the list of generated game URLs so the sitemap generator can include
 * them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const LIB = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'game-library.json'), 'utf8')
);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function gradeMeta(grade) {
  const map = {
    A: { label: 'A', color: '#22c55e', verdict: 'Strong documented protections' },
    B: { label: 'B', color: '#a3e635', verdict: 'Good documented protections' },
    C: { label: 'C', color: '#facc15', verdict: 'Documented gaps to address' },
    D: { label: 'D', color: '#fb923c', verdict: 'Documented weaknesses' },
    F: { label: 'F', color: '#f87171', verdict: 'Documented high-risk pattern' },
  };
  return map[grade] || { label: grade, color: '#94a3b8', verdict: 'Unknown' };
}

function videoGameJsonLd(game, url) {
  const meta = gradeMeta(game.securityGrade);
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    url,
    description: game.securityNotes || '',
    genre: game.genres || [],
    gamePlatform: (game.platforms || []).join(', '),
    publisher: game.publisher ? { '@type': 'Organization', name: game.publisher } : undefined,
    datePublished: game.releaseYear ? String(game.releaseYear) : undefined,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Nexus Security Grade', value: meta.label },
      { '@type': 'PropertyValue', name: 'Assessment basis', value: 'Documented security controls and breach history — not a safety certification' },
      { '@type': 'PropertyValue', name: 'Methodology', value: `${BASE_URL}/methodology` },
    ],
  };
}

function pageShell(title, description, canonical, body, jsonLd) {
  return `<!doctype html>
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
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  </head>
  <body style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;line-height:1.6">
    <header style="margin-bottom:2rem">
      <a href="/" style="color:#60a5fa;text-decoration:none;font-weight:700">${SITE_NAME}</a>
      <nav style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem">
        <a href="/" style="color:#94a3b8;text-decoration:none">Home</a>
        <a href="/games" style="color:#94a3b8;text-decoration:none">Security Grades</a>
        <a href="/tools/gaming-security-checkup" style="color:#94a3b8;text-decoration:none">Checkup</a>
      </nav>
    </header>
    ${body}
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid rgba(148,163,184,0.2);font-size:0.8rem;color:#64748b">
      <p>Grades are document-based guidance, not a safety certification and not a live scan of any account. They are initial assessments of documented two-factor-authentication support and breach history. Sentiment is not measured. See our <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
    </footer>
  </body>
</html>`;
}

function gradeBadge(game) {
  const meta = gradeMeta(game.securityGrade);
  return `<span style="display:inline-block;background:${meta.color};color:#0f172a;font-weight:800;padding:0.25rem 0.75rem;border-radius:9999px;font-size:1.4rem">${meta.label}</span>`;
}

function generateDetail(game) {
  const url = `${BASE_URL}/games/${game.slug}`;
  const title = `${game.name} Security Grade ${game.securityGrade} | ${SITE_NAME}`;
  const description = game.securityNotes || `${game.name} security grade ${game.securityGrade}.`;
  const meta = gradeMeta(game.securityGrade);

  const platforms = (game.platforms || []).join(', ');
  const genres = (game.genres || []).join(', ');

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Nexus Security Grade — document-based guidance</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">${esc(game.name)}</h1>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        ${gradeBadge(game)}
        <span style="color:#94a3b8">${esc(meta.verdict)}</span>
      </div>
      <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:1rem">Not a safety certification or a live scan. Grade reflects documented security controls and breach history — see the <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
      <p style="font-size:1.1rem;color:#e2e8f0">${esc(game.securityNotes || '')}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1.5rem 0">
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Platforms</strong><br>${esc(platforms)}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Genres</strong><br>${esc(genres)}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Publisher</strong><br>${esc(game.publisher || '—')}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Released</strong><br>${esc(String(game.releaseYear || '—'))}</div>
      </div>
      <p style="margin-top:1.5rem"><a href="/tools/gaming-security-checkup" style="color:#60a5fa">Check your own gaming security →</a></p>
    </article>`;

  return pageShell(title, description, url, body, videoGameJsonLd(game, url));
}

function generateIndex(games) {
  const url = `${BASE_URL}/games`;
  const title = `Game Security Grades — Documented Protections | ${SITE_NAME}`;
  const description = 'Nexus Security Grades for popular games and platforms: Steam, Discord, Fortnite, Minecraft, Roblox, Valorant and more. Document-based guidance on documented security controls and breach history — not a safety certification.';

  const rows = games
    .map((g) => {
      const meta = gradeMeta(g.securityGrade);
      return `<tr>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15)"><a href="/games/${esc(g.slug)}" style="color:#60a5fa;text-decoration:none">${esc(g.name)}</a></td>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15)">${esc((g.platforms || []).join(', '))}</td>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);text-align:center"><span style="display:inline-block;background:${meta.color};color:#0f172a;font-weight:800;padding:0.1rem 0.6rem;border-radius:9999px">${meta.label}</span></td>
        <td style="padding:0.6rem 0.5rem;border-bottom:1px solid rgba(148,163,184,0.15);color:#94a3b8">${esc(meta.verdict)}</td>
      </tr>`;
    })
    .join('');

  const body = `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.5rem">Game Security Grades</h1>
      <p style="color:#e2e8f0;max-width:60ch">How safe are the games and platforms you play on? These grades are initial assessments based on documented two-factor-authentication support and known account-takeover or breach history.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:1.5rem">
        <thead><tr style="text-align:left;color:#94a3b8;border-bottom:1px solid rgba(148,163,184,0.3)">
          <th style="padding:0.6rem 0.5rem">Game / Platform</th>
          <th style="padding:0.6rem 0.5rem">Platforms</th>
          <th style="padding:0.6rem 0.5rem;text-align:center">Grade</th>
          <th style="padding:0.6rem 0.5rem">Verdict</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Game Security Grades',
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.name,
      url: `${BASE_URL}/games/${g.slug}`,
    })),
  };

  return pageShell(title, description, url, body, jsonLd);
}

function main() {
  const games = LIB.games || [];
  const outDir = path.join(projectRoot, 'dist', 'games');
  fs.mkdirSync(outDir, { recursive: true });

  // index
  fs.writeFileSync(path.join(outDir, 'index.html'), generateIndex(games), 'utf-8');

  // per-game
  const urls = [`${BASE_URL}/games`];
  for (const g of games) {
    const dir = path.join(outDir, g.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateDetail(g), 'utf-8');
    urls.push(`${BASE_URL}/games/${g.slug}`);
  }

  console.log(`Generated ${games.length + 1} game pages (index + ${games.length} details).`);
  // Emit URL list for the sitemap generator to consume (one per line on stdout via a marker file).
  fs.writeFileSync(path.join(outDir, 'urls.json'), JSON.stringify(urls, null, 2), 'utf-8');
  console.log(urls.join('\n'));
}

main();
