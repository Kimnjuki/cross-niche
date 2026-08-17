/**
 * SEO Checklist data derived from two reports:
 * 1. Issues Overview Report (issues_overview_report.csv) – site-wide SEO issues
 * 2. SEO Ideas Report (ideas_thegridnexus.com_20260810.xlsx) – page-level improvement ideas
 */

export type ChecklistCategory = 'issues' | 'ideas';

export type IssueSeverity = 'High' | 'Medium' | 'Low';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  /** Short name for the issue / idea */
  name: string;
  /** Issue type from the report */
  type: string;
  severity: IssueSeverity;
  /** Percentage of URLs affected (Issues report) or priority score (Ideas report) */
  metric: string;
  /** Full description */
  description: string;
  /** How to fix / action to take */
  action: string;
  /** Help URL if available */
  helpUrl?: string;
  /** Target URL for ideas (page-level) */
  targetUrl?: string;
  /** Keyword(s) targeted */
  keywords?: string[];
  /** Whether the item has been completed */
  completed: boolean;
}

// ── Report 1: Issues Overview Report ──────────────────────────────────────────

export const issuesOverviewChecklist: ChecklistItem[] = [
  {
    id: 'issue-01',
    category: 'issues',
    name: 'Hreflang: Missing Return Links',
    type: 'Issue',
    severity: 'High',
    metric: '71 URLs (98.61%)',
    description:
      'URLs with missing return links (or "return tags" in Google Search Console) to them, from their alternate pages. Hreflang is reciprocal, so all alternate versions must confirm the relationship. When page X links to page Y using hreflang to specify it as its alternate page, page Y must have a return link. No return links means the hreflang annotations may be ignored or not interpreted correctly.',
    action:
      'Ensure alternate pages include hreflang annotations to URLs which are missing return links. This will confirm they are a "set" of alternate pages.',
    completed: false,
  },
  {
    id: 'issue-02',
    category: 'issues',
    name: 'URL: Over 115 Characters',
    type: 'Opportunity',
    severity: 'Low',
    metric: '3 URLs (3.70%)',
    description:
      'URLs that are more than the configured length. This is generally not an issue, however research has shown that users prefer shorter, concise URL strings.',
    action:
      'Where possible use logical and concise URLs for users and search engines. However, changing URLs is a big decision, and often it is not worth changing them for SEO purposes alone. If URLs are changed, then appropriate 301 redirects must be implemented.',
    completed: false,
  },
  {
    id: 'issue-03',
    category: 'issues',
    name: 'Security: Missing X-Content-Type-Options Header',
    type: 'Warning',
    severity: 'Low',
    metric: '77 URLs (95.06%)',
    description:
      'URLs that are missing the X-Content-Type-Options response header with a "nosniff" value. In the absence of a MIME type, browsers may "sniff" to guess the content type to interpret it correctly for users. However, this can be exploited by attackers who can try and load malicious code, such as JavaScript via an image they have compromised.',
    action:
      'To minimise security issues, the X-Content-Type-Options response header should be supplied and set to "nosniff". This instructs browsers to rely only on the Content-Type header and block anything that does not match accurately. This also means the content-type set needs to be accurate.',
    completed: false,
  },
  {
    id: 'issue-04',
    category: 'issues',
    name: 'Content: Readability Difficult',
    type: 'Opportunity',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Copy on the page is difficult to read and best understood by college graduates according to the Flesch reading-ease score formula. Copy that has long sentences and uses complex words are generally harder to read and understand.',
    action:
      'Consider improving the readability of copy for your target audience. Copy that uses shorter sentences with less complex words is often easier to read and understand.',
    completed: false,
  },
  {
    id: 'issue-05',
    category: 'issues',
    name: 'Page Titles: Same as H1',
    type: 'Opportunity',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Page titles which match the h1 on the page exactly. This is not necessarily an issue, but may point to a potential opportunity to target alternative keywords, synonyms, or related key phrases.',
    action:
      'This is not necessarily an issue, but may point to a potential opportunity to target alternative keywords, synonyms, or related key phrases.',
    completed: false,
  },
  {
    id: 'issue-06',
    category: 'issues',
    name: 'Page Titles: Duplicate',
    type: 'Opportunity',
    severity: 'Medium',
    metric: '72 URLs (100%)',
    description:
      'Pages which have duplicate page titles. It is really important to have distinct and unique page titles for every page. If every page has the same page title, then it can make it more challenging for users and the search engines to understand one page from another.',
    action:
      'Update duplicate page titles as necessary, so each page contains a unique and descriptive title for users and search engines. If these are duplicate pages, then fix the duplicated pages by linking to a single version, and redirect or use canonicals where appropriate.',
    completed: false,
  },
  {
    id: 'issue-07',
    category: 'issues',
    name: 'Canonicals: Missing',
    type: 'Warning',
    severity: 'Medium',
    metric: '72 URLs (100%)',
    description:
      'Pages that have no canonical URL present either as a link element, or via HTTP header. If a page does not indicate a canonical URL, Google will identify what they think is the best version or URL. This can lead to ranking unpredictability when there are multiple versions discovered.',
    action:
      'Specify a canonical URL for every page to avoid any potential ranking unpredictability if multiple versions of the same page are discovered on different URLs.',
    completed: false,
  },
  {
    id: 'issue-08',
    category: 'issues',
    name: 'Security: Missing Content-Security-Policy Header',
    type: 'Warning',
    severity: 'Low',
    metric: '77 URLs (95.06%)',
    description:
      'URLs that are missing the Content-Security-Policy response header. This header allows a website to control which resources are loaded for a page. This policy can help guard against cross-site scripting (XSS) attacks that exploit the browser trust of the content received from the server.',
    action:
      'Set a strict Content-Security-Policy response header across all pages to help mitigate cross site scripting (XSS) and data injection attacks.',
    completed: false,
  },
  {
    id: 'issue-09',
    category: 'issues',
    name: 'Security: Missing HSTS Header',
    type: 'Warning',
    severity: 'Low',
    metric: '77 URLs (95.06%)',
    description:
      'URLs that are missing the HSTS response header. The HTTP Strict-Transport-Security response header (HSTS) instructs browsers that it should only be accessed using HTTPS, rather than HTTP. If a website accepts a connection to HTTP, before being redirected to HTTPS, visitors will initially still communicate over HTTP.',
    action:
      'The HSTS header should be used across all pages to instruct the browser that it should always request pages via HTTPS, rather than HTTP.',
    completed: false,
  },
  {
    id: 'issue-10',
    category: 'issues',
    name: 'Security: Missing Secure Referrer-Policy Header',
    type: 'Warning',
    severity: 'Low',
    metric: '77 URLs (95.06%)',
    description:
      'URLs missing "no-referrer-when-downgrade", "strict-origin-when-cross-origin", "no-referrer" or "strict-origin" policies in the Referrer-Policy header. When using HTTPS, it is important that the URLs do not leak in non-HTTPS requests. This can expose users to "man in the middle" attacks.',
    action:
      'Consider setting a referrer policy of strict-origin-when-cross-origin. It retains much of the referrer usefulness, while mitigating the risk of leaking data cross-origins.',
    completed: false,
  },
  {
    id: 'issue-11',
    category: 'issues',
    name: 'Security: Missing X-Frame-Options Header',
    type: 'Warning',
    severity: 'Low',
    metric: '77 URLs (95.06%)',
    description:
      'URLs missing an X-Frame-Options response header with a "DENY" or "SAMEORIGIN" value. This instructs the browser not to render a page within a frame, iframe, embed or object. This helps avoid "clickjacking" attacks, where your content is displayed on another web page that is controlled by an attacker.',
    action:
      'To minimise security issues, the X-Frame-Options response header should be supplied with a "DENY" or "SAMEORIGIN" value.',
    completed: false,
  },
  {
    id: 'issue-12',
    category: 'issues',
    name: 'H2: Duplicate',
    type: 'Opportunity',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Pages which have duplicate <h2>s. It is important to have distinct, unique and useful pages. If every page has the same <h2>, then it can make it more challenging for users and the search engines to understand one page from another.',
    action:
      'Update duplicate <h2>s as necessary, so important pages contain a unique and descriptive <h2> for users and search engines. If these are duplicate pages, then fix the duplicated pages by linking to a single version, and redirect or use canonicals where appropriate.',
    completed: false,
  },
  {
    id: 'issue-13',
    category: 'issues',
    name: 'Meta Description: Missing',
    type: 'Opportunity',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Pages which have a missing meta description, the content is empty or has whitespace. This is a missed opportunity to communicate the benefits of your product or service and influence click through rates for important URLs.',
    action:
      'Write unique and descriptive meta descriptions on key pages to communicate the purpose of the page to users, and entice them to click on your result over the competition.',
    completed: false,
  },
  {
    id: 'issue-14',
    category: 'issues',
    name: 'H2: Multiple',
    type: 'Warning',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Pages which have multiple <h2>s. This is not an issue as HTML standards allow multiple <h2>s when used in a logical hierarchical heading structure. However, this filter can help you quickly scan to review if they are used appropriately.',
    action:
      'Ensure <h2>s are used in a logical hierarchical heading structure, and update where appropriate utilising the full heading rank between (h3 - h6) for additional headings.',
    completed: false,
  },
  {
    id: 'issue-15',
    category: 'issues',
    name: 'Content: Exact Duplicates',
    type: 'Issue',
    severity: 'High',
    metric: '72 URLs (100%)',
    description:
      'Pages that are identical to each other using the MD5 algorithm which calculates a "hash" value for each page. Exact duplicate pages can lead to the splitting of PageRank signals and unpredictability in ranking.',
    action:
      'There should only be a single canonical version of a URL that exists and is linked to internally. Other versions should not be linked to, and they should be 301 redirected to the canonical version.',
    completed: false,
  },
  {
    id: 'issue-16',
    category: 'issues',
    name: 'Response Codes: Internal Redirection (3xx)',
    type: 'Warning',
    severity: 'Low',
    metric: '4 URLs (4.88%)',
    description:
      'Internal URLs which redirect to another URL. These will include server-side redirects, such as 301 or 302 redirects (and more).',
    action:
      'Ideally all internal links would be to canonical resolving URLs, and avoid linking to URLs that redirect. This reduces latency of redirect hops for users, and enhanced efficiency for search engines.',
    completed: false,
  },
  {
    id: 'issue-17',
    category: 'issues',
    name: 'H1: Duplicate',
    type: 'Opportunity',
    severity: 'Low',
    metric: '72 URLs (100%)',
    description:
      'Pages which have duplicate <h1>s. It is important to have distinct, unique and useful main headings. If every page has the same <h1>, then it can make it more challenging for users and the search engines to understand one page from another.',
    action:
      'Update duplicate <h1>s as necessary, so important pages contain a unique and descriptive <h1> for users and search engines.',
    completed: false,
  },
  {
    id: 'issue-18',
    category: 'issues',
    name: 'Hreflang: Missing Self Reference',
    type: 'Warning',
    severity: 'Low',
    metric: '71 URLs (98.61%)',
    description:
      'URLs missing their own self referencing rel="alternate" hreflang annotation. It was previously a requirement to have a self-referencing hreflang, but Google has updated their guidelines to say this is optional. It is however good practice.',
    action:
      'Consider adding a self referencing rel="alternate" hreflang annotation as Google still describe this as best practice in their documentation.',
    completed: false,
  },
  {
    id: 'issue-19',
    category: 'issues',
    name: 'Security: HTTP URLs',
    type: 'Issue',
    severity: 'High',
    metric: '2 URLs (2.47%)',
    description:
      'HTTP URLs that are encountered in the crawl. All websites should be secure over HTTPS today on the web. Not only is it important for security, but it is now expected by users. Chrome and other browsers display a "Not Secure" message against any URLs that are HTTP, or have mixed content issues.',
    action:
      'All URLs should be to secure HTTPS pages. Pages should be served over HTTPS, any internal links should be updated to HTTPS versions and HTTP URLs should 301 redirect to HTTPS versions.',
    completed: false,
  },
];

// ── Report 2: SEO Ideas Report ───────────────────────────────────────────────

export const seoIdeasChecklist: ChecklistItem[] = [
  {
    id: 'idea-01',
    category: 'ideas',
    name: 'Add Internal Links',
    type: 'Idea',
    severity: 'High',
    metric: 'Priority: 1.62',
    description:
      'The page /article/gaming-pc-antivirus-best-2026 does not have internal links. Adding internal links helps search engines discover the page and distributes PageRank across the site.',
    action:
      'Add at least one internal link to this page from relevant articles or category pages. Target keywords: best antivirus for gaming computers, best antivirus for gaming pc, what is the best antivirus for gaming, antivirus for gaming pc, best antivirus for gaming computer.',
    targetUrl: 'https://thegridnexus.com/article/gaming-pc-antivirus-best-2026',
    keywords: [
      'best antivirus for gaming computers',
      'best antivirus for gaming pc',
      'what is the best antivirus for gaming',
      'antivirus for gaming pc',
      'best antivirus for gaming computer',
    ],
    completed: false,
  },
  {
    id: 'idea-02',
    category: 'ideas',
    name: 'Add Meta Description to Homepage',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.31',
    description:
      'The homepage does not have a meta description tag. This is a missed opportunity to influence click-through rates from search results.',
    action:
      'Include a meta description tag in the homepage. Target keywords: how to prevent monetization leaks in gaming apps.',
    targetUrl: 'https://thegridnexus.com/',
    keywords: ['how to prevent monetization leaks in gaming apps'],
    completed: false,
  },
  {
    id: 'idea-03',
    category: 'ideas',
    name: 'Add Internal Links to Minecraft Server Guide',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.33',
    description:
      'The page /article/minecraft-server-security-guide does not have internal links. Internal links help search engines and users navigate to this content.',
    action:
      'Add at least one internal link to this page from relevant articles. Target keyword: enforce secure profile minecraft.',
    targetUrl: 'https://thegridnexus.com/article/minecraft-server-security-guide',
    keywords: ['enforce secure profile minecraft'],
    completed: false,
  },
  {
    id: 'idea-04',
    category: 'ideas',
    name: 'Acquire Backlinks - Gaming PC Antivirus',
    type: 'Idea',
    severity: 'High',
    metric: 'Priority: 1.62',
    description:
      'This page needs backlinks from authoritative domains to improve its search ranking.',
    action:
      'Try to acquire backlinks from the following domains: prevx.com, newsplugin.com, alibaba.com, chinaz.com, globeistan.com, yahoo.com, activatesecurity.com, prlog.ru.',
    targetUrl: 'https://thegridnexus.com/article/gaming-pc-antivirus-best-2026',
    keywords: [
      'best antivirus for gaming pc',
      'best antivirus for gaming computers',
      'what is the best antivirus for gaming',
      'antivirus for gaming pc',
    ],
    completed: false,
  },
  {
    id: 'idea-05',
    category: 'ideas',
    name: 'Enrich Content with Semantic Keywords',
    type: 'Idea',
    severity: 'High',
    metric: 'Priority: 1.62',
    description:
      'Compared to rivals, some related words are not present in the page content. Enriching with semantically related keywords can improve topical relevance.',
    action:
      'Add the following semantically related words to the content: gaming pc, real time protection, gaming performance, customer support, antivirus software, antivirus programs, system resources, gaming mode, password manager, gaming experience, antivirus protection, malware detection, antivirus for pc, playing games, system impact, antivirus affect gaming, affect gaming performance, full screen, performance test.',
    targetUrl: 'https://thegridnexus.com/article/gaming-pc-antivirus-best-2026',
    keywords: ['best antivirus for gaming computers', 'best antivirus for gaming computer'],
    completed: false,
  },
  {
    id: 'idea-06',
    category: 'ideas',
    name: 'Enrich Homepage Content',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.31',
    description:
      'Compared to rivals, some related words are not present in the homepage content. Enriching with semantically related keywords can improve topical relevance for monetization leak prevention.',
    action:
      'Add the following semantically related words: mobile game, app purchases, server side, rewarded ads, reduce revenue, ad impressions.',
    targetUrl: 'https://thegridnexus.com/',
    keywords: ['how to prevent monetization leaks in gaming apps'],
    completed: false,
  },
  {
    id: 'idea-07',
    category: 'ideas',
    name: 'Acquire Backlinks - Homepage',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.31',
    description:
      'The homepage needs backlinks from authoritative domains to improve its search ranking.',
    action:
      'Try to acquire backlinks from the following domains: createsell.com, ostorlab.co, revtrona.com, sugo.com.',
    targetUrl: 'https://thegridnexus.com/',
    keywords: ['how to prevent monetization leaks in gaming apps'],
    completed: false,
  },
  {
    id: 'idea-08',
    category: 'ideas',
    name: 'Enrich Minecraft Server Guide Content',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.33',
    description:
      'Compared to rivals, some related words are not present in the Minecraft server security guide content.',
    action:
      'Add the following semantically related word: enforce secure profile.',
    targetUrl: 'https://thegridnexus.com/article/minecraft-server-security-guide',
    keywords: ['enforce secure profile minecraft'],
    completed: false,
  },
  {
    id: 'idea-09',
    category: 'ideas',
    name: 'Acquire Backlinks - Minecraft Server Guide',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.33',
    description:
      'The Minecraft server security guide needs backlinks from authoritative domains.',
    action:
      'Try to acquire backlinks from the following domains: spongepowered.org, shockbyte.com, 101-help.com, signnow.com, wukihow.com, spigotmc.org, survivalservers.com.',
    targetUrl: 'https://thegridnexus.com/article/minecraft-server-security-guide',
    keywords: ['enforce secure profile minecraft'],
    completed: false,
  },
  {
    id: 'idea-10',
    category: 'ideas',
    name: 'Add Aggregate Rating Schema - Minecraft Guide',
    type: 'Idea',
    severity: 'Low',
    metric: 'Priority: 0.33',
    description:
      'Adding an aggregate rating to this page using Organization markup code may increase click-through rate in search results.',
    action:
      'Add an aggregate rating schema using the Organization markup code to this page.',
    targetUrl: 'https://thegridnexus.com/article/minecraft-server-security-guide',
    keywords: ['enforce secure profile minecraft'],
    completed: false,
  },
];

// ── Combined export ──────────────────────────────────────────────────────────

export const allChecklistItems: ChecklistItem[] = [
  ...issuesOverviewChecklist,
  ...seoIdeasChecklist,
];

/** Group items by category for rendering */
export function getChecklistByCategory() {
  return {
    issues: issuesOverviewChecklist,
    ideas: seoIdeasChecklist,
  };
}

/** Get completion stats */
export function getCompletionStats(items: ChecklistItem[]) {
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentComplete };
}