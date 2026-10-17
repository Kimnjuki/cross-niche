/**
 * Generate static, crawlable platform security hubs from
 * src/data/platform-security.json:
 *   dist/platforms/{slug}/security/index.html  (+ /platforms index)
 *
 * Each hub lists the platform's official domains (anti-phishing), MFA status,
 * official security/recovery/sign-in links, and known scam patterns. Every
 * capability is asserted only where evidence-backed; specifics link to the
 * official page rather than being guessed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const DATA = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'platform-security.json'), 'utf8')
);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
        <a href="/platforms" style="color:#94a3b8;text-decoration:none">Platform Security</a>
        <a href="/recover" style="color:#94a3b8;text-decoration:none">Recovery</a>
        <a href="/games" style="color:#94a3b8;text-decoration:none">Security Grades</a>
      </nav>
    </header>
    ${body}
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid rgba(148,163,184,0.2);font-size:0.8rem;color:#64748b">
      <p>Guidance only — always use each platform's official site and support process. See our <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
    </footer>
  </body>
</html>`;
}

function generateHub(platform) {
  const url = `${BASE_URL}/platforms/${platform.slug}/security`;
  const title = `${platform.name} account security — official domains, 2FA & recovery | ${SITE_NAME}`;
  const description = `${platform.name} account security: official domains, two-factor authentication, account recovery, and the scam patterns that target ${platform.name} players.`;

  const domainsHtml = platform.officialDomains
    .map((d) => `<code style="color:#e2e8f0;background:rgba(148,163,184,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem;margin:0 0.4rem 0.4rem 0">${esc(d)}</code>`)
    .join('');

  const linksHtml = (platform.links ?? [])
    .map((l) => `<a href="${esc(l.url)}" style="display:inline-block;margin:0.25rem 0.75rem 0.25rem 0;color:#60a5fa;font-size:0.95rem">${esc(l.label)} ↗</a>`)
    .join('');

  const scamsHtml = (platform.scamPatterns ?? [])
    .map((s) => `<li style="margin-bottom:0.5rem;color:#cbd5e1">${esc(s)}</li>`)
    .join('');

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Platform security hub</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">${esc(platform.name)} account security</h1>
      <p style="color:#e2e8f0;max-width:65ch;margin:0 0 0.5rem">${esc(platform.name)} accounts are targeted because they hold games, payment methods, and — for many players — years of progress. This page lists the official domains, the two-factor options, the recovery path, and the scams that most often cost ${esc(platform.name)} players their accounts.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Quick security checklist</h2>
      <ol style="margin:0.5rem 0 0;padding-left:1.4rem;color:#cbd5e1">
        <li style="margin-bottom:0.5rem"><strong style="color:#e2e8f0">Enable two-factor authentication.</strong> ${esc(platform.mfaNote)}</li>
        <li style="margin-bottom:0.5rem"><strong style="color:#e2e8f0">Only trust the official domains below</strong> for sign-in and support.</li>
        <li style="margin-bottom:0.5rem"><strong style="color:#e2e8f0">Save the recovery path</strong> before you need it — recovery is fastest when you already know the official process.</li>
        <li style="margin-bottom:0.5rem"><strong style="color:#e2e8f0">Learn the common scams</strong> listed below so you recognise them before they cost you the account.</li>
      </ol>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Official domains</h2>
      <p style="color:#94a3b8;margin:0 0 0.5rem">Only trust these domains for ${esc(platform.name)} sign-in and support. Lookalike domains are a common phishing trick.</p>
      <div style="margin-bottom:1rem">${domainsHtml}</div>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Two-factor authentication</h2>
      <p style="color:#cbd5e1;margin:0"><strong style="color:#34d399">${esc(platform.mfa === 'supported' ? 'Supported' : platform.mfa)}</strong> — ${esc(platform.mfaNote)}</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Account recovery</h2>
      <p style="color:#cbd5e1;margin:0 0 0.5rem">If your account is stolen, follow our verified, step-by-step guide:</p>
      <a href="${esc(platform.recoveryPath)}" style="color:#60a5fa;font-weight:600">${esc(platform.name)} account recovery guide →</a>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Official links</h2>
      <div style="margin-bottom:1rem">${linksHtml}</div>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Known scam patterns</h2>
      <ul style="margin:0;padding-left:1.25rem">${scamsHtml}</ul>

      <p style="margin-top:2rem;color:#94a3b8;font-size:0.85rem">Reviewed for accuracy; always confirm on the official ${esc(platform.name)} site. Capabilities not listed are not asserted here.</p>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${platform.name} account security`,
    description,
    url,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Platform Security', item: `${BASE_URL}/platforms` },
        { '@type': 'ListItem', position: 3, name: platform.name, item: url },
      ],
    },
  };

  return pageShell(title, description, url, body, jsonLd);
}

function generateIndex(platforms) {
  const url = `${BASE_URL}/platforms`;
  const title = `Platform Security Hubs | ${SITE_NAME}`;
  const description =
    'Official domains, two-factor authentication, account recovery, and scam patterns for Steam, Discord, Epic, EA, Riot, PlayStation and Xbox.';

  const items = platforms
    .map((p) => `<li style="margin-bottom:0.75rem">
        <a href="/platforms/${esc(p.slug)}/security" style="color:#60a5fa;text-decoration:none;font-size:1.1rem">${esc(p.name)} account security</a>
        <span style="color:#94a3b8;font-size:0.85rem"> — ${esc((p.officialDomains ?? []).join(', '))}</span>
      </li>`)
    .join('');

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Platform security hubs</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Platform security hubs</h1>
      <p style="color:#e2e8f0;max-width:60ch">A platform-by-platform directory of official domains, two-factor authentication, recovery workflows, and the scam patterns that target players. Verified guidance — never account credentials.</p>
      <ul style="margin-top:1.5rem;list-style:none;padding:0">${items}</ul>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Platform Security Hubs',
    itemListElement: platforms.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.name} account security`,
      url: `${BASE_URL}/platforms/${p.slug}/security`,
    })),
  };

  return pageShell(title, description, url, body, jsonLd);
}

function main() {
  const platforms = DATA.platforms ?? [];
  const outDir = path.join(projectRoot, 'dist', 'platforms');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'index.html'), generateIndex(platforms), 'utf-8');

  const urls = [`${BASE_URL}/platforms`];
  for (const p of platforms) {
    const dir = path.join(outDir, p.slug, 'security');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateHub(p), 'utf-8');
    urls.push(`${BASE_URL}/platforms/${p.slug}/security`);
  }

  fs.writeFileSync(path.join(outDir, 'urls.json'), JSON.stringify(urls, null, 2), 'utf-8');
  console.log(`Generated ${platforms.length + 1} platform hub pages (index + ${platforms.length} hubs).`);
  console.log(urls.join('\n'));
}

main();
