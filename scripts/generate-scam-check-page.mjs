/**
 * Generate a standalone, crawlable Scam Check page that works without the React SPA.
 *
 * Outputs:
 *   dist/tools/scam-check/index.html  — form + official-domain table + trust block
 *   dist/tools/scam-check/triage.js   — vanilla progressive-enhancement island
 *
 * The form uses GET (?q=&kind=&platform=). Without JS, users still get the full
 * guidance, official domain list, and manual-check instructions. With JS, the
 * island reads the query string and renders an explicit blueprint verdict
 * (never "safe"). No arbitrary URL fetch; no raw input persistence.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { staticShell, esc, BASE_URL, SITE_NAME } from './lib/static-chrome.mjs';
import { trustBoundariesHtml } from './lib/trust-boundaries.mjs';
import {
  triageInput,
  VERDICT_COPY,
  normalizeHostname,
} from './lib/scam-triage.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const outDir = path.join(distDir, 'tools', 'scam-check');

const platformData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'platform-security.json'), 'utf8')
);

const OFFICIAL = (platformData.platforms || []).flatMap((p) =>
  (p.officialDomains || []).map((d) => ({ host: d, label: p.name }))
).concat([
  { host: 'nexusmods.com', label: 'Nexus Mods' },
  { host: 'curseforge.com', label: 'CurseForge' },
  { host: 'steampowered.com', label: 'Steam' },
]);

/** Reviewed known-bad hosts. Empty until human-verified indicators ship. */
const KNOWN_BAD = [];

const CONTEXTS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'domain', label: 'Domain / URL only' },
  { value: 'message', label: 'Message / giveaway text' },
];

const PLATFORMS = [
  { value: '', label: 'Any / unknown' },
  ...(platformData.platforms || []).map((p) => ({ value: p.slug, label: p.name })),
];

function resultHtmlFromTriage(payload) {
  const r = payload.result;
  const verdict = r.verdict || 'insufficient_evidence';
  const copy = VERDICT_COPY[verdict] || VERDICT_COPY.insufficient_evidence;
  const flags = r.reasons || r.redFlags || [];
  const actions = r.recommendedActions || [];
  const showRecover =
    verdict === 'known_malicious' ||
    verdict === 'suspicious' ||
    r.blockSubmission;

  const flagsHtml = flags.length
    ? `<div style="margin-top:1rem"><strong style="color:#f8fafc">Why</strong><ul style="margin:0.4rem 0 0;padding-left:1.2rem;color:#94a3b8">${flags
        .map((f) => `<li>${esc(f)}</li>`)
        .join('')}</ul></div>`
    : '';

  const actionsHtml = actions.length
    ? `<div style="margin-top:1rem"><strong style="color:#f8fafc">What to do</strong><ul style="margin:0.4rem 0 0;padding-left:1.2rem;color:#94a3b8">${actions
        .map((a) => `<li>${esc(a)}</li>`)
        .join('')}</ul></div>`
    : '';

  const categoryHtml = r.matchedCategory
    ? `<p style="margin-top:1rem;color:#94a3b8">Related safety verdict: <a href="/safety/${esc(r.matchedCategory)}">${esc(r.matchedCategory)}</a></p>`
    : '';

  const recoverHtml = showRecover
    ? `<p style="margin-top:1rem"><a href="/recover" style="display:inline-block;padding:0.55rem 1rem;border-radius:0.5rem;background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.45);color:#fecaca;text-decoration:none">My account may be compromised → Recovery Navigator</a></p>`
    : '';

  const hostNote = r.normalizedHost
    ? `<p style="margin:0.35rem 0 0;font-size:0.85rem;color:#64748b;font-family:'JetBrains Mono',monospace">host: ${esc(r.normalizedHost)}</p>`
    : '';

  const secretNote = r.blockSubmission
    ? `<p style="margin-top:0.75rem;padding:0.65rem 0.85rem;border-radius:0.5rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);color:#fde68a;font-size:0.9rem"><strong>Do not enter your password or MFA code</strong> on any linked page. This input looks secret-bearing and was not sent to any external provider.</p>`
    : '';

  return `
    <section id="scam-result" aria-live="polite" style="margin-top:1.5rem;padding:1.15rem;border-radius:0.75rem;border:1px solid rgba(148,163,184,0.35);background:rgba(15,23,42,0.65)">
      <p style="margin:0;font-size:0.8rem;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;font-family:'JetBrains Mono',monospace">Verdict</p>
      <p style="margin:0.35rem 0 0;font-size:1.35rem;font-weight:700;color:${copy.tone}">${esc(copy.label)}</p>
      <p style="margin:0.25rem 0 0;color:#e2e8f0">${esc(copy.headline)}</p>
      ${hostNote}
      ${secretNote}
      ${flagsHtml}
      ${categoryHtml}
      ${actionsHtml}
      ${recoverHtml}
      <p style="margin:1rem 0 0;font-size:0.85rem;color:#64748b">This does <strong style="color:#94a3b8">not</strong> prove a site is safe. External reputation lookup is disabled until licensed (<code style="color:#94a3b8">provider_unavailable</code>).</p>
    </section>`;
}

function officialTableHtml() {
  const rows = OFFICIAL.map(
    (o) =>
      `<tr><td style="padding:0.4rem 0.6rem;border-bottom:1px solid rgba(148,163,184,0.15);font-family:'JetBrains Mono',monospace;font-size:0.85rem">${esc(o.host)}</td><td style="padding:0.4rem 0.6rem;border-bottom:1px solid rgba(148,163,184,0.15)">${esc(o.label)}</td></tr>`
  ).join('');
  return `
    <section aria-labelledby="official-domains-heading" style="margin-top:2rem">
      <h2 id="official-domains-heading" style="font-size:1.25rem;margin:0 0 0.5rem">Official domains (exact match)</h2>
      <p style="color:#94a3b8;max-width:65ch;margin:0 0 0.75rem">Without JavaScript, compare the hostname you were given against this allowlist. Homographs, look-alikes, and extra subdomains that are not real subdomains of these hosts are not official.</p>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;text-align:left;color:#cbd5e1">
          <thead><tr><th style="padding:0.4rem 0.6rem;border-bottom:1px solid rgba(148,163,184,0.35)">Host</th><th style="padding:0.4rem 0.6rem;border-bottom:1px solid rgba(148,163,184,0.35)">Platform</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>`;
}

function buildBody(prefill = {}) {
  const q = prefill.q || '';
  const kind = prefill.kind || 'auto';
  const platform = prefill.platform || '';

  let resultBlock = `
    <div id="scam-result-slot">
      <noscript>
        <section style="margin-top:1.5rem;padding:1rem;border:1px dashed rgba(148,163,184,0.4);border-radius:0.75rem;color:#94a3b8">
          <p style="margin:0"><strong style="color:#e2e8f0">JavaScript is off.</strong> Use the official-domain table below to compare hosts manually. Never treat an unknown domain as safe. If you already entered credentials, go to the <a href="/recover">Recovery Navigator</a>.</p>
        </section>
      </noscript>
    </div>`;

  // Build-time sample results for documented examples (optional empty by default).
  // Query-string results are rendered by triage.js in the browser; static hosts
  // cannot mutate HTML per request without an edge worker.
  if (q && typeof process !== 'undefined' && process.env.SCAM_CHECK_SSR_EVAL === '1') {
    const payload = triageInput(q, OFFICIAL, KNOWN_BAD, kind);
    resultBlock = `<div id="scam-result-slot">${resultHtmlFromTriage(payload)}</div>`;
  }

  const contextOpts = CONTEXTS.map(
    (c) =>
      `<option value="${esc(c.value)}"${c.value === kind ? ' selected' : ''}>${esc(c.label)}</option>`
  ).join('');
  const platformOpts = PLATFORMS.map(
    (p) =>
      `<option value="${esc(p.value)}"${p.value === platform ? ' selected' : ''}>${esc(p.label)}</option>`
  ).join('');

  return `
    <article>
      <p style="color:#00F0FF;font-size:0.85rem;margin:0 0 0.4rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;text-transform:uppercase">Free player-security tool</p>
      <h1 style="font-size:clamp(1.8rem,3vw,2.4rem);margin:0 0 0.5rem">Scam Checker</h1>
      <p style="color:#94a3b8;max-width:65ch;margin:0">Triage a gaming domain, URL, or pasted message. Parsing is local. We never label an unknown domain “safe.” Raw messages and full URLs are not stored in analytics.</p>

      <form id="scam-check-form" method="get" action="/tools/scam-check" style="margin-top:1.5rem;display:grid;gap:0.85rem;max-width:40rem">
        <label style="display:grid;gap:0.35rem">
          <span style="font-size:0.9rem;color:#e2e8f0">Domain, URL, or message</span>
          <textarea name="q" id="scam-q" rows="4" maxlength="2000" required placeholder="e.g. steamcommunity.com or a Discord giveaway message" style="width:100%;padding:0.75rem 0.9rem;border-radius:0.55rem;border:1px solid rgba(148,163,184,0.35);background:#0f172a;color:#f8fafc;font:inherit">${esc(q)}</textarea>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <label style="display:grid;gap:0.35rem">
            <span style="font-size:0.9rem;color:#e2e8f0">Input type</span>
            <select name="kind" id="scam-kind" style="padding:0.55rem 0.7rem;border-radius:0.5rem;border:1px solid rgba(148,163,184,0.35);background:#0f172a;color:#f8fafc">${contextOpts}</select>
          </label>
          <label style="display:grid;gap:0.35rem">
            <span style="font-size:0.9rem;color:#e2e8f0">Gaming context</span>
            <select name="platform" id="scam-platform" style="padding:0.55rem 0.7rem;border-radius:0.5rem;border:1px solid rgba(148,163,184,0.35);background:#0f172a;color:#f8fafc">${platformOpts}</select>
          </label>
        </div>
        <p style="margin:0;font-size:0.85rem;color:#fde68a">Do not paste password-reset links, invite tokens, session URLs, or MFA codes. Secret-bearing inputs are blocked from external submission.</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.65rem">
          <button type="submit" style="padding:0.65rem 1.15rem;border-radius:0.5rem;border:0;background:#00F0FF;color:#0A0A0B;font-weight:600;cursor:pointer">Check it</button>
          <a href="/tools/scam-check" style="padding:0.65rem 1rem;border-radius:0.5rem;border:1px solid rgba(148,163,184,0.35);color:#94a3b8;text-decoration:none">Clear</a>
        </div>
      </form>

      ${resultBlock}

      ${trustBoundariesHtml({ compact: true })}

      ${officialTableHtml()}

      <section aria-labelledby="scam-patterns-heading" style="margin-top:2rem">
        <h2 id="scam-patterns-heading" style="font-size:1.25rem;margin:0 0 0.5rem">Message patterns we flag</h2>
        <ul style="color:#94a3b8;max-width:65ch;padding-left:1.2rem;margin:0">
          <li>Free skins, V-Bucks, Nitro, Robux, or gift cards</li>
          <li>QR “verify your account” or login prompts</li>
          <li>Requests for passwords, Steam Guard, or 2FA codes</li>
          <li>Paid “recovery agents” and hack-back offers</li>
          <li>Cheat / aimbot / boosting / account-selling pitches</li>
          <li>Urgency and scarcity pressure</li>
        </ul>
      </section>

      <section aria-labelledby="next-heading" style="margin-top:2rem">
        <h2 id="next-heading" style="font-size:1.25rem;margin:0 0 0.5rem">Next steps</h2>
        <ul style="color:#94a3b8;padding-left:1.2rem;margin:0">
          <li><a href="/recover">Account Recovery Navigator</a> — official steps only</li>
          <li><a href="/platforms">Platform Security Hubs</a></li>
          <li><a href="/privacy/tools">Tool privacy</a> — what is local vs stored</li>
          <li><a href="/methodology">Methodology</a> — verdict meanings and limits</li>
        </ul>
      </section>
    </article>
    <script type="module" src="/tools/scam-check/triage.js"></script>`;
}

function buildTriageJs() {
  // Self-contained browser island — inlined data + logic (no build step).
  const officialJson = JSON.stringify(OFFICIAL);
  const knownBadJson = JSON.stringify(KNOWN_BAD);
  return `/* Progressive enhancement for /tools/scam-check — no React required. */
const OFFICIAL = ${officialJson};
const KNOWN_BAD = ${knownBadJson};
const TOKEN_PARAM_RE = /[?&#](?:token|access_token|reset_token|password_reset|invite|invite_code|code|ticket|login_ticket|session|session_id|auth|sig|signature|x-amz-signature|expires|key)=/i;
const MESSAGE_RULES = [
  { category: 'free-skin-generators', flag: 'Promises free in-game currency, skins, or subscriptions.', re: /\\b(free|unlimited|unlock)\\b[^.\\n]{0,40}\\b(skins?|nitro|v-?bucks|riot points|rp|robux|gems?|coins?|gift cards?|keys?)\\b/i },
  { category: 'free-gift-card-sites', flag: "Offers a free gift card or reward in exchange for a survey or 'verification'.", re: /\\b(free|claim)\\b[^.\\n]{0,40}\\b(gift ?cards?|steam ?cards?|psn ?codes?|xbox ?codes?)\\b/i },
  { category: 'discord-verify-qr-scams', flag: "Asks you to scan a QR code or log in to 'verify' your account.", re: /\\b(scan|qr ?code|verify (your )?(account|identity|age|human))\\b/i },
  { category: 'steam-account-phishing', flag: 'Asks for your password, login, or Steam Guard / 2FA code.', re: /\\b(password|login|sign ?in|credentials|steam ?guard|2fa code|two-?factor code|auth code)\\b/i },
  { category: 'fake-support-recovery', flag: "Offers paid account recovery or 'hack-back' services.", re: /\\b(recover|recovery|unban|unlock|hack back|get (your )?account back)\\b[^.\\n]{0,40}\\b(for a fee|paid|pay|purchase)\\b|\\b(i can|we can|guaranteed)\\b[^.\\n]{0,40}\\b(recover|unban)\\b/i },
  { category: 'free-game-cheats-aimbot', flag: "Promotes cheats, aimbots, or 'undetected' hacks.", re: /\\b(aimbot|wallhack|esp hack|undetected cheat|free cheat|game hack|trainer)\\b/i },
  { category: 'game-boosting-services', flag: 'Offers account boosting, piloting, or rank-up services.', re: /\\b(boosting|booster|pilot(ing)?|rank up|elo boost|climb)\\b/i },
  { category: 'account-sellers', flag: 'Offers to buy or sell game accounts.', re: /\\b(buy(ing)?|sell(ing)?|for sale)\\b[^.\\n]{0,30}\\b(accounts?|skins?|inventor(y|ies))\\b|\\b(accounts?|skins?)\\b[^.\\n]{0,20}\\b(for sale|cheap|available)\\b/i },
  { category: null, flag: 'Uses urgency or scarcity pressure to rush a decision.', re: /\\b(act now|limited time|expires?|last chance|hurry|only today|24 ?hours|ends soon|don'?t miss)\\b/i },
];
const VERDICT_COPY = {
  known_malicious: { label: 'known_malicious', headline: 'Known malicious indicator', tone: '#f87171' },
  suspicious: { label: 'suspicious', headline: 'Suspicious patterns detected', tone: '#fbbf24' },
  no_known_indicators: { label: 'no_known_indicators', headline: 'No known indicators (not a safety clearance)', tone: '#34d399' },
  insufficient_evidence: { label: 'insufficient_evidence', headline: 'Insufficient evidence — do not treat as safe', tone: '#94a3b8' },
  provider_unavailable: { label: 'provider_unavailable', headline: 'External reputation lookup unavailable', tone: '#94a3b8' },
};
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function normalizeHostname(input){const s=String(input??'').trim();if(!s)return null;try{const u=new URL(/^[a-z][a-z0-9+.-]*:\\/\\//i.test(s)?s:\`http://\${s}\`);return u.hostname.toLowerCase()||null;}catch{return null;}}
function detectHomograph(input){return /[^\\x00-\\x7F]/.test(String(input??''));}
function detectSecretToken(input){return TOKEN_PARAM_RE.test(String(input??''));}
function isOfficialHost(host, officialHost){return host===officialHost||host.endsWith('.'+officialHost);}
function extractUrl(input){const m=String(input??'').match(/https?:\\/\\/[^\\s"']+|[a-z0-9][a-z0-9.-]*\\.[a-z]{2,}(?:\\/[^\\s"']*)?/i);return m?m[0]:null;}
function triageDomain(input){
  const reasons=[]; const actions=[]; const hasSecretToken=detectSecretToken(input); const blockSubmission=hasSecretToken; const host=normalizeHostname(input);
  if(!host) return {verdict:'insufficient_evidence',reasons:['Could not parse a hostname from the input.'],normalizedHost:null,matchedOfficial:null,matchedBad:null,hasSecretToken,blockSubmission,recommendedActions:['Paste the domain only (e.g. steamcommunity.com), without a full login or reset link.']};
  if(detectHomograph(input)) reasons.push('The domain uses non-ASCII characters — a common look-alike (homograph) spoof.');
  const bad=KNOWN_BAD.find(b=>isOfficialHost(host,b.host));
  if(bad) return {verdict:'known_malicious',reasons:[...reasons,\`Matches a known-bad indicator: \${bad.label}.\`],normalizedHost:host,matchedOfficial:null,matchedBad:bad.label,hasSecretToken,blockSubmission,recommendedActions:['Do not enter credentials, download anything, or approve requests.','Report it and warn anyone else who may have received the same link.','If you already interacted with it, open the Recovery Navigator.']};
  const official=OFFICIAL.find(o=>isOfficialHost(host,o.host));
  if(official) return {verdict:'no_known_indicators',reasons:[...reasons,\`This is (or is a subdomain of) the official \${official.label} domain.\`,...(hasSecretToken?['This link carries a token or one-time code — treat it as private.']:[])],normalizedHost:host,matchedOfficial:official.label,matchedBad:null,hasSecretToken,blockSubmission,recommendedActions:[...(hasSecretToken?['Do not paste this link anywhere; it may grant access to your account.']:[]),'Confirm you reached it directly (typed/known bookmark), not via a link in a message.']};
  if(hasSecretToken){reasons.push('This link carries a token or one-time code — treat it as private and do not share it.');actions.push('Do not paste this link anywhere; it may grant access to your account.');}
  return {verdict:'insufficient_evidence',reasons:[...reasons,'Domain is not on the official or known-bad list — no conclusion can be drawn.'],normalizedHost:host,matchedOfficial:null,matchedBad:null,hasSecretToken,blockSubmission,recommendedActions:[...actions,'If you were directed here by a message or giveaway, verify through an official channel first.','Absence of known indicators is not proof this domain is safe.']};
}
function triageMessage(input){
  const text=String(input??'').trim(); const redFlags=[]; let matchedCategory=null;
  for(const rule of MESSAGE_RULES){ if(rule.re.test(text)){ redFlags.push(rule.flag); if(!matchedCategory&&rule.category) matchedCategory=rule.category; } }
  if(redFlags.length===0) return {verdict:'no_known_indicators',redFlags:[],recommendedActions:['No obvious scam patterns detected — but absence of red flags is not proof something is safe.','Verify through an official channel before logging in, downloading, or sending anything.','If it arrived as an unsolicited message, treat it with suspicion regardless.'],matchedCategory:null};
  return {verdict:'suspicious',redFlags,recommendedActions:['Do not click links, enter credentials, download anything, or approve requests.','Do not send money, gift cards, or 2FA codes to anyone.','Verify through an official channel, and warn others who received the same message.','If you already shared credentials or codes, open the Recovery Navigator.'],matchedCategory};
}
function triageInput(raw, kindHint='auto'){
  const text=String(raw??'').trim();
  if(!text) return {result:{verdict:'insufficient_evidence',reasons:['No input provided.'],recommendedActions:['Paste a domain, URL, or message to check.'],redFlags:[],matchedCategory:null,blockSubmission:false,normalizedHost:null}};
  const singleToken=!/\\s/.test(text);
  const looksDomain=/^[a-z0-9][a-z0-9.-]*\\.[a-z]{2,}(?:\\/\\S*)?$/i.test(text)||Boolean(extractUrl(text));
  const asDomain=kindHint==='domain'||(kindHint==='auto'&&singleToken&&looksDomain);
  if(asDomain) return {result:triageDomain(text)};
  const msg=triageMessage(text); const url=extractUrl(text);
  if(url){ const embedded=triageDomain(url); if(msg.verdict==='no_known_indicators'&&(embedded.verdict==='known_malicious'||embedded.blockSubmission)) return {result:embedded}; }
  return {result:{...msg,reasons:msg.redFlags,blockSubmission:false,normalizedHost:null}};
}
function renderResult(payload){
  const r=payload.result; const verdict=r.verdict||'insufficient_evidence'; const copy=VERDICT_COPY[verdict]||VERDICT_COPY.insufficient_evidence;
  const flags=r.reasons||r.redFlags||[]; const actions=r.recommendedActions||[];
  const showRecover=verdict==='known_malicious'||verdict==='suspicious'||r.blockSubmission;
  const flagsHtml=flags.length?\`<div style="margin-top:1rem"><strong style="color:#f8fafc">Why</strong><ul style="margin:0.4rem 0 0;padding-left:1.2rem;color:#94a3b8">\${flags.map(f=>\`<li>\${esc(f)}</li>\`).join('')}</ul></div>\`:'';
  const actionsHtml=actions.length?\`<div style="margin-top:1rem"><strong style="color:#f8fafc">What to do</strong><ul style="margin:0.4rem 0 0;padding-left:1.2rem;color:#94a3b8">\${actions.map(a=>\`<li>\${esc(a)}</li>\`).join('')}</ul></div>\`:'';
  const categoryHtml=r.matchedCategory?\`<p style="margin-top:1rem;color:#94a3b8">Related safety verdict: <a href="/safety/\${esc(r.matchedCategory)}">\${esc(r.matchedCategory)}</a></p>\`:'';
  const recoverHtml=showRecover?\`<p style="margin-top:1rem"><a href="/recover" style="display:inline-block;padding:0.55rem 1rem;border-radius:0.5rem;background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.45);color:#fecaca;text-decoration:none">My account may be compromised → Recovery Navigator</a></p>\`:'';
  const hostNote=r.normalizedHost?\`<p style="margin:0.35rem 0 0;font-size:0.85rem;color:#64748b;font-family:monospace">host: \${esc(r.normalizedHost)}</p>\`:'';
  const secretNote=r.blockSubmission?\`<p style="margin-top:0.75rem;padding:0.65rem 0.85rem;border-radius:0.5rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);color:#fde68a;font-size:0.9rem"><strong>Do not enter your password or MFA code</strong> on any linked page. This input looks secret-bearing and was not sent to any external provider.</p>\`:'';
  return \`<section id="scam-result" aria-live="polite" style="margin-top:1.5rem;padding:1.15rem;border-radius:0.75rem;border:1px solid rgba(148,163,184,0.35);background:rgba(15,23,42,0.65)"><p style="margin:0;font-size:0.8rem;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;font-family:monospace">Verdict</p><p style="margin:0.35rem 0 0;font-size:1.35rem;font-weight:700;color:\${copy.tone}">\${esc(copy.label)}</p><p style="margin:0.25rem 0 0;color:#e2e8f0">\${esc(copy.headline)}</p>\${hostNote}\${secretNote}\${flagsHtml}\${categoryHtml}\${actionsHtml}\${recoverHtml}<p style="margin:1rem 0 0;font-size:0.85rem;color:#64748b">This does <strong style="color:#94a3b8">not</strong> prove a site is safe. External reputation lookup is disabled until licensed (<code style="color:#94a3b8">provider_unavailable</code>).</p></section>\`;
}
function run(){
  const params=new URLSearchParams(location.search);
  const q=(params.get('q')||'').trim();
  const kind=params.get('kind')||'auto';
  const slot=document.getElementById('scam-result-slot');
  const form=document.getElementById('scam-check-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      // Keep GET navigation for shareable results; also render immediately.
      const fd=new FormData(form);
      const value=String(fd.get('q')||'').trim();
      if(!value||!slot) return;
      e.preventDefault();
      const k=String(fd.get('kind')||'auto');
      const url=new URL(location.href);
      url.searchParams.set('q', value.slice(0,2000));
      url.searchParams.set('kind', k);
      const platform=String(fd.get('platform')||'');
      if(platform) url.searchParams.set('platform', platform); else url.searchParams.delete('platform');
      history.replaceState(null,'',url);
      slot.innerHTML=renderResult(triageInput(value,k));
      // Never log the raw input.
    });
  }
  if(q&&slot){ slot.innerHTML=renderResult(triageInput(q,kind)); }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', run); else run();
`;
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ missing — run vite build first, or mkdir for local preview.');
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  const title = `Scam Checker — gaming link & message triage | ${SITE_NAME}`;
  const description =
    'Paste a game link, Discord invite, or message. Get an explicit verdict: known_malicious, suspicious, no_known_indicators, or insufficient_evidence — never “safe.” Runs locally; nothing stored.';
  const canonical = `${BASE_URL}/tools/scam-check`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Scam Checker',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Any',
    url: canonical,
    description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
  };

  const html = staticShell(title, description, canonical, buildBody(), jsonLd, '/tools/scam-check');
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(outDir, 'triage.js'), buildTriageJs(), 'utf8');

  // Sanity: official domain resolves; unknown does not say safe.
  const ok = triageInput('store.steampowered.com', OFFICIAL, KNOWN_BAD, 'domain');
  const unk = triageInput('totally-unknown-giveaway.example', OFFICIAL, KNOWN_BAD, 'domain');
  if (ok.result.verdict !== 'no_known_indicators') throw new Error('steam official check failed');
  if (unk.result.verdict !== 'insufficient_evidence') throw new Error('unknown must be insufficient_evidence');
  if (normalizeHostname('https://evil.com') !== 'evil.com') throw new Error('normalize failed');

  console.log(`Generated ${canonical}`);
  console.log(`Official domains loaded: ${OFFICIAL.length}; known-bad: ${KNOWN_BAD.length}`);
}

main();
