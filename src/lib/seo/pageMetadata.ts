/**
 * Centralized SEO metadata for all pages.
 * Fixes ISSUE-001 (duplicate titles), ISSUE-005 (meta descriptions), ISSUE-010 (H1).
 */

export const SITE_NAME = 'The Grid Nexus';

export const PAGE_METADATA: Record<string, { title: string; description: string; h1?: string }> = {
  '/': {
    title: 'The Grid Nexus – Tech, Security & Gaming News',
    description: 'The Grid Nexus covers the latest in tech, cybersecurity, and gaming. Get breaking news, in-depth analysis, tutorials, and tools all in one place.',
    h1: 'The Grid Nexus – Tech, Security & Gaming News',
  },
  '/guides': {
    title: 'Tech & Gaming Guides | The Grid Nexus',
    description: 'Step-by-step tech and gaming guides. Learn security best practices, gaming tips, and technology tutorials from The Grid Nexus experts.',
    h1: 'Tech & Gaming Guides',
  },
  '/explore': {
    title: 'Explore Tech, Security & Gaming Content | The Grid Nexus',
    description: 'Browse and explore technology, cybersecurity, and gaming articles. Find the latest news, guides, and analysis across all categories.',
    h1: 'Explore Content',
  },
  '/roadmap': {
    title: 'Platform Roadmap & Upcoming Features | The Grid Nexus',
    description: 'See what we\'re building next. Vote on features and track our product roadmap for tech, security, and gaming tools.',
    h1: 'Platform Roadmap',
  },
  '/topics': {
    title: 'Browse Topics – Tech, Security & Gaming | The Grid Nexus',
    description: 'Browse topics and keywords across technology, cybersecurity, and gaming. Find articles by topic and stay informed.',
    h1: 'Topics & Keywords',
  },
  '/security': {
    title: 'Cybersecurity News & Threat Intelligence 2026 | The Grid Nexus',
    description: 'Stay ahead of cyber threats with the latest cybersecurity news, breach analyses, threat intelligence, and expert commentary from The Grid Nexus.',
    h1: 'Cybersecurity News & Analysis',
  },
  '/news': {
    title: 'Latest Tech & Gaming News | The Grid Nexus',
    description: 'Breaking technology and gaming news. Real-time updates on AI, security, hardware, and industry developments.',
    h1: 'Latest News',
  },
  '/blog-series': {
    title: 'Blog Series – In-Depth Tech & Security Features | The Grid Nexus',
    description: 'In-depth blog series and long-form features on technology, cybersecurity, and gaming. Expert analysis and deep dives.',
    h1: 'Blog Series',
  },
  '/tutorials': {
    title: 'Tech & Security Tutorials | The Grid Nexus',
    description: 'Step-by-step tutorials for technology and security. Learn practical skills with our guided tutorials.',
    h1: 'Tutorials',
  },
  '/tech': {
    title: 'Technology News & Analysis 2026 | The Grid Nexus',
    description: 'Technology news and analysis for 2026. From AI to big tech and emerging platforms — The Grid Nexus keeps you informed.',
    h1: 'Technology News',
  },
  '/security-score': {
    title: 'Check Your Security Score – Threat Assessment Tool | The Grid Nexus',
    description: 'Assess your security posture with our threat assessment tool. Get actionable recommendations to improve your cybersecurity.',
    h1: 'Security Score',
  },
  '/gaming': {
    title: 'Gaming News, Reviews & Releases 2026 | The Grid Nexus',
    description: 'Latest gaming news, reviews, and release dates for 2026. Coverage of PS5, PC, and Xbox titles from The Grid Nexus gaming desk.',
    h1: 'Gaming News & Reviews',
  },
  '/ai-pulse': {
    title: 'AI Pulse – Artificial Intelligence News & Trends | The Grid Nexus',
    description: 'AI Pulse tracks the latest developments in artificial intelligence — model releases, market moves, ethics debates, and real-world impact.',
    h1: 'AI Pulse',
  },
  '/breach-sim': {
    title: 'Breach Simulation – Cybersecurity Training Tool | The Grid Nexus',
    description: 'Simulate cyber breaches and test your defenses. Our breach simulation tool helps security teams prepare for real threats.',
    h1: 'Breach Simulation',
  },
  '/sitemap': {
    title: 'Site Map | The Grid Nexus',
    description: 'Complete site map of The Grid Nexus. Find all pages, sections, and articles.',
    h1: 'Site Map',
  },
  '/about': {
    title: 'About | The Grid Nexus',
    description: 'Learn about The Grid Nexus — your source for tech, security, and gaming intelligence.',
    h1: 'About Us',
  },
  '/contact': {
    title: 'Contact | The Grid Nexus',
    description: 'Contact The Grid Nexus. Get in touch for press inquiries, partnerships, or feedback.',
    h1: 'Contact',
  },
  '/privacy': {
    title: 'Privacy Policy | The Grid Nexus',
    description: 'Privacy policy for The Grid Nexus. How we collect, use, and protect your data.',
    h1: 'Privacy Policy',
  },
  '/terms': {
    title: 'Terms of Service | The Grid Nexus',
    description: 'Terms of service for The Grid Nexus. Usage guidelines and legal terms.',
    h1: 'Terms of Service',
  },
};

/** Generate article title per audit format: [Headline] | The Grid Nexus */
export function getArticleTitle(headline: string): string {
  const clean = (headline || 'Article').trim();
  return `${clean} | ${SITE_NAME}`;
}

/** Get metadata for a path (supports /article/:slug for articles) */
export function getPageMetadata(pathname: string, article?: { title?: string; excerpt?: string }): { title: string; description: string; h1?: string } {
  const base = pathname.replace(/\/$/, '') || '/';
  const meta = PAGE_METADATA[base];
  if (article && base.startsWith('/article/')) {
    return {
      title: getArticleTitle(article.title || ''),
      description: (article.excerpt || '').slice(0, 155) || `Read ${article.title || 'this article'} on The Grid Nexus.`,
      h1: article.title || 'Article',
    };
  }
  return meta || { title: `${SITE_NAME}`, description: '', h1: SITE_NAME };
}
