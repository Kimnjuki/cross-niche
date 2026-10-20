/**
 * Generate static, crawlable "Is it safe?" pages from src/data/safety-verdicts.json:
 *   dist/safety/{slug}/index.html  +  dist/safety/index.html (Gamer Safety Console)
 *
 * The index is a task-first "Gamer Safety Console": Safety Triage → Protection
 * Grid → recovery pathways → prevention CTA → trust/methodology. Everything is
 * server-rendered (crawlable, no-JS-safe); the triage is scenario cards that
 * route to the right verdict, recovery guide, or tool.
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
const PLATFORMS = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'platform-security.json'), 'utf8')
).platforms;

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const VERDICT_STYLE = {
  safe: { label: 'Safe', color: '#34d399', blurb: 'Established or official, with no known indicators.' },
  cautious: { label: 'Cautious', color: '#f59e0b', blurb: 'Legitimate, but with real, documented risks.' },
  avoid: { label: 'Avoid', color: '#ef4444', blurb: 'A documented scam or malware category.' },
};

function riskDots(level) {
  const n = Math.max(0, Math.min(4, Number(level) || 0));
  const full = '●'.repeat(n);
  const empty = '○'.repeat(4 - n);
  return `<span style="color:#f59e0b;letter-spacing:0.15em">${full}</span><span style="color:#475569;letter-spacing:0.15em">${empty}</span> <span style="color:#94a3b8;font-size:0.85rem">Risk ${n}/4</span>`;
}

// Task-first triage: "What happened?" → the exact next step.
const TRIAGE_SCENARIOS = [
  { icon: '🔓', title: 'My account may be hacked', desc: 'Recover it now, platform by platform, before the attacker locks you out.', href: '/recover', cta: 'Start recovery', tone: '#ef4444' },
  { icon: '🔗', title: 'I clicked a suspicious link or message', desc: 'Check whether that Discord, Steam or giveaway link is a scam.', href: '/tools/scam-check', cta: 'Run the Scam Checker', tone: '#f59e0b' },
  { icon: '📦', title: 'I installed a mod, APK, or unknown file', desc: 'Find out if that download carries malware and what to do if it did.', href: '/safety/free-game-cheats-aimbot', cta: 'Check downloads', tone: '#f59e0b' },
  { icon: '🔑', title: 'Someone asked for my login code or password', desc: 'Legitimate support never asks for these. This is a scam — do not share.', href: '/safety/discord-verify-qr-scams', cta: 'Learn the scam', tone: '#ef4444' },
  { icon: '🛡️', title: 'I want to prevent problems', desc: 'Harden your accounts in minutes with a guided checkup.', href: '/tools/gaming-security-checkup', cta: 'Run the 60-second checkup', tone: '#00F0FF' },
];

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: 'Inter', 'Manrope', system-ui, sans-serif; background: #0A0A0B; color: #e2e8f0; line-height: 1.6; }
      h1, h2, h3, h4 { font-family: 'Space Grotesk', 'Inter Tight', system-ui, sans-serif; letter-spacing: -0.02em; }
      code { font-family: 'JetBrains Mono', monospace; }
      a { color: #00F0FF; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); }
      .card { background: rgba(22, 22, 26, 0.7); border: 1px solid rgba(63, 63, 70, 0.5); border-radius: 0.75rem; padding: 1rem; transition: border-color 0.15s ease, transform 0.15s ease; }
      .card:hover { border-color: rgba(0, 240, 255, 0.4); transform: translateY(-2px); }
      .card a { color: inherit; text-decoration: none; display: block; }
      .verdict-badge { display: inline-block; padding: 0.1rem 0.55rem; border-radius: 0.35rem; font-size: 0.75rem; font-weight: 700; }
      @media (prefers-reduced-motion: reduce) { .card { transition: none; } }
    </style>
    ${scripts}
  </head>
  <body style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem;background-image:radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,240,255,0.06), transparent)">
    <header style="margin-bottom:2rem">
      <a href="/" style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.1rem">${SITE_NAME}</a>
      <nav style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem">
        <a href="/" style="color:#94a3b8">Home</a>
        <a href="/safety" style="color:#00F0FF">Is it safe?</a>
        <a href="/games" style="color:#94a3b8">Security Grades</a>
        <a href="/tools/scam-check" style="color:#94a3b8">Scam Checker</a>
        <a href="/recover" style="color:#94a3b8">Recovery</a>
      </nav>
    </header>
    ${body}
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid rgba(148,163,184,0.2);font-size:0.8rem;color:#64748b">
      <p>A verdict is a category-level assessment based on documented sources — not an audit of your device, account, or a specific file. We never ask for passwords, 2FA codes, recovery codes, or payment details. See our <a href="/methodology">methodology</a>.</p>
    </footer>
  </body>
</html>`;
}

function generateVerdict(v) {
  const style = VERDICT_STYLE[v.verdict] || VERDICT_STYLE.cautious;
  const url = `${BASE_URL}/safety/${v.slug}`;
  const title = `Is ${v.assetName} safe? — ${style.label} | ${SITE_NAME}`;
  const description = `${style.label}: ${v.summary}`;

  const patterns = (v.scamPatterns ?? []).map((s) => `<li style="margin-bottom:0.35rem">${esc(s)}</li>`).join('');
  const protections = (v.protectionsRequired ?? []).map((s) => `<li style="margin-bottom:0.35rem">${esc(s)}</li>`).join('');
  const sources = (v.sources ?? []).map((s) => `<a href="${esc(s.url)}" style="display:inline-block;margin:0.25rem 0.5rem 0.25rem 0;font-size:0.9rem">${esc(s.label)} ↗</a>`).join('');

  const official = v.officialSource
    ? `<p style="color:#e2e8f0;margin:0"><strong style="color:#34d399">Official source:</strong> <code style="color:#e2e8f0;background:rgba(148,163,184,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem">${esc(v.officialSource)}</code></p>`
    : `<p style="color:#94a3b8;margin:0"><em>No legitimate official source — this is a third-party or scam category.</em></p>`;

  const body = `
    <article>
      <p style="color:#00F0FF;font-size:0.9rem;margin:0 0 0.5rem">Safety verdict</p>
      <h1 style="font-size:2rem;margin:0 0 0.5rem">Is ${esc(v.assetName)} safe?</h1>
      <div style="display:flex;align-items:center;gap:0.75rem;margin:0.75rem 0">
        <span class="verdict-badge" style="background:${style.color};color:#0A0A0B">${style.label}</span>
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

      <p style="margin-top:1.75rem"><a href="/tools/scam-check">Paste a link or message into the Scam Checker →</a></p>
    </article>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Is ${v.assetName} safe?`, acceptedAnswer: { '@type': 'Answer', text: `${style.label} — ${v.summary}` } },
      { '@type': 'Question', name: `What should I do if I already interacted with ${v.assetName}?`, acceptedAnswer: { '@type': 'Answer', text: v.whatToDoIfCompromised } },
    ],
  };

  return pageShell(title, description, url, body, jsonLd);
}

function generateIndex(verdicts) {
  const url = `${BASE_URL}/safety`;
  const title = `Gamer Safety Console — is it safe? | ${SITE_NAME}`;
  const description = 'Check whether a game, mod, download or message is safe — then act in minutes. Scenario triage, protection grid, recovery pathways and a 60-second checkup.';

  const triage = TRIAGE_SCENARIOS.map((s) => `
    <div class="card">
      <a href="${s.href}">
        <div style="font-size:1.5rem">${s.icon}</div>
        <h3 style="font-size:1.05rem;margin:0.5rem 0 0.35rem">${esc(s.title)}</h3>
        <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 0.6rem">${esc(s.desc)}</p>
        <span style="color:${s.tone};font-weight:600;font-size:0.9rem">${esc(s.cta)} →</span>
      </a>
    </div>`).join('');

  const grid = verdicts.map((v) => {
    const style = VERDICT_STYLE[v.verdict];
    return `
    <div class="card" style="border-left:3px solid ${style.color}">
      <a href="/safety/${esc(v.slug)}">
        <span class="verdict-badge" style="background:${style.color}22;color:${style.color};border:1px solid ${style.color}55">${style.label}</span>
        <h3 style="font-size:1rem;margin:0.5rem 0 0.35rem;font-weight:600">${esc(v.assetName)}</h3>
        <span style="color:#94a3b8;font-size:0.85rem">${riskDots(v.riskLevel)}</span>
      </a>
    </div>`;
  }).join('');

  const recovery = PLATFORMS.map((p) => `
    <div class="card">
      <a href="/recover/${esc(p.slug)}/account-stolen">
        <h3 style="font-size:1rem;margin:0 0 0.3rem;font-weight:600">${esc(p.name)} account recovery</h3>
        <p style="color:#94a3b8;font-size:0.85rem;margin:0">Official steps · ~10 minutes · free</p>
      </a>
    </div>`).join('');

  const body = `
    <article>
      <p style="color:#00F0FF;font-size:0.9rem;margin:0 0 0.5rem">Gamer Safety Console</p>
      <h1 style="font-size:2.25rem;margin:0 0 0.5rem;line-height:1.15">Check gaming safety.<br />Act in minutes.</h1>
      <p style="color:#94a3b8;max-width:65ch;margin:0">Before you download, trade, log in or recover an account, tell us what happened and we route you to the exact next step — a verdict, a recovery guide, or a checkup.</p>

      <h2 style="font-size:1.35rem;margin:2rem 0 0.75rem">What happened?</h2>
      <div class="grid">${triage}</div>

      <h2 style="font-size:1.35rem;margin:2.25rem 0 0.75rem">Protection grid</h2>
      <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 0.75rem">Evidence-based verdicts on the things gamers download, trade and log into. Tap any node for the full assessment.</p>
      <div class="grid">${grid}</div>

      <h2 style="font-size:1.35rem;margin:2.25rem 0 0.75rem">Account compromised? Recovery pathways</h2>
      <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 0.75rem">Official, free, step-by-step recovery for each platform. We never recover accounts for you or charge a fee.</p>
      <div class="grid">${recovery}</div>

      <h2 style="font-size:1.35rem;margin:2.25rem 0 0.75rem">Prevent problems</h2>
      <div class="card" style="border-color:rgba(0,240,255,0.4)">
        <a href="/tools/gaming-security-checkup">
          <h3 style="font-size:1.1rem;margin:0 0 0.35rem">🛡️ Run the 60-second security checkup</h3>
          <p style="color:#94a3b8;font-size:0.9rem;margin:0">Score your accounts against real attack patterns — 2FA, recovery codes, unique passwords, and session hygiene.</p>
        </a>
      </div>

      <h2 style="font-size:1.35rem;margin:2.25rem 0 0.75rem">How we judge</h2>
      <p style="color:#cbd5e1;max-width:65ch;margin:0">Verdicts are category-level assessments backed by documented sources, reviewed ${esc(DATA.meta?.generatedAt ?? '2026-10-20')}, and reassessed as new information emerges. We never call an unknown file "clean", never rank safety from review sentiment, and never ask for your password, 2FA codes, recovery codes, or payment details. <a href="/methodology">Read the full methodology</a>.</p>
    </article>`;

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What should I do if my gaming account may be hacked?', acceptedAnswer: { '@type': 'Answer', text: 'Start recovery immediately: secure your email first, change your password from a clean device, enable two-factor authentication, and follow the official recovery flow for your platform. Never pay a third party to recover an account.' } },
        { '@type': 'Question', name: 'How do I know if a game download or message is a scam?', acceptedAnswer: { '@type': 'Answer', text: 'Check for red flags: promises of free currency or skins, requests for your password or login code, urgency pressure, and look-alike domains. Paste the link or message into the Scam Checker for a verdict.' } },
      ],
    },
  ];

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
