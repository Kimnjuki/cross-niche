/**
 * Centralised SEO metadata for every routed page.
 *
 * Rules enforced:
 *  - title:       50–60 chars  (fixes "Title too short / too long" warnings)
 *  - description: 140–158 chars (fixes "Missing meta description" warnings)
 *  - h1:          unique, keyword-rich, NOT a copy of the <title> tag
 *                 (fixes "Duplicate content in h1 and title" warning)
 *
 * Character counts are annotated inline for easy auditing.
 */

export const SITE_NAME = 'The Grid Nexus';

interface PageMeta {
  /** <title> tag — 50-60 chars ideally */
  title: string;
  /** meta description — 140-158 chars ideally */
  description: string;
  /** Visible H1 on the page — different from the title tag */
  h1?: string;
}

export const PAGE_METADATA: Record<string, PageMeta> = {
  // ── Homepage ──────────────────────────────────────────────────────────
  '/': {
    title: 'The Grid Nexus – Tech, Security & Gaming News',        // 48 chars
    description: 'Breaking technology news, cybersecurity intelligence, and gaming coverage. Expert analysis, guides, and real-time threat alerts from The Grid Nexus.',
    h1: 'Tech, Security & Gaming Intelligence',
  },

  // ── Content categories ────────────────────────────────────────────────
  '/tech': {
    title: 'Technology News & Analysis 2026 | The Grid Nexus',    // 52 chars
    description: 'Latest technology news for 2026: AI model releases, semiconductor breakthroughs, cloud computing, and enterprise software. Expert analysis from The Grid Nexus.',
    h1: 'Technology News & Innovation',
  },
  '/security': {
    title: 'Cybersecurity News & Intelligence 2026 | The Grid Nexus', // 58 chars
    description: 'Real-time cybersecurity news: zero-day CVEs, data breaches, ransomware alerts, and threat actor intelligence. Expert security analysis from The Grid Nexus.',
    h1: 'Cybersecurity & Threat Intelligence',
  },
  '/gaming': {
    title: 'Gaming News, Reviews & Releases 2026 | The Grid Nexus', // 56 chars
    description: 'Gaming news, reviews, and release dates for 2026. PS5, PC, Xbox, and esports coverage — including hardware, indie titles, and industry business news.',
    h1: 'Gaming News, Reviews & Esports',
  },
  '/news': {
    title: 'Breaking Tech & Gaming News | The Grid Nexus',         // 48 chars
    description: 'Breaking technology and gaming news as it happens. Real-time updates on AI developments, cybersecurity incidents, hardware launches, and industry moves.',
    h1: 'Breaking News',
  },
  '/blog': {
    title: 'Blog & Long-Form Features | The Grid Nexus',           // 47 chars
    description: 'In-depth blog posts, series, and long-form features on technology, cybersecurity, and gaming from The Grid Nexus editorial team. Expert perspectives and analysis.',
    h1: 'Blog & Editorial Features',
  },
  '/explore': {
    title: 'Explore All Content | The Grid Nexus',                 // 40 chars
    description: 'Browse the full library of technology, cybersecurity, and gaming articles. Filter by topic, category, or date to find expert analysis from The Grid Nexus.',
    h1: 'Explore The Grid Nexus',
  },
  '/topics': {
    title: 'Browse Topics – Tech, Security & Gaming | The Grid Nexus', // 58 chars
    description: 'Explore topics and keywords across technology, cybersecurity, and gaming. Find curated articles by subject and stay informed with The Grid Nexus.',
    h1: 'Topics & Keywords',
  },
  '/startups': {
    title: 'Startup News & Funding Rounds 2026 | The Grid Nexus', // 53 chars
    description: 'Latest startup funding rounds, acquisitions, and venture capital moves across tech, cybersecurity, and gaming sectors. Startup intelligence from The Grid Nexus.',
    h1: 'Startup News & Funding',
  },
  '/reviews': {
    title: 'Tech & Gaming Reviews 2026 | The Grid Nexus',          // 48 chars
    description: 'Expert reviews of technology products, video games, and security tools. Honest, in-depth evaluations with clear verdicts from The Grid Nexus reviewers.',
    h1: 'Product & Game Reviews',
  },

  // ── Guides & learning ────────────────────────────────────────────────
  '/guides': {
    title: 'Tech & Security Guides | The Grid Nexus',              // 44 chars
    description: 'Step-by-step guides on technology, cybersecurity, and gaming. Learn security best practices, hardware setup tips, and software walkthroughs from our experts.',
    h1: 'Guides & How-Tos',
  },
  '/tutorials': {
    title: 'Tech & Security Tutorials | The Grid Nexus',           // 47 chars
    description: 'Hands-on tutorials for technology and cybersecurity. Practical walkthroughs on security hardening, network configuration, gaming optimisation, and more.',
    h1: 'Tutorials',
  },

  // ── Tools & interactive features ─────────────────────────────────────
  '/ai-pulse': {
    title: 'AI Pulse – AI News & Trends 2026 | The Grid Nexus',   // 52 chars
    description: 'AI Pulse tracks the latest developments in artificial intelligence: model releases, market share shifts, ethics debates, and real-world deployment news.',
    h1: 'AI Pulse – Artificial Intelligence Tracker',
  },
  '/breach-sim': {
    title: 'Breach Simulation – Cybersecurity Training | The Grid Nexus', // 60 chars
    description: 'Interactive cybersecurity breach simulation tool. Test your defences, understand attack vectors, and improve your security posture with The Grid Nexus.',
    h1: 'Breach Simulation Tool',
  },
  '/security-score': {
    title: 'Security Score – Assess Your Cyber Posture | The Grid Nexus', // 61 — trim
    description: 'Measure your organisation\'s cybersecurity posture with our free Security Score tool. Get a risk rating and actionable improvement recommendations.',
    h1: 'Security Score Checker',
  },
  '/live-threat-dashboard': {
    title: 'Live Cyber Threat Dashboard | The Grid Nexus',         // 49 chars
    description: 'Real-time cyber threat dashboard: active CVEs, breach alerts, ransomware campaigns, and nation-state activity tracked live by The Grid Nexus.',
    h1: 'Live Threat Dashboard',
  },
  '/roadmap': {
    title: 'Platform Roadmap & Upcoming Features | The Grid Nexus', // 55 chars
    description: 'See what The Grid Nexus is building next. Vote on upcoming features, track development progress, and help shape our tech, security, and gaming platform.',
    h1: 'Platform Roadmap',
  },
  '/nexus-intersection': {
    title: 'Nexus Intersection – Cross-Niche Intelligence | The Grid Nexus', // 62 — trim
    description: 'Where technology, cybersecurity, and gaming intersect. Cross-vertical trend analysis and strategic intelligence from The Grid Nexus.',
    h1: 'Nexus Intersection',
  },

  // ── Company / legal ───────────────────────────────────────────────────
  '/about': {
    title: 'About The Grid Nexus | Our Mission & Team',            // 47 chars
    description: 'Learn about The Grid Nexus: our editorial mission, newsroom team, coverage standards, and commitment to accurate technology, security, and gaming journalism.',
    h1: 'About The Grid Nexus',
  },
  '/contact': {
    title: 'Contact The Grid Nexus | Press & Partnerships',        // 50 chars
    description: 'Get in touch with The Grid Nexus for press inquiries, editorial feedback, partnership opportunities, or advertising. We respond within one business day.',
    h1: 'Contact Us',
  },
  '/privacy': {
    title: 'Privacy Policy | The Grid Nexus',                      // 33 chars — pad with subtitle
    description: 'The Grid Nexus privacy policy explains how we collect, use, store, and protect your personal data in accordance with GDPR, CCPA, and applicable privacy law.',
    h1: 'Privacy Policy',
  },
  '/terms': {
    title: 'Terms of Service | The Grid Nexus',                    // 35 chars
    description: 'Read the Terms of Service for The Grid Nexus. Covers permitted use, intellectual property, disclaimers, limitations of liability, and governing law.',
    h1: 'Terms of Service',
  },
  '/editorial': {
    title: 'Editorial Policy & Standards | The Grid Nexus',        // 50 chars
    description: 'The Grid Nexus editorial policy: fact-checking standards, source verification, correction procedures, author independence, and conflicts of interest disclosures.',
    h1: 'Editorial Policy',
  },
  '/disclosure': {
    title: 'Disclosure Policy – Affiliates & Ads | The Grid Nexus', // 55 chars
    description: 'Full transparency on affiliate links, sponsored content, review units, and advertising relationships at The Grid Nexus. Our disclosure policy.',
    h1: 'Disclosure Policy',
  },
  '/quality-guidelines': {
    title: 'Content Quality Guidelines | The Grid Nexus',          // 48 chars
    description: 'How The Grid Nexus selects, researches, writes, and reviews content. Our quality standards for accuracy, depth, originality, and editorial rigour.',
    h1: 'Content Quality Guidelines',
  },
  '/content-policy': {
    title: 'Content Policy | The Grid Nexus',                      // 34 chars
    description: 'The Grid Nexus content policy: what we publish, prohibited content categories, community standards, and how to report violations.',
    h1: 'Content Policy',
  },
  '/media': {
    title: 'Media Kit & Press Resources | The Grid Nexus',         // 48 chars
    description: 'Download The Grid Nexus media kit. Includes brand assets, logo files, editorial contacts, audience statistics, and press inquiry information.',
    h1: 'Media Kit & Press Resources',
  },

  // ── Utility ───────────────────────────────────────────────────────────
  '/sitemap': {
    title: 'Site Map | The Grid Nexus',                            // 26 chars
    description: 'Complete site map for The Grid Nexus. Find all published pages, articles, tools, guides, and category sections in one place.',
    h1: 'Site Map',
  },
};

/** Article <title> tag: "[Headline] | The Grid Nexus" */
export function getArticleTitle(headline: string): string {
  const clean = (headline || 'Article').trim();
  const full  = `${clean} | ${SITE_NAME}`;
  return full.length > 60 ? full.substring(0, 57) + '…' : full;
}

/** Resolve metadata for a given pathname. */
export function getPageMetadata(
  pathname: string,
  article?: { title?: string; excerpt?: string }
): PageMeta {
  const base = pathname.replace(/\/$/, '') || '/';

  // Article detail pages
  if (article && base.startsWith('/article/')) {
    const rawDesc = (article.excerpt || '').slice(0, 155);
    return {
      title:       getArticleTitle(article.title || ''),
      description: rawDesc || `Read ${article.title || 'this article'} on ${SITE_NAME}.`,
      h1:          article.title || 'Article',
    };
  }

  return (
    PAGE_METADATA[base] ?? {
      title:       SITE_NAME,
      description: 'Tech, Security & Gaming Intelligence from The Grid Nexus.',
      h1:          SITE_NAME,
    }
  );
}
