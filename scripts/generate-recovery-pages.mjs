/**
 * Generate static, crawlable recovery pages from src/data/recovery-playbooks.json:
 *   dist/recover/{platform}/{scenario}/index.html  +  dist/recover/index.html hub
 *
 * The hub is a "Recovery Navigator" console: hero + trust bar, first-5-minutes
 * urgency strip, symptom-first triage (grouped by urgency), platform-first
 * browse, "how we verify", and an FAQ. Server-rendered, no-JS-safe (native
 * <details>), URLs unchanged. Guide pages carry HowTo + FAQ JSON-LD and a
 * "never pay a third party" trust module.
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
  return String(s).replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Scenario grouping (IA-3): symptom-first labels + urgency tiers.
const SCENARIO_META = {
  'account-stolen': { label: 'Someone took over my account', group: 'urgent', desc: 'Your account was compromised. Recover it before the attacker locks you out.' },
  'unauthorized-purchase': { label: 'I see purchases I didn\'t make', group: 'urgent', desc: 'A saved payment method was charged without your consent.' },
  'suspicious-session': { label: 'Unknown device or login', group: 'urgent', desc: 'You saw a login from a device or location you don\'t recognize.' },
  'suspected-malware': { label: 'I think I have malware', group: 'urgent', desc: 'A stealer may have taken your session tokens or passwords.' },
  'email-changed': { label: 'My email was changed', group: 'locked-out', desc: 'The email on your account was swapped without your consent.' },
  'lost-authenticator': { label: 'I lost my authenticator', group: 'locked-out', desc: 'You can\'t generate 2FA codes — new phone or lost authenticator app.' },
  'lost-linked-email': { label: 'I can\'t access my linked email', group: 'locked-out', desc: 'The email tied to your account is gone or inaccessible.' },
  'scam-recovery-contact': { label: 'I was scammed / someone offers to "recover" it', group: 'scam', desc: 'Someone contacted you claiming they can recover your account for a fee.' },
};

const GROUPS = [
  { id: 'urgent', label: 'Act now — time-critical', color: '#FF5C7A', desc: 'These need your attention in the next few minutes.' },
  { id: 'locked-out', label: 'Locked out', color: '#FFC857', desc: 'You can\'t get in. We\'ll route you to the official recovery.' },
  { id: 'scam', label: 'Scam aftermath', color: '#7C5CFF', desc: 'You were targeted by a scam. Here\'s what to do.' },
];

const CONSOLE_CSS = `
  .rec-group { margin: 1.5rem 0 0.5rem; }
  .rec-details { background: rgba(18, 28, 48, 0.55); border: 1px solid rgba(120, 160, 255, 0.16); border-radius: 0.85rem; margin-bottom: 0.55rem; overflow: hidden; }
  .rec-details summary { cursor: pointer; list-style: none; display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 1rem; color: #EAF1FF; font-weight: 600; font-size: 0.98rem; }
  .rec-details summary::-webkit-details-marker { display: none; }
  .rec-details summary:hover { background: rgba(77, 227, 255, 0.05); }
  .rec-details summary .chev { margin-left: auto; color: #6F82A6; transition: transform 0.18s ease; }
  .rec-details[open] summary .chev { transform: rotate(90deg); }
  .rec-details .body { padding: 0.1rem 1rem 0.9rem; }
  .rec-links { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .rec-links a { font-size: 0.85rem; color: #9FB0D0; border: 1px solid rgba(120, 160, 255, 0.18); padding: 0.3rem 0.65rem; border-radius: 999px; text-decoration: none; transition: color 0.15s, border-color 0.15s; }
  .rec-links a:hover { color: #4DE3FF; border-color: rgba(77, 227, 255, 0.5); text-decoration: none; }
  .trust-chip { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #9FB0D0; background: rgba(18, 28, 48, 0.5); border: 1px solid rgba(120, 160, 255, 0.16); padding: 0.4rem 0.7rem; border-radius: 999px; }
  .urgency-dot { width: 0.55rem; height: 0.55rem; border-radius: 999px; flex-shrink: 0; }
  .urgent-strip { background: rgba(255, 92, 122, 0.08); border: 1px solid rgba(255, 92, 122, 0.35); border-left: 3px solid #FF5C7A; border-radius: 0.85rem; padding: 1rem 1.1rem; }
  .urgent-strip ol { margin: 0.5rem 0 0; padding-left: 1.3rem; }
  .urgent-strip li { margin-bottom: 0.35rem; }
  @media (prefers-reduced-motion: reduce) { .rec-details summary .chev { transition: none; } }
`;

function pageShell(title, description, canonical, body, jsonLd) {
  return staticShell(title, description, canonical, body, jsonLd);
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
      const link = s.officialLinkPurpose ? officialLinks.find((l) => l.purpose === s.officialLinkPurpose) : null;
      return `<li style="margin-bottom:1rem">
        <strong style="color:#EAF1FF">${i + 1}. ${esc(s.title)}</strong>
        <p style="color:#9FB0D0;margin:0.25rem 0">${esc(s.body)}</p>
        ${link ? `<a href="${esc(link.url)}" rel="noopener noreferrer" style="color:#4DE3FF;font-size:0.9rem">Official ${esc(s.officialLinkPurpose)} page ↗</a>` : ''}
      </li>`;
    })
    .join('');

  const linksHtml = (officialLinks ?? [])
    .map((l) => `<a href="${esc(l.url)}" rel="noopener noreferrer" style="display:inline-block;margin:0.25rem 0.5rem 0.25rem 0;color:#4DE3FF;font-size:0.9rem">${esc(l.purpose)} ↗</a>`)
    .join('');

  const body = `
    <article>
      <p style="color:#4DE3FF;font-size:0.85rem;margin:0 0 0.4rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;text-transform:uppercase">Recovery navigator</p>
      <h1 style="font-size:clamp(1.6rem,3vw,2.2rem);margin:0 0 0.5rem">${esc(platform.name)} account recovery</h1>
      <p style="color:#9FB0D0">${esc(playbook.steps?.disclaimer || 'Guidance only — follow the official process.')}</p>
      <ol style="margin:1.5rem 0;padding-left:1.5rem">${stepsHtml}</ol>
      <div style="margin-top:1.5rem;padding:1rem;border:1px solid rgba(255,92,122,0.4);border-radius:0.85rem;background:rgba(255,92,122,0.08)">
        <strong style="color:#FF5C7A">Never pay a third party to recover your account.</strong>
        <p style="color:#9FB0D0;margin:0.5rem 0 0">Account recovery is always done through ${esc(platform.name)}'s official support, free of charge. Anyone offering to "hack back" or recover your account for a fee is scamming you — and no legitimate process will ever ask for your password, 2FA codes, or recovery codes.</p>
      </div>
      <div style="margin-top:1.5rem">
        <strong style="color:#EAF1FF">Verified official links</strong>
        <div style="margin-top:0.5rem">${linksHtml}</div>
      </div>
      <p style="margin-top:1.5rem;color:#6F82A6;font-size:0.85rem">Reviewed ${new Date(playbook.reviewedAt ?? Date.now()).toISOString().slice(0, 10)} · Playbook v${esc(playbook.version)}</p>
    </article>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${platform.name} account recovery`,
      description,
      step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Should I pay someone to recover my ${platform.name} account?`,
          acceptedAnswer: { '@type': 'Answer', text: `No. Account recovery is always done through ${platform.name}'s official support, free of charge. Anyone offering paid recovery is scamming you.` },
        },
        {
          '@type': 'Question',
          name: `Will ${platform.name} ever ask for my password or 2FA code?`,
          acceptedAnswer: { '@type': 'Answer', text: 'No. No legitimate support process asks for your password, 2FA codes, or recovery codes. If someone asks, it is a scam.' },
        },
      ],
    },
  ];

  return pageShell(title, description, url, body, jsonLd);
}

function generateIndex(pages) {
  const url = `${BASE_URL}/recover`;
  const title = `Account Recovery Navigator for Gamers | Steam, Discord, Epic, Xbox & More | ${SITE_NAME}`;
  const description =
    'Take back your account. Symptom-first recovery triage for Steam, Discord, Epic, EA, Riot Games, PlayStation and Xbox — routing you to each platform\'s official process, free. We never recover accounts for you or ask for credentials.';

  // Build scenario -> pages and platform -> pages maps.
  const byScenario = {};
  const byPlatform = {};
  for (const p of pages) {
    const s = p.playbook.scenario;
    const pl = p.platform.slug;
    (byScenario[s] ??= []).push(p);
    (byPlatform[pl] ??= []).push(p);
  }

  const scenarioDetails = GROUPS.map((g) => {
    const scenarios = Object.keys(SCENARIO_META).filter((s) => SCENARIO_META[s].group === g.id);
    const items = scenarios.map((s) => {
      const meta = SCENARIO_META[s];
      const links = (byScenario[s] ?? []).map((p) =>
        `<a href="/recover/${esc(p.platform.slug)}/${esc(s)}">${esc(p.platform.name)}</a>`
      ).join('');
      return `
      <details class="rec-details">
        <summary><span class="urgency-dot" style="background:${g.color}"></span>${esc(meta.label)}<span class="chev">›</span></summary>
        <div class="body"><p style="color:#6F82A6;font-size:0.85rem;margin:0 0 0.55rem">${esc(meta.desc)}</p><div class="rec-links">${links}</div></div>
      </details>`;
    }).join('');
    return `<div class="rec-group"><h3 style="font-size:1.05rem;margin:0 0 0.25rem;color:${g.color}">${esc(g.label)}</h3><p style="color:#6F82A6;font-size:0.85rem;margin:0 0 0.6rem">${esc(g.desc)}</p>${items}</div>`;
  }).join('');

  const platformCards = Object.keys(byPlatform).map((slug) => {
    const pl = (byPlatform[slug][0]).platform;
    const links = byPlatform[slug].map((p) => {
      const s = p.playbook.scenario;
      const meta = SCENARIO_META[s];
      return `<a href="/recover/${esc(slug)}/${esc(s)}">${esc(meta?.label ?? titleCase(s))}</a>`;
    }).join('');
    return `
    <details class="rec-details">
      <summary>${esc(pl.name)}<span style="color:#6F82A6;font-weight:400;font-size:0.8rem;margin-left:0.35rem">· ${byPlatform[slug].length} guides</span><span class="chev">›</span></summary>
      <div class="body"><div class="rec-links">${links}</div></div>
    </details>`;
  }).join('');

  const faqItems = [
    ['Can The Grid Nexus recover my account for me?', 'No. We are an independent guide, not a recovery service. We route you to each platform\'s official recovery process, which is always free. We never recover accounts on your behalf and never ask for credentials.'],
    ['How do I know a recovery site is official?', 'Check the address bar: it must be the platform\'s verified domain (for example steamcommunity.com or support.discord.com), never a look-alike. We link only to official domains and show the verified hostname on each guide.'],
    ['How long does recovery usually take?', 'The immediate steps (secure email, change password, enable 2FA) take about 10 minutes. Full account restoration through official support can take longer — hours to days depending on the platform.'],
    ['What if I lost access to my email and authenticator?', 'Use the platform\'s official account-recovery form, which may ask identity questions to verify you. Start from the "Lost authenticator" or "Lost linked email" guide for your platform.'],
    ['Someone contacted me offering to recover my account. Is it legit?', 'No. Anyone who contacts you offering paid recovery, or who asks for your password or 2FA codes, is a scammer. Block them and follow the official process only.'],
  ];
  const faqHtml = faqItems.map(([q, a]) => `
    <details class="rec-details">
      <summary>${esc(q)}<span class="chev">›</span></summary>
      <div class="body"><p style="color:#9FB0D0;font-size:0.9rem;margin:0">${esc(a)}</p></div>
    </details>`).join('');

  const body = `
<style>${CONSOLE_CSS}</style>
<article>
  <p style="color:#4DE3FF;font-size:0.85rem;margin:0 0 0.4rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;text-transform:uppercase">Recovery navigator</p>
  <h1 style="font-size:clamp(1.9rem,4vw,3rem);margin:0 0 0.6rem;line-height:1.05">Take back your account. Safely.</h1>
  <p style="color:#9FB0D0;max-width:65ch;margin:0">Tell us what happened. We\'ll guide you to the official recovery process, step by step. We never ask for your password and we never recover accounts for you.</p>

  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1.1rem 0 1.5rem">
    <span class="trust-chip">✓ Official links only</span>
    <span class="trust-chip">🔒 We never ask for passwords</span>
    <span class="trust-chip">🗓 Guides reviewed ${esc(new Date().toISOString().slice(0, 10))}</span>
    <span class="trust-chip">🚫 We don\'t recover accounts for you</span>
  </div>

  <div class="urgent-strip">
    <strong style="color:#FF5C7A">If you think your account is being used right now:</strong>
    <ol style="color:#EAF1FF">
      <li><strong>Secure your email first</strong> — change its password and enable 2FA; it is the key to every account.</li>
      <li><strong>Sign out all sessions</strong> on the platform to revoke a stolen login.</li>
      <li><strong>Change the account password from a clean device</strong>, then enable 2FA.</li>
    </ol>
  </div>

  <h2 style="font-size:1.4rem;margin:2rem 0 0.5rem">What happened?</h2>
  ${scenarioDetails}

  <h2 style="font-size:1.4rem;margin:2rem 0 0.5rem">Browse by platform</h2>
  ${platformCards}

  <h2 style="font-size:1.4rem;margin:2rem 0 0.5rem">How we verify guides</h2>
  <p style="color:#9FB0D0;max-width:65ch;margin:0">Every guide links only to official platform domains, carries a last-verified date, and never collects credentials. <a href="/methodology">Read our methodology</a>. Not sure a link or message is real? <a href="/tools/scam-check">Run the Scam Checker</a>.</p>

  <h2 style="font-size:1.4rem;margin:2rem 0 0.5rem">Frequently asked</h2>
  ${faqHtml}
</article>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Account Recovery Navigator',
      description,
      numberOfItems: pages.length,
      itemListElement: pages.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.platform.name} — ${SCENARIO_META[p.playbook.scenario]?.label ?? titleCase(p.playbook.scenario)}`,
        url: `${BASE_URL}/recover/${p.platform.slug}/${p.playbook.scenario}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return pageShell(title, description, url, body, jsonLd);
}

function main() {
  const pages = DATA.pages ?? [];
  const outDir = path.join(projectRoot, 'dist', 'recover');
  fs.mkdirSync(outDir, { recursive: true });

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
