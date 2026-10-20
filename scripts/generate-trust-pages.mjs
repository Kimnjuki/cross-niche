/**
 * Generate static, crawlable trust-center pages:
 *   /privacy/tools, /editorial-standards, /corrections, /security-disclosure
 *
 * These establish the privacy/tool boundary the pivot requires (what tools
 * collect vs. inspect, evidence standards, corrections, disclosure).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { staticShell } from './lib/static-chrome.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

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
function webPage(title, description, url) {
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url };
}

const PAGES = [
  {
    route: '/privacy/tools',
    title: `Tool Privacy — what our security tools collect | ${SITE_NAME}`,
    description:
      'Plain-language disclosure of what the checkup, scam check, and IOC lookup collect, inspect, store, and never collect.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Tool privacy: what our tools collect</h1>
      <p style="color:#cbd5e1;max-width:65ch">This page describes, in plain language, exactly what each security tool does and does not collect, inspect, store, or guarantee.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Gaming Security Checkup</h2>
      <p style="color:#cbd5e1;max-width:65ch">The checkup processes <strong>self-reported answers only</strong> (your answers to yes/partial/no questions about your own habits). It does <strong>not</strong> scan your device, connect to your game accounts, or inspect your files. A score is a measure of your self-reported readiness — <strong>not</strong> a device or account audit.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Scam check / domain triage</h2>
      <p style="color:#cbd5e1;max-width:65ch">The scam check processes the domain, URL, or message <strong>you paste</strong>. Parsing happens in your browser; raw messages and full URLs are <strong>not persisted</strong> to analytics or logs. Secrets you paste are not sent to any external service.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">IOC lookup</h2>
      <p style="color:#cbd5e1;max-width:65ch">The IOC lookup sends the indicator you submit to VirusTotal's public API, which is licensed for <strong>internal, non-commercial use</strong>. Review their terms before relying on results.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What we never collect</h2>
      <ul style="color:#cbd5e1;max-width:65ch">
        <li>Game account passwords</li>
        <li>Multi-factor or recovery codes</li>
        <li>Session cookies or tokens</li>
        <li>Crypto wallet seed phrases</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Storage and retention</h2>
      <p style="color:#cbd5e1;max-width:65ch">Signed-in checkup answers are stored against your account so you can re-check your progress. Anonymous sessions expire. AI is not used to process tool inputs. To delete your data, delete your account or contact us.</p>
    </article>`,
  },
  {
    route: '/editorial-standards',
    title: `Editorial Standards | ${SITE_NAME}`,
    description:
      'How The Grid Nexus sources, labels, reviews, and corrects security guidance — evidence labels, confidence, official links only, no sentiment-derived grades.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Editorial standards</h1>
      <ul style="color:#cbd5e1;max-width:65ch;padding-left:1.25rem">
        <li style="margin-bottom:0.5rem"><strong>Official links only.</strong> We link to a platform's official support/security pages; we never invent a support URL.</li>
        <li style="margin-bottom:0.5rem"><strong>Evidence labels.</strong> Claims carry a source type (official support, vendor advisory, security research, secondary) and a confidence level (high / medium / low).</li>
        <li style="margin-bottom:0.5rem"><strong>Review dates.</strong> Official links and capability claims carry a verification date and recheck date. Stale items are marked or removed, never guessed.</li>
        <li style="margin-bottom:0.5rem"><strong>No sentiment-derived grades.</strong> Game security grades are document-based guidance, not a safety certification, and are never derived from review sentiment or community complaints.</li>
        <li style="margin-bottom:0.5rem"><strong>Unverified is labeled.</strong> Speculation, unverified reports, and watchlist items are labeled as such, never published as confirmed.</li>
        <li style="margin-bottom:0.5rem"><strong>Corrections are public.</strong> Corrections are dated and linked from affected pages.</li>
      </ul>
    </article>`,
  },
  {
    route: '/corrections',
    title: `Corrections | ${SITE_NAME}`,
    description: 'Dated corrections and updates to published guidance on The Grid Nexus.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Corrections</h1>
      <p style="color:#cbd5e1;max-width:65ch">When we correct or update published guidance, the change is recorded here with its date. No corrections have been recorded yet — this page is updated as corrections are made.</p>
    </article>`,
  },
  {
    route: '/security-disclosure',
    title: `Security Disclosure | ${SITE_NAME}`,
    description: 'How to responsibly report a security vulnerability in The Grid Nexus.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Security disclosure</h1>
      <p style="color:#cbd5e1;max-width:65ch">If you find a security issue in The Grid Nexus, report it responsibly. We investigate good-faith reports and do not pursue legal action against researchers who act in good faith and avoid harm to users.</p>
      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Scope</h2>
      <p style="color:#cbd5e1;max-width:65ch">Issues affecting the confidentiality, integrity, or availability of the site or its users' data.</p>
      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Out of scope</h2>
      <p style="color:#cbd5e1;max-width:65ch">We do not provide anti-cheat bypass, exploit, or cheat-evasion guidance — requests for these are outside this disclosure program.</p>
    </article>`,
  },
  {
    route: '/anti-cheat',
    title: `Anti-Cheat Transparency | ${SITE_NAME}`,
    description:
      'What the major anti-cheat systems (Vanguard, EAC, BattlEye, Ricochet) do on your PC, the Windows security features they require, and where to get official help.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Anti-cheat transparency</h1>
      <p style="color:#cbd5e1;max-width:68ch">Anti-cheat runs with deep system access to keep games fair. This page explains what the major systems do, what Windows security features they require, and where to get official help — without the alarm.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">The major anti-cheat systems</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li style="margin-bottom:0.75rem"><strong>Riot Vanguard</strong> (Riot Games — VALORANT, League of Legends): a kernel-level driver that loads at boot. Vanguard On-Demand is available only on devices meeting specific requirements — Windows 11 25H2, Secure Boot, TPM 2.0, VBS, HVCI and IOMMU. <a href="https://support.riotgames.com/en-us/riot/performance/vanguard-security-requirements/" style="color:#60a5fa">Official requirements ↗</a></li>
        <li style="margin-bottom:0.75rem"><strong>Easy Anti-Cheat (EAC)</strong> (Epic Games — Fortnite, Apex Legends, and many others): a kernel-level anti-cheat used across a wide range of titles. <a href="https://www.easy.ac/" style="color:#60a5fa">Official site ↗</a></li>
        <li style="margin-bottom:0.75rem"><strong>BattlEye</strong> (Rainbow Six Siege, PUBG, Escape from Tarkov, and others): a kernel-level anti-cheat. <a href="https://www.battleye.com/" style="color:#60a5fa">Official site ↗</a></li>
        <li style="margin-bottom:0.75rem"><strong>Ricochet</strong> (Activision — Call of Duty): a kernel-level driver deployed with Call of Duty titles. <a href="https://support.activision.com/" style="color:#60a5fa">Official support ↗</a></li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Windows security features, explained</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li><strong>Secure Boot</strong> — verifies that boot files are signed before they run.</li>
        <li><strong>TPM 2.0</strong> — a hardware module that stores keys and measurements.</li>
        <li><strong>VBS</strong> (Virtualization-Based Security) — isolates sensitive processes from the rest of the OS.</li>
        <li><strong>HVCI</strong> (Hypervisor-protected Code Integrity) — blocks unsigned or vulnerable drivers from loading.</li>
        <li><strong>IOMMU</strong> — isolates device memory access.</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Common issues</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li>"Vanguard not initialized" — reboot, or reinstall Vanguard from the Riot client.</li>
        <li>EAC or BattlEye launch errors — verify game files, update Windows, then reinstall the anti-cheat.</li>
        <li>Kernel-driver conflicts — check for other anti-cheat or security software loaded at the same time.</li>
      </ul>
      <p style="color:#94a3b8;max-width:68ch">Always follow the vendor's official troubleshooting and appeal process — links above.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">We do not help bypass anti-cheat</h2>
      <p style="color:#cbd5e1;max-width:68ch">The Grid Nexus publishes no bypass, exploit, or cheat-evasion guidance, and we do not recommend disabling core Windows security controls to make a game run.</p>
    </article>`,
  },
  {
    route: '/tools/download-check',
    title: `Download Check — verify a file before you run it | ${SITE_NAME}`,
    description:
      'How to verify a downloaded file before running it: official distributor, SHA-256 hash, code signature and update channel. Unknown hashes are never called clean.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Download check — verify a file before you run it</h1>
      <p style="color:#cbd5e1;max-width:68ch">Fake launchers, "cheats", mods and "free currency" tools are the most common way player accounts get stolen. Verify a download before you run it.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What to check</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li><strong>Official distributor / publisher</strong> — download only from the official site or store.</li>
        <li><strong>SHA-256 file hash</strong> — compare against the publisher's published checksum or a reviewed indicator list.</li>
        <li><strong>Code signature</strong> — verify the file is signed by the vendor you expect.</li>
        <li><strong>Update channel</strong> — update only through the official launcher, never a third-party "mirror".</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What a result means</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li style="margin-bottom:0.5rem"><strong>Known bad</strong> — matches a reviewed bad hash. Do not run it.</li>
        <li style="margin-bottom:0.5rem"><strong>No known indicators</strong> — nothing in our lists matched. This is not a guarantee of safety.</li>
        <li style="margin-bottom:0.5rem"><strong>Insufficient evidence</strong> — we cannot verify it. Assume it is untrusted until you can verify it independently.</li>
      </ul>
      <p style="color:#cbd5e1;max-width:68ch">We never label an unknown file "clean".</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">How to verify a download</h2>
      <ol style="color:#cbd5e1;max-width:68ch;padding-left:1.5rem">
        <li style="margin-bottom:0.5rem">Download only from the official site or store.</li>
        <li style="margin-bottom:0.5rem">Compute the file's SHA-256 hash (your operating system has built-in tools, or use a reputable hash utility).</li>
        <li style="margin-bottom:0.5rem">Check the hash against the publisher's published checksum, or look it up in the <a href="/tools/ioc-lookup" style="color:#60a5fa">IOC Lookup</a> (VirusTotal public API, non-commercial).</li>
        <li style="margin-bottom:0.5rem">Check the signature — on Windows, right-click the file, Properties, then Digital Signatures.</li>
      </ol>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Official update channels</h2>
      <p style="color:#cbd5e1;max-width:68ch">Update games only through the official launcher (Steam, Epic Games, Riot, Battle.net, etc.) or the vendor's own site. Avoid third-party "mirrors", "repack" sites and "free" download portals.</p>
    </article>`,
  },
  {
    route: '/report',
    title: `Report a Scam or Threat | ${SITE_NAME}`,
    description:
      'How to report a gaming scam or threat, what to include, and what happens to your report — private until reviewed, only redacted findings published.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Report a scam or threat</h1>
      <p style="color:#cbd5e1;max-width:68ch">How to report a gaming scam or threat, and what happens to your report.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What to include</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li>A text description of what happened.</li>
        <li>The platform or game involved.</li>
        <li>Any domains or links (paste them — do not click them).</li>
        <li>When it happened.</li>
      </ul>
      <p style="color:#cbd5e1;max-width:68ch">Do not include attachments, screenshots containing personal data, or any credentials, tokens or codes.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What happens to your report</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li>Reports are private until a human reviewer checks them.</li>
        <li>Only redacted, reviewed findings are published.</li>
        <li>Community votes never confirm a threat — a reviewer does.</li>
        <li>Corrections are public and dated.</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Report now</h2>
      <p style="color:#cbd5e1;max-width:68ch">Report via our <a href="/contact" style="color:#60a5fa">contact page</a>. If your account was taken over, start with the <a href="/recover" style="color:#60a5fa">recovery navigator</a> — reporting does not recover your account.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Never send</h2>
      <p style="color:#cbd5e1;max-width:68ch">Never send passwords, MFA codes, recovery codes, session cookies, or seed phrases — to us or to anyone.</p>
    </article>`,
  },
  {
    route: '/parents',
    title: `Parents' Guide to Gaming Safety | ${SITE_NAME}`,
    description:
      'Platform-by-platform parental controls for Roblox, Minecraft, Fortnite, PlayStation, Xbox, Nintendo and Discord, plus what to lock down and how to talk to your kids about scams.',
    body: `
    <article>
      <h1 style="font-size:2rem;margin:0 0 0.75rem">Parents' guide to gaming safety</h1>
      <p style="color:#cbd5e1;max-width:68ch">How to set up parental controls on the games and platforms kids actually use, and what to lock down first.</p>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">Set up parental controls</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li style="margin-bottom:0.5rem"><strong>Roblox</strong> — account restrictions, parent PIN and spending limits. <a href="https://en.help.roblox.com/hc/en-us/articles/203313120" style="color:#60a5fa">Official parental controls ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>Minecraft</strong> — multiplayer and chat controls via the Microsoft family account. <a href="https://www.minecraft.net/en-us/article/parents-guide" style="color:#60a5fa">Official parents' guide ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>Fortnite (Epic Games)</strong> — Epic account parental controls for purchases and communication. <a href="https://www.epicgames.com/site/en-US/parental-controls" style="color:#60a5fa">Official parental controls ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>PlayStation</strong> — family management, spending limits and age ratings. <a href="https://www.playstation.com/support/account/parental-controls/" style="color:#60a5fa">Official parental controls ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>Xbox</strong> — Microsoft family settings for screen time, purchases and content. <a href="https://www.xbox.com/family-hub" style="color:#60a5fa">Official family hub ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>Nintendo Switch</strong> — the Nintendo Switch Parental Controls app. <a href="https://www.nintendo.com/us/switch/parental-controls/" style="color:#60a5fa">Official parental controls ↗</a></li>
        <li style="margin-bottom:0.5rem"><strong>Discord</strong> — Family Center and privacy settings. <a href="https://discord.com/safety" style="color:#60a5fa">Official safety center ↗</a></li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What to lock down first</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li>Purchase limits and payment PINs — stop surprise charges.</li>
        <li>Chat and friend-request restrictions — most scams arrive as a message.</li>
        <li>Screen-time limits.</li>
        <li>Two-factor authentication on your own parent account, not just the child's.</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">What to teach your kids</h2>
      <ul style="color:#cbd5e1;max-width:68ch;padding-left:1.25rem">
        <li>"Free V-Bucks, Robux or skins" is always a scam.</li>
        <li>Never share passwords — not even with online friends.</li>
        <li>Don't click links in chat or Discord messages.</li>
        <li>If something feels wrong, tell a parent — no account is worth hiding.</li>
      </ul>

      <h2 style="font-size:1.2rem;margin:1.5rem 0 0.5rem">If an account is already compromised</h2>
      <p style="color:#cbd5e1;max-width:68ch">Start with the <a href="/recover" style="color:#60a5fa">account recovery navigator</a> — it routes you to each platform's official recovery process, and never asks for credentials.</p>
    </article>`,
  },
];

function main() {
  const outDir = path.join(projectRoot, 'dist');
  const urls = [];
  for (const p of PAGES) {
    const dir = path.join(outDir, ...p.route.split('/').filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    const url = `${BASE_URL}${p.route}`;
    fs.writeFileSync(path.join(dir, 'index.html'), pageShell(p.title, p.description, url, p.body, webPage(p.title, p.description, url)), 'utf-8');
    urls.push(url);
  }

  fs.writeFileSync(path.join(outDir, 'trust-pages.json'), JSON.stringify(urls, null, 2), 'utf-8');
  console.log(`Generated ${PAGES.length} trust-center pages.`);
  console.log(urls.join('\n'));
}

main();
