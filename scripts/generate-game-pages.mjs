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
import { staticShell } from './lib/static-chrome.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const LIB = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'game-library.json'), 'utf8')
);

// Platform security data (official domains, 2FA, recovery, scam patterns) for
// the scorecard. Games whose account security is the platform's map to a hub.
const PLATFORM_SECURITY = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'platform-security.json'), 'utf8')
).platforms || [];
const PLATFORM_BY_SLUG = Object.fromEntries(PLATFORM_SECURITY.map((p) => [p.slug, p]));

const GAME_TO_PLATFORM = {
  steam: 'steam',
  discord: 'discord',
  'playstation-network': 'playstation',
  valorant: 'riot-games',
  'league-of-legends': 'riot-games',
  'apex-legends': 'ea',
  fortnite: 'epic-games',
  'counter-strike-2': 'steam',
};

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
  return staticShell(title, description, canonical, body, jsonLd);
}
function gradeBadge(game) {
  const meta = gradeMeta(game.securityGrade);
  return `<span style="display:inline-block;background:${meta.color};color:#0f172a;font-weight:800;padding:0.25rem 0.75rem;border-radius:9999px;font-size:1.4rem">${meta.label}</span>`;
}

function scorecardHtml(game) {
  const platformSlug = GAME_TO_PLATFORM[game.slug];
  const platform = platformSlug ? PLATFORM_BY_SLUG[platformSlug] : null;
  const reviewed = game.updatedAt ? new Date(game.updatedAt).toISOString().slice(0, 10) : '—';

  if (platform) {
    const domains = (platform.officialDomains || []).map((d) => `<code style="color:#e2e8f0;background:rgba(148,163,184,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem;margin-right:0.4rem">${esc(d)}</code>`).join('');
    const scams = (platform.scamPatterns || []).slice(0, 3).map((s) => `<li style="margin-bottom:0.3rem;color:#cbd5e1">${esc(s)}</li>`).join('');
    return `
      <h2 style="font-size:1.2rem;margin:2rem 0 0.75rem">Account security scorecard</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem">
          <strong style="color:#60a5fa">Two-factor authentication</strong>
          <p style="color:#cbd5e1;font-size:0.9rem;margin:0.4rem 0 0">${esc(platform.mfaNote)}</p>
        </div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem">
          <strong style="color:#60a5fa">Account recovery</strong>
          <p style="color:#cbd5e1;font-size:0.9rem;margin:0.4rem 0 0">If this account is stolen, follow the <a href="${esc(platform.recoveryPath)}" style="color:#60a5fa">${esc(platform.name)} recovery guide</a>.</p>
        </div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem">
          <strong style="color:#60a5fa">Official domains</strong>
          <p style="margin:0.4rem 0 0">${domains}</p>
          <p style="color:#94a3b8;font-size:0.8rem;margin:0.5rem 0 0">Only trust these for sign-in and support.</p>
        </div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem">
          <strong style="color:#60a5fa">Known scam patterns</strong>
          <ul style="margin:0.4rem 0 0;padding-left:1.2rem">${scams}</ul>
        </div>
      </div>
      <p style="color:#94a3b8;font-size:0.85rem;margin-top:0.75rem">See the full <a href="/platforms/${esc(platformSlug)}/security" style="color:#60a5fa">${esc(platform.name)} security hub</a> · Reviewed ${esc(reviewed)}.</p>
    `;
  }

  return `
    <h2 style="font-size:1.2rem;margin:2rem 0 0.75rem">Account security</h2>
    <p style="color:#cbd5e1;max-width:65ch">${esc(game.securityNotes || '')}</p>
    <p style="color:#94a3b8;font-size:0.85rem">This game uses its own account system. Enable the developer's two-factor authentication and follow its official recovery process. Reviewed ${esc(reviewed)}.</p>
  `;
}

function protectChecklistHtml(game) {
  const platformSlug = GAME_TO_PLATFORM[game.slug];
  const platform = platformSlug ? PLATFORM_BY_SLUG[platformSlug] : null;
  if (!platform) {
    return `
    <h2 style="font-size:1.2rem;margin:2rem 0 0.75rem">Protect this account — quick checklist</h2>
    <ol style="margin:0.5rem 0 0;padding-left:1.4rem;color:#cbd5e1">
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Enable two-factor authentication</strong> in the game or launcher's account settings if it is offered.</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Only download from the official store</strong> — never from "free game" or "free skins" sites, which bundle info-stealers.</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Use a unique password</strong> you do not reuse anywhere else, ideally generated by a password manager.</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Watch for free-currency and free-skin scams</strong> — the most common way ${esc(game.name)} accounts are stolen.</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Run a quick self-check.</strong> Our <a href="/tools/gaming-security-checkup" style="color:#60a5fa">gaming security checkup</a> walks through the basics.</li>
    </ol>`;
  }

  const domains = (platform.officialDomains || []).map((d) => `<code style="color:#e2e8f0;background:rgba(148,163,184,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem;margin-right:0.3rem">${esc(d)}</code>`).join('');
  const topScams = (platform.scamPatterns || []).slice(0, 2).map((s) => `<li style="margin-bottom:0.3rem;color:#cbd5e1">${esc(s)}</li>`).join('');

  return `
    <h2 style="font-size:1.2rem;margin:2rem 0 0.75rem">Protect this account — quick checklist</h2>
    <ol style="margin:0.5rem 0 0;padding-left:1.4rem;color:#cbd5e1">
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Turn on two-factor authentication.</strong> ${esc(platform.mfaNote)}</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Only sign in on official domains.</strong> ${domains}</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Save the recovery path before you need it.</strong> If the account is ever stolen, use the <a href="${esc(platform.recoveryPath)}" style="color:#60a5fa">official ${esc(platform.name)} recovery guide</a>.</li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Know the two most common scams targeting ${esc(platform.name)} players:</strong>
        <ul style="margin:0.4rem 0 0;padding-left:1.2rem">${topScams}</ul>
      </li>
      <li style="margin-bottom:0.6rem"><strong style="color:#e2e8f0">Run a quick self-check.</strong> Our <a href="/tools/gaming-security-checkup" style="color:#60a5fa">gaming security checkup</a> walks through the basics in a few minutes.</li>
    </ol>`;
}

function gameIntroHtml(game) {
  const meta = gradeMeta(game.securityGrade);
  return `<p style="color:#cbd5e1;max-width:68ch;margin:0">Is <strong style="color:#e2e8f0">${esc(game.name)}</strong> safe to play? Our document-based review gives it a <strong style="color:#e2e8f0">${meta.label} security grade</strong> — ${meta.verdict.toLowerCase()}. The grade reflects documented account protections (such as two-factor authentication) and any public breach or account-takeover history, not a live scan or a safety certification.</p>`;
}

function gameFaqHtml(game) {
  const platformSlug = GAME_TO_PLATFORM[game.slug];
  const platform = platformSlug ? PLATFORM_BY_SLUG[platformSlug] : null;
  const name = esc(game.name);
  const twofa = platform ? esc(platform.mfaNote) : 'Check whether the game offers two-factor authentication and enable it if available.';
  const recovery = platform
    ? `Follow the <a href="${esc(platform.recoveryPath)}" style="color:#60a5fa">official ${esc(platform.name)} recovery guide</a>.`
    : 'Use the developer\'s official account-recovery process.';
  return `
    <h2 style="font-size:1.2rem;margin:2rem 0 0.75rem">Frequently asked</h2>
    <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
      <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">Is ${name} safe to download?</summary>
      <div style="padding:0 1rem 0.8rem;color:#cbd5e1">Only download ${name} from its official store or launcher. Fake "free ${name}" downloads are a common way to deliver info-stealers. The ${gradeMeta(game.securityGrade).label} grade reflects documented protections, not a guarantee — always install from the official source.</div>
    </details>
    <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
      <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">Does ${name} support two-factor authentication?</summary>
      <div style="padding:0 1rem 0.8rem;color:#cbd5e1">${twofa}</div>
    </details>
    <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
      <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">What if my ${name} account is hacked?</summary>
      <div style="padding:0 1rem 0.8rem;color:#cbd5e1">${recovery} Act within the first few minutes: secure your email, change the password from a clean device, then enable two-factor authentication.</div>
    </details>`;
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
      ${gameIntroHtml(game)}
      <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:1rem">Not a safety certification or a live scan. Grade reflects documented security controls and breach history — see the <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
      <p style="font-size:1.1rem;color:#e2e8f0">${esc(game.securityNotes || '')}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1.5rem 0">
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Platforms</strong><br>${esc(platforms)}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Genres</strong><br>${esc(genres)}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Publisher</strong><br>${esc(game.publisher || '—')}</div>
        <div style="background:rgba(148,163,184,0.08);padding:1rem;border-radius:0.5rem"><strong style="color:#60a5fa">Released</strong><br>${esc(String(game.releaseYear || '—'))}</div>
      </div>
      ${scorecardHtml(game)}
      ${protectChecklistHtml(game)}
      ${gameFaqHtml(game)}
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
