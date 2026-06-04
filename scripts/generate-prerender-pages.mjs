#!/usr/bin/env node
/**
 * generate-prerender-pages.mjs
 *
 * Build-time script that generates prerendered static HTML files for every mock article,
 * static pages, and niche landing pages. Writes to dist/ so nginx serves them directly.
 *
 * Run AFTER `vite build` as a postbuild step.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

// ── Load mock articles via simple regex-based parser ────────────
function loadArticles() {
  const mockDataPath = path.join(srcDir, 'data', 'mockData.ts');
  const content = fs.readFileSync(mockDataPath, 'utf8');

  const articles = new Map();

  // Find all article entry blocks: {...}, 
  // Strategy: find id + slug + title + content blocks between commas
  // Split on "},\n" and "},\r\n" to get individual article blobs
  const rawBlocks = content.split(/},\s*\n/);

  for (const block of rawBlocks) {
    const idMatch = block.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;

    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    const excerptMatch = block.match(/excerpt:\s*'([^']+)'/);
    const nicheMatch = block.match(/niche:\s*'([^']+)'/);
    const authorMatch = block.match(/author:\s*'([^']+)'/);
    const dateMatch = block.match(/publishedAt:\s*'([^']+)'/);
    const readTimeMatch = block.match(/readTime:\s*(\d+)/);
    const imageMatch = block.match(/imageUrl:\s*'([^']+)'/);
    const featuredMatch = /\bisFeatured:\s*true\b/.test(block);

    // Extract tags
    let tags = [];
    const tagsMatch = block.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsMatch) {
      const tagItems = tagsMatch[1].match(/'([^']+)'/g);
      if (tagItems) tags = tagItems.map(t => t.replace(/'/g, ''));
    }

    // Extract content — between backticks after `content:`
    const contentMatch = block.match(/content:\s*`((?:[^`]|\\`)*)`/s);
    if (!contentMatch) continue;

    const id = idMatch[1];
    const slug = slugMatch ? slugMatch[1] : id;
    
    // Unescape backticks
    let contentRaw = contentMatch[1];
    // Handle the case where backtick is inside the template literal (shouldn't happen)
    // But some articles may have escaped backticks
    
    articles.set(slug, {
      id,
      slug,
      title: titleMatch ? titleMatch[1] : 'Untitled',
      excerpt: excerptMatch ? excerptMatch[1] : '',
      content: contentRaw,
      niche: nicheMatch ? nicheMatch[1] : 'tech',
      author: authorMatch ? authorMatch[1] : 'Staff',
      publishedAt: dateMatch ? dateMatch[1] : '2026-01-01',
      readTime: readTimeMatch ? parseInt(readTimeMatch[1]) : 5,
      tags,
      imageUrl: imageMatch ? imageMatch[1] : '',
      isFeatured: featuredMatch,
    });
  }

  return articles;
}

// ── Generate HTML for an article page ───────────────────────────
function generateArticleHtml(article, baseHref = '/') {
  const formattedDate = formatDate(article.publishedAt);

  const tagsHtml = article.tags.map(t =>
    `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${h(t)}</span>`
  ).join(' ');

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thegridnexus.com/' },
      { '@type': 'ListItem', position: 2, name: cap(article.niche), item: `https://thegridnexus.com/${article.niche}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://thegridnexus.com/article/${article.slug}` },
    ],
  });

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Person', name: article.author },
    datePublished: article.publishedAt,
    image: article.imageUrl || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'The Grid Nexus',
      url: 'https://thegridnexus.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thegridnexus.com/article/${article.slug}`,
    },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${h(article.title)} | The Grid Nexus</title>
  <meta name="description" content="${h(article.excerpt.substring(0, 160))}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://thegridnexus.com/article/${article.slug}" />
  <meta property="og:title" content="${h(article.title)}" />
  <meta property="og:description" content="${h(article.excerpt.substring(0, 200))}" />
  <meta property="og:url" content="https://thegridnexus.com/article/${article.slug}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="The Grid Nexus" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${h(article.title)}" />
  <meta name="twitter:description" content="${h(article.excerpt.substring(0, 200))}" />
  ${article.imageUrl ? `<meta property="og:image" content="${article.imageUrl}" />` : ''}
  <script type="application/ld+json">${breadcrumbJsonLd}</script>
  <script type="application/ld+json">${articleJsonLd}</script>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1e293b;max-width:800px;margin:0 auto;padding:24px 20px;background:#f8fafc}
    h1{font-size:2.2rem;line-height:1.25;font-weight:800;margin:0 0 4px 0;letter-spacing:-0.02em}
    .byline{color:#64748b;font-size:0.9rem;margin-bottom:24px}
    .byline span{margin-right:16px}
    img{max-width:100%;height:auto;border-radius:12px;margin:24px 0}
    h2{font-size:1.5rem;margin-top:2rem;margin-bottom:0.75rem;font-weight:700;letter-spacing:-0.01em}
    h3{font-size:1.2rem;margin-top:1.5rem;font-weight:600}
    p{margin-bottom:1rem}
    ul,ol{padding-left:1.5rem;margin-bottom:1rem}
    li{margin-bottom:0.25rem}
    .tags{margin:24px 0;display:flex;gap:8px;flex-wrap:wrap}
    .disclaimer{border-top:1px solid #e2e8f0;margin-top:32px;padding-top:16px;font-size:0.8rem;color:#94a3b8;line-height:1.5}
    .nav-back{display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;color:#2563eb;text-decoration:none;font-weight:500;font-size:0.9rem}
    .nav-back:hover{opacity:0.8}
    a{color:#2563eb}
    pre{background:#f1f5f9;border-radius:8px;padding:16px;overflow-x:auto;font-size:0.9rem}
    code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.875em}
    blockquote{border-left:4px solid #2563eb;margin:1.5rem 0;padding:0.5rem 1.5rem;background:#f1f5f9;border-radius:0 8px 8px 0}
    @media(prefers-color-scheme:dark){
      body{background:#0b1120;color:#e2e8f0}
      .byline{color:#94a3b8}
      .disclaimer{border-top-color:#1e293b;color:#64748b}
      a{color:#60a5fa}
      h1{color:#f1f5f9}
      pre,code,blockquote{background:#1e293b}
    }
  </style>
</head>
<body>
  <a href="/" class="nav-back">&larr; Back to The Grid Nexus</a>
  <article itemscope itemtype="https://schema.org/Article">
    <h1 itemprop="headline">${h(article.title)}</h1>
    <div class="byline">
      <span>By <span itemprop="author">${h(article.author)}</span></span>
      <span><time datetime="${article.publishedAt}" itemprop="datePublished">${formattedDate}</time></span>
      <span>${article.readTime} min read</span>
    </div>
    ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${h(article.title)}" loading="eager" itemprop="image" />` : ''}
    <meta itemprop="description" content="${h(article.excerpt.substring(0, 200))}" />
    <div class="content" itemprop="articleBody">
      ${article.content}
    </div>
    <div class="tags">${tagsHtml}</div>
    <div class="disclaimer">
      <p><strong>This is a prerendered version of the article for search engines.</strong> 
      For the full interactive experience — AI-powered security analysis, gaming threat intelligence,
      community discussion, and interactive tools — visit the 
      <a href="/article/${article.slug}">live interactive page on The Grid Nexus</a>.</p>
    </div>
  </article>
</body>
</html>`;
}

// ── Generate HTML for static pages ──────────────────────────────
function generateStaticPageHtml({ title, slug, description, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${h(title)} | The Grid Nexus</title>
  <meta name="description" content="${h(description.substring(0, 160))}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://thegridnexus.com${slug}" />
  <meta property="og:title" content="${h(title)}" />
  <meta property="og:description" content="${h(description.substring(0, 200))}" />
  <meta property="og:url" content="https://thegridnexus.com${slug}" />
  <style>
    body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1e293b;max-width:800px;margin:0 auto;padding:24px 20px;background:#f8fafc}
    h1{font-size:2rem;font-weight:800;margin-bottom:16px;letter-spacing:-0.02em}
    h2{font-size:1.35rem;margin-top:1.5rem;font-weight:600}
    p{margin-bottom:1rem}
    a{color:#2563eb}
    .nav-back{margin-bottom:24px;color:#2563eb;text-decoration:none;font-weight:500;font-size:0.9rem}
    @media(prefers-color-scheme:dark){
      body{background:#0b1120;color:#e2e8f0}
      a{color:#60a5fa}
      h1{color:#f1f5f9}
    }
  </style>
</head>
<body>
  <a href="/" class="nav-back">&larr; Back to The Grid Nexus</a>
  <h1>${h(title)}</h1>
  <div>${content}</div>
</body>
</html>`;
}

function h(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

// ── Main ────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`dist directory not found at ${distDir}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  console.log('📄 Generating prerendered pages...\n');

  // ── Static pages ──
  const staticPages = [
    { title: 'About The Grid Nexus', slug: '/about', description: 'Your security intelligence hub for gamers — covering gaming cybersecurity, GPU vulnerabilities, account protection, and threat intelligence for the gaming community.', content: '<p>The Grid Nexus is your security intelligence hub for gamers. We cover the critical intersection of gaming and cybersecurity — from GPU driver vulnerabilities and anti-cheat bypass analysis to account protection, secure gaming setups, and real-time threat intelligence for the gaming community.</p><p>Founded in 2025, we provide actionable security insights tailored specifically for gamers, esports professionals, content creators, and gaming server operators. Our content spans gaming technology news, security advisories, gaming-specific threat reports, and practical step-by-step guides for protecting your digital gaming life.</p><h2>What We Cover</h2><ul><li><strong>Gaming Security:</strong> Account protection, two-factor authentication for gaming platforms, anti-cheat security analysis, Steam/Discord threat advisories</li><li><strong>Hardware Security:</strong> GPU driver vulnerability tracking, gaming PC security, firmware updates for gaming peripherals, secure overclocking</li><li><strong>Gaming Privacy:</strong> Data privacy on gaming platforms, streaming security, anti-doxxing guides for esports players</li><li><strong>Interactive Tools:</strong> Threat scanner, breach simulator, security score checker, PC security audit tools</li></ul><p>Our community-driven approach combines editorial expertise with user-submitted threat intelligence, creating the most comprehensive gaming security resource on the web.</p>' },
    { title: 'Contact Us', slug: '/contact', description: 'Contact the Grid Nexus team with security tips, story ideas, or feedback.', content: '<p>Have a security tip, gaming threat report, or feedback for our editorial team?</p><p>Email: <a href="mailto:contact@thegridnexus.com">contact@thegridnexus.com</a></p><p>For security disclosures: <a href="mailto:security@thegridnexus.com">security@thegridnexus.com</a></p><p>For press inquiries: <a href="mailto:press@thegridnexus.com">press@thegridnexus.com</a></p>' },
    { title: 'Privacy Policy', slug: '/privacy', description: 'Privacy Policy for The Grid Nexus — how we collect, use, and protect your data.', content: '<p><em>Last Updated: January 2026</em></p><p>We respect your privacy and are transparent about data collection. We use Google Analytics 4 for anonymized usage analysis. Non-essential cookies (analytics, advertising) are only activated after explicit consent via our Cookie Consent Manager, implementing Google Consent Mode v2.</p><p>We collect: IP address (anonymized), browser type, pages visited, and interaction data for analytics. If you subscribe to our newsletter, we store your email address. We do not sell your personal data to third parties.</p><p>EEA/UK residents have GDPR rights (access, rectification, erasure, portability). California residents have CCPA rights. Contact: <a href="mailto:privacy@thegridnexus.com">privacy@thegridnexus.com</a></p>' },
    { title: 'Terms of Service', slug: '/terms', description: 'Terms of Service for The Grid Nexus.', content: '<p><em>Last Updated: January 2026</em></p><p>By using The Grid Nexus you agree to these terms. All content is protected by copyright. You may not reproduce or redistribute our content without permission. Affiliate links may generate commissions at no cost to you, but this does not affect editorial independence.</p><p>Our interactive tools are provided for educational purposes and should supplement, not replace, professional security audits. We are not liable for damages arising from tool usage.</p><p>Contact: <a href="mailto:legal@thegridnexus.com">legal@thegridnexus.com</a></p>' },
  ];

  // ── Niche landing pages ──
  const nichePages = [
    { slug: '/tech', title: 'Gaming Technology News', description: 'Latest gaming technology news, hardware reviews, and PC gaming security coverage.', content: '<p>Stay ahead of the curve with The Grid Nexus coverage of gaming technology. From next-generation GPU architectures and CPU vulnerabilities to console hardware security analysis, we bring you the intersection of bleeding-edge tech and gaming security.</p><p>Our tech coverage includes: GPU driver vulnerability tracking, gaming hardware security audits, console exploit analysis, and performance-security tradeoff guides for competitive gamers. Explore our articles and interactive security tools to keep your rig safe.</p><p><a href="/">Return to The Grid Nexus homepage</a> for the full interactive experience.</p>' },
    { slug: '/security', title: 'Gaming Security Intelligence', description: 'Gaming security advisories, threat intelligence, and vulnerability coverage for the gaming community.', content: '<p>Your dedicated source for gaming security intelligence. We track CVEs affecting gaming hardware and software, analyze emerging threats targeting the gaming community, and provide actionable guidance to protect your accounts, hardware, and privacy.</p><p>Our security coverage includes: account takeover protection for Steam/Epic/Discord, anti-cheat security analysis, gaming VPN security reviews, phishing campaigns targeting gamers, and real-time threat monitoring through our interactive dashboard.</p><p><a href="/">Return to The Grid Nexus homepage</a> for the full interactive experience with live threat data.</p>' },
    { slug: '/gaming', title: 'Gaming & Esports Security Hub', description: 'Secure your gaming setup with esports security guides, anti-cheat analysis, and gaming privacy best practices.', content: '<p>Your comprehensive resource for gaming security. Whether you\'re a casual gamer protecting your Steam account or an esports professional safeguarding your competitive edge, we have the guides, tools, and intelligence you need.</p><p>Covered topics: esports account security, anti-cheat system vulnerabilities, streaming platform privacy, tournament security protocols, LAN event cybersecurity, and secure gaming network configurations.</p><p><a href="/">Return to The Grid Nexus homepage</a> for the full interactive experience.</p>' },
    { slug: '/tools', title: 'Gaming Security Tools', description: 'Interactive security tools for gamers — threat scanner, breach simulator, security checkup, and PC builder security audit.', content: '<p>Our suite of interactive security tools helps you assess and improve your gaming security posture. Run a threat scan on your gaming setup, simulate security breaches to test your defenses, check your account security score, and audit your gaming PC build for vulnerabilities.</p><p>All tools are free to use and designed specifically for the gaming community. No personal data leaves your browser.</p><p><a href="/">Try our tools on The Grid Nexus homepage</a>.</p>' },
    { slug: '/news', title: 'Gaming & Security News', description: 'Breaking news at the intersection of gaming and cybersecurity — updated daily.', content: '<p>Stay informed with our curated feed of gaming security news. We track: major security breaches affecting gaming platforms, new vulnerability disclosures for gaming hardware and software, regulatory changes impacting gaming privacy, and industry developments in gaming cybersecurity.</p><p>Our editorial team curates and analyzes the most important stories so you don\'t have to wade through noise.</p><p><a href="/">View the latest news on The Grid Nexus</a>.</p>' },
    { slug: '/topics', title: 'Topics & Categories', description: 'Browse gaming security content by category.', content: '<p>Explore our content organized by topic: GPU Security, Account Protection, Anti-Cheat, Gaming Privacy, Console Security, Network Security for Gamers, Esports Security, and more.</p><p><a href="/">Browse all topics on The Grid Nexus</a>.</p>' },
    { slug: '/guides', title: 'Gaming Security Guides', description: 'Step-by-step guides for securing your gaming setup, accounts, and network.', content: '<p>Practical, actionable guides for gamers who want to level up their security. From setting up two-factor authentication on every gaming platform to hardening your home network against DDoS attacks during competitive matches, our guides walk you through every step.</p><p>New guides added weekly. Each guide is tested and verified by our editorial team.</p><p><a href="/">Explore all guides on The Grid Nexus</a>.</p>' },
  ];

  // ── Write HTML files ──────────────────────────────────────
  const articles = loadArticles();
  let count = 0;
  const errors = [];

  // Article pages: /article/[slug]/index.html
  process.stdout.write('  Articles: ');
  for (const [slug, article] of articles) {
    try {
      const articleDir = path.join(distDir, 'article', slug);
      fs.mkdirSync(articleDir, { recursive: true });
      const html = generateArticleHtml(article);
      fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8');
      count++;
      process.stdout.write('.');
    } catch (err) {
      errors.push({ slug, error: err.message });
      process.stdout.write('x');
    }
  }
  process.stdout.write(` (${articles.size} total)\n`);

  // Static pages
  process.stdout.write('  Static:   ');
  for (const page of staticPages) {
    try {
      const pageDir = path.join(distDir, page.slug.replace(/^\//, ''));
      fs.mkdirSync(pageDir, { recursive: true });
      const html = generateStaticPageHtml(page);
      fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
      count++;
      process.stdout.write('.');
    } catch (err) {
      errors.push({ slug: page.slug, error: err.message });
      process.stdout.write('x');
    }
  }
  process.stdout.write(` (${staticPages.length} total)\n`);

  // Niche landing pages
  process.stdout.write('  Niches:   ');
  for (const page of nichePages) {
    try {
      const pageDir = path.join(distDir, page.slug.replace(/^\//, ''));
      fs.mkdirSync(pageDir, { recursive: true });
      const html = generateStaticPageHtml(page);
      fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
      count++;
      process.stdout.write('.');
    } catch (err) {
      errors.push({ slug: page.slug, error: err.message });
      process.stdout.write('x');
    }
  }
  process.stdout.write(` (${nichePages.length} total)\n`);

  console.log();

  if (errors.length > 0) {
    console.error(`⚠️  ${errors.length} error(s):`);
    for (const e of errors) {
      console.error(`  ❌ ${e.slug}: ${e.error}`);
    }
  }

  console.log(`✅ Generated ${count} prerendered pages (${errors.length} errors)`);
}

main();
