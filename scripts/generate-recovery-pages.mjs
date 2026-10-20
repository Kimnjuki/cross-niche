/**
 * Generate static, crawlable recovery pages from src/data/recovery-playbooks.json:
 *   dist/recover/{platform}/{scenario}/index.html
 *
 * Each page carries SEO meta + HowTo JSON-LD for the recovery steps, the
 * verified official links, and a disclaimer that this is guidance, not account
 * recovery on the user's behalf.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const DATA = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'recovery-playbooks.json'), 'utf8')
);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleCase(s) {
  return String(s)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pageShell(title, description, canonical, body, jsonLd) {
  const scripts = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    .filter(Boolean)
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join('\n    ');
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
    <script type="application/ld+json">${scripts}</script>
  </head>
  <body style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;line-height:1.6">
    <header style="margin-bottom:2rem">
      <a href="/" style="color:#60a5fa;text-decoration:none;font-weight:700">${SITE_NAME}</a>
      <nav style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem">
        <a href="/" style="color:#94a3b8;text-decoration:none">Home</a>
        <a href="/recover" style="color:#94a3b8;text-decoration:none">Recovery</a>
        <a href="/games" style="color:#94a3b8;text-decoration:none">Security Grades</a>
      </nav>
    </header>
    ${body}
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid rgba(148,163,184,0.2);font-size:0.8rem;color:#64748b">
      <p>Guidance only — The Grid Nexus does not recover accounts or request credentials. Always follow the official platform process. See our <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
    </footer>
  </body>
</html>`;
}

function generatePage(page) {
  const { platform, playbook, officialLinks } = page;
  const scenarioLabel = titleCase(playbook.scenario);
  const url = `${BASE_URL}/recover/${platform.slug}/${playbook.scenario}`;
  const title = `${platform.name} Account Recovery — ${scenarioLabel} | ${SITE_NAME}`;
  const description = `Step-by-step ${platform.name} account recovery: secure your device and email, then use the official ${platform.name} process. Verified guidance, not account recovery on your behalf.`;

  const steps = Array.isArray(playbook.steps?.steps) ? playbook.steps.steps : [];
  const stepsHtml = steps
    .map((s, i) => {
      const link = s.officialLinkPurpose
        ? officialLinks.find((l) => l.purpose === s.officialLinkPurpose)
        : null;
      return `<li style="margin-bottom:1rem">
        <strong style="color:#e2e8f0">${i + 1}. ${esc(s.title)}</strong>
        <p style="color:#94a3b8;margin:0.25rem 0">${esc(s.body)}</p>
        ${link ? `<a href="${esc(link.url)}" style="color:#60a5fa;font-size:0.9rem">Official ${esc(s.officialLinkPurpose)} page ↗</a>` : ''}
      </li>`;
    })
    .join('');

  const linksHtml = (officialLinks ?? [])
    .map((l) => `<a href="${esc(l.url)}" style="display:inline-block;margin:0.25rem 0.5rem 0.25rem 0;color:#60a5fa;font-size:0.9rem">${esc(l.purpose)} ↗</a>`)
    .join('');

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Recovery navigator</p>
      <h1 style="font-size:2rem;margin:0 0 0.5rem">${esc(platform.name)} account recovery</h1>
      <p style="color:#e2e8f0">${esc(playbook.steps?.disclaimer || 'Guidance only — follow the official process.')}</p>
      <ol style="margin:1.5rem 0;padding-left:1.5rem">${stepsHtml}</ol>
      <div style="margin-top:1.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.4);border-radius:0.5rem;background:rgba(239,68,68,0.08)">
        <strong style="color:#ef4444">Never pay a third party to recover your account.</strong>
        <p style="color:#cbd5e1;margin:0.5rem 0 0">Account recovery is always done through ${esc(platform.name)}'s official support, free of charge. Anyone offering to "hack back" or recover your account for a fee is scamming you — and no legitimate process will ever ask for your password, 2FA codes, or recovery codes.</p>
      </div>
      <div style="margin-top:1.5rem">
        <strong style="color:#e2e8f0">Verified official links</strong>
        <div style="margin-top:0.5rem">${linksHtml}</div>
      </div>
      <p style="margin-top:1.5rem;color:#94a3b8;font-size:0.85rem">Reviewed ${new Date(playbook.reviewedAt ?? Date.now()).toISOString().slice(0, 10)} · Playbook v${esc(playbook.version)}</p>
    </article>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${platform.name} account recovery`,
      description,
      step: steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Should I pay someone to recover my ${platform.name} account?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `No. Account recovery is always done through ${platform.name}'s official support, free of charge. Anyone offering paid recovery is scamming you.`,
          },
        },
        {
          '@type': 'Question',
          name: `Will ${platform.name} ever ask for my password or 2FA code?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. No legitimate support process asks for your password, 2FA codes, or recovery codes. If someone asks, it is a scam.',
          },
        },
      ],
    },
  ];

  return pageShell(title, description, url, body, jsonLd);
}

function generateIndex(pages) {
  const url = `${BASE_URL}/recover`;
  const title = `Account Recovery Navigator | ${SITE_NAME}`;
  const description =
    'Verified, step-by-step account recovery guidance for Steam, Discord, Epic, EA, Riot Games, PlayStation and Xbox. We route you to the official process — we do not recover accounts for you.';

  const items = pages
    .map((page) => {
      const scenarioLabel = titleCase(page.playbook.scenario);
      return `<li style="margin-bottom:0.6rem">
        <a href="/recover/${esc(page.platform.slug)}/${esc(page.playbook.scenario)}" style="color:#60a5fa;text-decoration:none">${esc(page.platform.name)} — ${esc(scenarioLabel)}</a>
      </li>`;
    })
    .join('');

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Recovery navigator</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Account recovery navigator</h1>
      <p style="color:#e2e8f0;max-width:60ch">Guided, verified recovery steps for the platforms you play on. We route you to each platform's official process — we never recover accounts on your behalf or ask for credentials.</p>
      <ul style="margin-top:1.5rem;list-style:none;padding:0">${items}</ul>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Account Recovery Navigator',
    itemListElement: pages.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.platform.name} — ${titleCase(p.playbook.scenario)}`,
      url: `${BASE_URL}/recover/${p.platform.slug}/${p.playbook.scenario}`,
    })),
  };

  return pageShell(title, description, url, body, jsonLd);
}

function main() {
  const pages = DATA.pages ?? [];
  const outDir = path.join(projectRoot, 'dist', 'recover');
  fs.mkdirSync(outDir, { recursive: true });

  // index hub
  fs.writeFileSync(path.join(outDir, 'index.html'), generateIndex(pages), 'utf-8');

  const urls = [`${BASE_URL}/recover`];
  for (const page of pages) {
    const dir = path.join(outDir, page.platform.slug, page.playbook.scenario);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generatePage(page), 'utf-8');
    urls.push(`${BASE_URL}/recover/${page.platform.slug}/${page.playbook.scenario}`);
  }

  fs.writeFileSync(path.join(outDir, 'urls.json'), JSON.stringify(urls, null, 2), 'utf-8');
  console.log(`Generated ${pages.length + 1} recovery pages (index + ${pages.length} details).`);
  console.log(urls.join('\n'));
}

main();
