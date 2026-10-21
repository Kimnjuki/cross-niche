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
import { staticShell } from './lib/static-chrome.mjs';

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
  return staticShell(title, description, canonical, body, jsonLd);
}
function platformFaqHtml(platform) {
  const name = esc(platform.name);
  return `
      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Frequently asked</h2>
      <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
        <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">How do I avoid ${name} phishing scams?</summary>
        <div style="padding:0 1rem 0.8rem;color:#cbd5e1">Only sign in on the official domains listed above. ${name} will never ask for your password or two-factor codes over chat, email or DM. Any message claiming your account is "limited" or "deactivated" with a login link is phishing.</div>
      </details>
      <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
        <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">Is my ${name} account at risk?</summary>
        <div style="padding:0 1rem 0.8rem;color:#cbd5e1">Account-takeover risk is highest when two-factor authentication is off, when you reuse a password, or when you click a fake login link. The single highest-impact fix is enabling 2FA and using a unique password.</div>
      </details>
      <details style="background:rgba(148,163,184,0.06);border:1px solid rgba(148,163,184,0.15);border-radius:0.5rem;margin-bottom:0.5rem;overflow:hidden">
        <summary style="cursor:pointer;padding:0.7rem 1rem;color:#e2e8f0;font-weight:600">What do I do if my ${name} account is hacked?</summary>
        <div style="padding:0 1rem 0.8rem;color:#cbd5e1">Secure your email first, then follow the <a href="${esc(platform.recoveryPath)}" style="color:#60a5fa">official ${name} recovery guide</a>. Never pay a third party to recover it — recovery is always free through ${name} support.</div>
      </details>`;
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

      ${platformFaqHtml(platform)}

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
