/**
 * Generate static, crawlable "Is it safe?" verdict pages from
 * src/data/safety-verdicts.json:
 *   dist/safety/{slug}/index.html  +  dist/safety/index.html hub
 *
 * Each page: verdict badge, risk level, summary, what-it-is, official source,
 * scam patterns, required protections, what-to-do-if-compromised, last-verified,
 * sources. FAQPage JSON-LD targets "is X safe" queries. Verdicts are
 * evidence-based category assessments, never a device/account/file audit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

const DATA = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'safety-verdicts.json'), 'utf8')
);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const VERDICT_STYLE = {
  safe: { label: 'Safe', color: '#34d399', blurb: 'Established or official, with no known indicators. Standard caution still applies.' },
  cautious: { label: 'Cautious', color: '#f59e0b', blurb: 'Legitimate, but with real, documented risks you should manage.' },
  avoid: { label: 'Avoid', color: '#ef4444', blurb: 'A documented scam or malware category. Do not engage or download.' },
};

function riskDots(level) {
  const n = Math.max(0, Math.min(4, Number(level) || 0));
  const full = '●'.repeat(n);
  const empty = '○'.repeat(4 - n);
  return `<span style="color:#f59e0b;letter-spacing:0.15em">${full}</span><span style="color:#475569;letter-spacing:0.15em">${empty}</span> <span style="color:#94a3b8;font-size:0.85rem">Risk ${n}/4</span>`;
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
        <a href="/safety" style="color:#94a3b8;text-decoration:none">Is it safe?</a>
        <a href="/tools/scam-check" style="color:#94a3b8;text-decoration:none">Scam Checker</a>
        <a href="/recover" style="color:#94a3b8;text-decoration:none">Recovery</a>
      </nav>
    </header>
    ${body}
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid rgba(148,163,184,0.2);font-size:0.8rem;color:#64748b">
      <p>This verdict is a category-level assessment based on documented sources, not an audit of a specific device, account, or file. Always verify the official source yourself. See our <a href="/methodology" style="color:#60a5fa">methodology</a>.</p>
    </footer>
  </body>
</html>`;
}

function generateVerdict(v) {
  const style = VERDICT_STYLE[v.verdict] || VERDICT_STYLE.cautious;
  const url = `${BASE_URL}/safety/${v.slug}`;
  const title = `Is ${v.assetName} safe? — ${style.label} | ${SITE_NAME}`;
  const description = `${style.label}: ${v.summary}`;

  const patterns = (v.scamPatterns ?? [])
    .map((s) => `<li style="margin-bottom:0.35rem">${esc(s)}</li>`)
    .join('');
  const protections = (v.protectionsRequired ?? [])
    .map((s) => `<li style="margin-bottom:0.35rem">${esc(s)}</li>`)
    .join('');
  const sources = (v.sources ?? [])
    .map((s) => `<a href="${esc(s.url)}" style="display:inline-block;margin:0.25rem 0.5rem 0.25rem 0;color:#60a5fa;font-size:0.9rem">${esc(s.label)} ↗</a>`)
    .join('');

  const official = v.officialSource
    ? `<p style="color:#e2e8f0;margin:0"><strong style="color:#34d399">Official source:</strong> <code style="color:#e2e8f0;background:rgba(148,163,184,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem">${esc(v.officialSource)}</code></p>`
    : `<p style="color:#94a3b8;margin:0"><em>No legitimate official source — this is a third-party or scam category.</em></p>`;

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Safety verdict</p>
      <h1 style="font-size:2rem;margin:0 0 0.5rem">Is ${esc(v.assetName)} safe?</h1>
      <div style="display:flex;align-items:center;gap:0.75rem;margin:0.75rem 0">
        <span style="background:${style.color};color:#0f172a;font-weight:800;padding:0.25rem 0.75rem;border-radius:0.35rem;font-size:1.1rem">${style.label}</span>
        <span>${riskDots(v.riskLevel)}</span>
      </div>
      <p style="color:#94a3b8;margin:0 0 0.5rem">${esc(style.blurb)}</p>
      <p style="color:#e2e8f0;font-size:1.1rem;max-width:65ch">${esc(v.summary)}</p>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">What this is</h2>
      <p style="color:#cbd5e1;margin:0;max-width:65ch">${esc(v.whatItIs)}</p>
      ${official}

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">Known scam patterns</h2>
      <ul style="margin:0;padding-left:1.25rem;color:#cbd5e1">${patterns}</ul>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">Required protections</h2>
      <ul style="margin:0;padding-left:1.25rem;color:#cbd5e1">${protections}</ul>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">What to do if you are already affected</h2>
      <p style="color:#cbd5e1;margin:0;max-width:65ch">${esc(v.whatToDoIfCompromised)}</p>

      <h2 style="font-size:1.2rem;margin:1.75rem 0 0.5rem">Sources & last verified</h2>
      <div style="margin-bottom:0.5rem">${sources}</div>
      <p style="color:#94a3b8;font-size:0.85rem;margin:0">Last verified ${esc(v.lastVerified)} · Verdicts are reassessed as new information emerges.</p>

      <p style="margin-top:1.75rem"><a href="/tools/scam-check" style="color:#60a5fa">Paste a link or message into the Scam Checker →</a></p>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${v.assetName} safe?`,
        acceptedAnswer: { '@type': 'Answer', text: `${style.label} — ${v.summary}` },
      },
      {
        '@type': 'Question',
        name: `What should I do if I already interacted with ${v.assetName}?`,
        acceptedAnswer: { '@type': 'Answer', text: v.whatToDoIfCompromised },
      },
    ],
  };

  return pageShell(title, description, url, body, jsonLd);
}

function generateIndex(verdicts) {
  const url = `${BASE_URL}/safety`;
  const title = `Is it safe? — Game, mod & site safety verdicts | ${SITE_NAME}`;
  const description =
    'Evidence-based safety verdicts for games, mods, marketplaces, downloads and scams. Check whether something is safe before you download, trade or log in.';

  const byVerdict = (k) => verdicts.filter((v) => v.verdict === k);

  const renderGroup = (k) => {
    const items = byVerdict(k)
      .map((v) => {
        const style = VERDICT_STYLE[k];
        return `<li style="margin-bottom:0.6rem">
          <a href="/safety/${esc(v.slug)}" style="color:#60a5fa;text-decoration:none">${esc(v.assetName)}</a>
          <span style="color:${style.color};font-size:0.8rem;margin-left:0.5rem">${style.label}</span>
        </li>`;
      })
      .join('');
    return `<h2 style="font-size:1.15rem;margin:1.5rem 0 0.5rem;color:${VERDICT_STYLE[k].color}">${VERDICT_STYLE[k].label}</h2>
      <ul style="margin:0;padding-left:1.25rem">${items}</ul>`;
  };

  const body = `
    <article>
      <p style="color:#60a5fa;font-size:0.9rem;margin:0 0 0.5rem">Safety database</p>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Is it safe?</h1>
      <p style="color:#e2e8f0;max-width:65ch">Before you download, trade, log in, or recover an account, check the verdict. These are evidence-based category assessments — not an audit of your device, account, or a specific file.</p>
      ${renderGroup('avoid')}
      ${renderGroup('cautious')}
      ${renderGroup('safe')}
      <p style="margin-top:1.75rem"><a href="/tools/scam-check" style="color:#60a5fa">Not sure about a specific link or message? Run the Scam Checker →</a></p>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Game, mod & site safety verdicts',
    description,
    url,
  };

  return pageShell(title, description, url, body, jsonLd);
}

function main() {
  const verdicts = DATA.verdicts ?? [];
  const outDir = path.join(projectRoot, 'dist', 'safety');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'index.html'), generateIndex(verdicts), 'utf-8');

  const urls = [`${BASE_URL}/safety`];
  for (const v of verdicts) {
    const dir = path.join(outDir, v.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateVerdict(v), 'utf-8');
    urls.push(`${BASE_URL}/safety/${v.slug}`);
  }

  fs.writeFileSync(path.join(outDir, 'urls.json'), JSON.stringify(urls, null, 2), 'utf-8');
  console.log(`Generated ${verdicts.length + 1} safety pages (index + ${verdicts.length} verdicts).`);
  console.log(urls.join('\n'));
}

main();
