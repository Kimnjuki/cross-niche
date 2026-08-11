/**
 * Generate RSS/Atom feed for The Grid Nexus
 * Run with: node scripts/generate-feed.mjs
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://thegridnexus.com';

const ARTICLES = [
  {
    slug: 'ai-security-threats-2026',
    title: 'AI Security Threats 2026: Weaponized AI, Deepfakes, and Quantum Risks Targeting Gamers',
    excerpt: 'Deepfake voice clones, weaponized AI attack pipelines, and quantum-assisted decryption threats are targeting gaming accounts.',
    author: 'The Grid Nexus Editorial Team',
    publishedAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
    niche: 'security',
    tags: ['AI security', 'deepfakes', 'quantum computing', 'gaming security']
  },
  {
    slug: 'gaming-pc-security-hardening-guide-2026',
    title: 'Gaming PC Security Hardening Guide 2026: Lock Down Your Rig Without Losing FPS',
    excerpt: 'Hardened gaming rigs from Windows 11 security features to YubiKey BIOS integration and VLAN segmentation.',
    author: 'Security Team',
    publishedAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-18T14:00:00.000Z',
    niche: 'security',
    tags: ['gaming PC', 'security hardening', 'Windows 11', 'YubiKey']
  },
  {
    slug: 'steam-deck-2-specs-release-date-leaks',
    title: 'Steam Deck 2 Specs, Release Date Leaks, and Deck vs. OLED Comparison',
    excerpt: 'Leaked Steam Deck 2 specs: Zen 5 CPU, RDNA 3.5 GPU at 3.5 TFLOPS, 32GB LPDDR6X.',
    author: 'Gaming Team',
    publishedAt: '2026-01-08T08:00:00.000Z',
    updatedAt: '2026-01-08T08:00:00.000Z',
    niche: 'gaming',
    tags: ['Steam Deck', 'Valve', 'handheld gaming', 'PC gaming']
  },
  {
    slug: 'router-security-gamers-2026',
    title: 'Router Security for Gamers 2026: CVE-2025-7850, KadNap Exploits, and Zero-Trust Networking',
    excerpt: 'CVE-2025-7850 TP-Link exploit, KadNap Asus backdoor campaign, and the complete router hardening checklist for gamers.',
    author: 'Security Team',
    publishedAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-01-12T09:00:00.000Z',
    niche: 'security',
    tags: ['router security', 'CVE', 'gaming network', 'zero-trust']
  },
  {
    slug: 'microsoft-patch-tuesday-6-zero-days-february-2026',
    title: 'Microsoft Patch Tuesday: 6 Zero-Days Patched in February 2026',
    excerpt: 'Microsoft patches six actively exploited zero-day vulnerabilities in February 2026 Patch Tuesday release.',
    author: 'Security Team',
    publishedAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T08:00:00.000Z',
    niche: 'security',
    tags: ['Microsoft', 'Patch Tuesday', 'zero-day', 'CVEs']
  },
  {
    slug: 'crimson-desert-review-launch-march-2026',
    title: 'Crimson Desert Review: Launching March 2026 on PS5, Xbox, and PC',
    excerpt: 'Pearl Abyss open-world RPG Crimson Desert launches March 2026. Full review and analysis.',
    author: 'Gaming Team',
    publishedAt: '2026-02-28T08:00:00.000Z',
    updatedAt: '2026-02-28T08:00:00.000Z',
    niche: 'gaming',
    tags: ['Crimson Desert', 'Pearl Abyss', 'RPG', 'PS5', 'Xbox']
  },
  {
    slug: 'xai-gains-pentagon-access-amid-security-concerns',
    title: 'xAI Gains Pentagon Access Amid Security Concerns',
    excerpt: 'Elon Musk\'s xAI secures Pentagon access raising security concerns over classified network integration.',
    author: 'Tech Team',
    publishedAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
    niche: 'tech',
    tags: ['xAI', 'Grok', 'Pentagon', 'military AI', 'security']
  },
  {
    slug: 'apple-acquires-motionvfx-final-cut-pros-ai-powered-creative-leap',
    title: 'Apple Acquires MotionVFX: Final Cut Pro\'s AI-Powered Creative Leap',
    excerpt: 'Apple acquires MotionVFX to bring AI-powered creative tools to Final Cut Pro.',
    author: 'Tech Team',
    publishedAt: '2026-02-25T08:00:00.000Z',
    updatedAt: '2026-02-25T08:00:00.000Z',
    niche: 'tech',
    tags: ['Apple', 'MotionVFX', 'Final Cut Pro', 'AI', 'video editing']
  },
  {
    slug: 'nintendo-switch-2-security-guide',
    title: 'Nintendo Switch 2 Security Guide: Protect Your Console and Accounts',
    excerpt: 'Complete security guide for Nintendo Switch 2. Protect your console, accounts, and digital purchases.',
    author: 'Security Team',
    publishedAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-01-25T11:00:00.000Z',
    niche: 'gaming',
    tags: ['Nintendo Switch 2', 'console security', 'account protection']
  },
  {
    slug: 'best-gaming-pc-under-1000-2026',
    title: 'Best Gaming PC Under $1000 in 2026: Top Budget Builds',
    excerpt: 'Top budget gaming PC builds under $1000 for 2026. Best value components and pre-built options.',
    author: 'Gaming Team',
    publishedAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-01-12T08:00:00.000Z',
    niche: 'gaming',
    tags: ['gaming PC', 'budget gaming', 'PC builds', 'under $1000']
  }
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateAtomFeed() {
  const now = new Date().toISOString();
  const entries = ARTICLES.map(article => {
    const url = `${BASE_URL}/article/${article.slug}`;
    const categories = article.tags.map(t => `<category term="${escapeXml(t)}"/>`).join('\n    ');
    return `
  <entry>
    <title>${escapeXml(article.title)}</title>
    <link href="${url}"/>
    <updated>${article.updatedAt}</updated>
    <published>${article.publishedAt}</published>
    <author>
      <name>${escapeXml(article.author)}</name>
    </author>
    <id>${url}</id>
    <summary>${escapeXml(article.excerpt)}</summary>
    <category term="${escapeXml(article.niche)}"/>
    ${categories}
  </entry>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>The Grid Nexus – Tech, Security &amp; Gaming News</title>
  <subtitle>Breaking technology news, cybersecurity analysis, and gaming guides.</subtitle>
  <link href="${BASE_URL}/feed.xml" rel="self"/>
  <link href="${BASE_URL}"/>
  <updated>${now}</updated>
  <author>
    <name>The Grid Nexus</name>
    <email>contact@thegridnexus.com</email>
  </author>
  <id>${BASE_URL}/</id>
  <generator>The Grid Nexus Feed Generator</generator>
  <rights>Copyright 2026 The Grid Nexus. All rights reserved.</rights>
  ${entries}
</feed>`;
}

function generateRSSFeed() {
  const now = new Date().toISOString();
  const items = ARTICLES.map(article => {
    const url = `${BASE_URL}/article/${article.slug}`;
    const categories = article.tags.map(t => `<category>${escapeXml(t)}</category>`).join('\n    ');
    return `
  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    <author>${escapeXml(article.author)} (contact@thegridnexus.com)</author>
    <description>${escapeXml(article.excerpt)}</description>
    <category>${escapeXml(article.niche)}</category>
    ${categories}
  </item>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Grid Nexus – Tech, Security &amp; Gaming News</title>
    <link>${BASE_URL}</link>
    <description>Breaking technology news, cybersecurity analysis, and gaming guides.</description>
    <language>en</language>
    <copyright>Copyright 2026 The Grid Nexus</copyright>
    <managingEditor>contact@thegridnexus.com (The Grid Nexus)</managingEditor>
    <webMaster>contact@thegridnexus.com (The Grid Nexus)</webMaster>
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
    ${items}
  </channel>
</rss>`;
}

const feedDir = path.join(process.cwd(), 'public');
fs.mkdirSync(feedDir, { recursive: true });

fs.writeFileSync(path.join(feedDir, 'feed.xml'), generateAtomFeed(), 'utf-8');
fs.writeFileSync(path.join(feedDir, 'rss.xml'), generateRSSFeed(), 'utf-8');

console.log('✅ Feeds generated:');
console.log('   public/feed.xml (Atom)');
console.log('   public/rss.xml (RSS 2.0)');
