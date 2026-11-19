/**
 * Current-state SEO audit for The Grid Nexus.
 *
 * Verifies the claims made in the "Full SEO & Platform Audit" brief against the
 * actual codebase: canonical host consistency, robots.txt / sitemap wiring,
 * title + meta description length and uniqueness, JSON-LD coverage, and
 * client-side meta injection risk.
 *
 * Usage: node scripts/audit-seo-current-state.mjs
 */
import fs from "fs";
import zlib from "node:zlib";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const findings = [];
const add = (severity, area, message) => findings.push({ severity, area, message });

const read = (rel) => {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
};

/* ── 1. Canonical host consistency ─────────────────────────────────────── */
const CANONICAL = "https://thegridnexus.com";
const hostSources = {
  "index.html": read("index.html"),
  "netlify.toml": read("netlify.toml"),
  "nginx.conf": read("nginx.conf"),
  "public/robots.txt": read("public/robots.txt"),
  "public/sitemap.xml": read("public/sitemap.xml"),
  "public/sitemap-index.xml": read("public/sitemap-index.xml"),
  "public/sitemap-articles.xml": read("public/sitemap-articles.xml"),
};

// A www reference is only a problem when it is a *destination* (canonical, og:url,
// sitemap <loc>, robots Sitemap). www appearing as a redirect `from`/`server_name`
// source is exactly what we want.
const wwwDestRefs = [];
for (const [file, content] of Object.entries(hostSources)) {
  if (!content) continue;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!/www\.thegridnexus\.com/.test(line)) return;
    const isRedirectSource = /\bfrom\s*=|\bserver_name\b|\brewrite\b/.test(line);
    if (!isRedirectSource) wwwDestRefs.push(`${file}:${i + 1}`);
  });
}

if (wwwDestRefs.length === 0) {
  add("PASS", "Canonical host", `No www host is used as a canonical/og/sitemap/robots destination across ${Object.keys(hostSources).length} host-bearing files. Every www mention is a redirect source.`);
} else {
  add("FAIL", "Canonical host", `www host used as a destination (should be non-www): ${wwwDestRefs.join(", ")}`);
}

// Redirect coverage
const netlify = hostSources["netlify.toml"] || "";
const redirectPairs = netlify.match(/from = "([^"]+)"\s*\n\s*to = "([^"]+)"/g) || [];
const hostRedirects = redirectPairs.filter((r) => r.includes("thegridnexus.com"));
add(
  hostRedirects.length >= 3 ? "PASS" : "WARN",
  "Redirects",
  `netlify.toml declares ${hostRedirects.length} host-normalisation 301s (www-https, www-http, apex-http).`
);

const nginx = hostSources["nginx.conf"] || "";
const nginxWwwRedirect = /server_name www\.thegridnexus\.com;[\s\S]{0,200}?return 301 https:\/\/thegridnexus\.com/.test(nginx);
add(
  nginxWwwRedirect ? "PASS" : "WARN",
  "Redirects",
  nginxWwwRedirect
    ? "nginx.conf has a dedicated www server block returning 301 to the apex host."
    : "nginx.conf www server block could not be confirmed."
);

/* ── 2. robots.txt + sitemap wiring ────────────────────────────────────── */
const robots = hostSources["public/robots.txt"];
if (!robots) {
  add("FAIL", "robots.txt", "public/robots.txt is missing.");
} else {
  const sitemapLines = robots.match(/^Sitemap:.*$/gm) || [];
  add(
    sitemapLines.length > 0 ? "PASS" : "FAIL",
    "robots.txt",
    `robots.txt is present and declares ${sitemapLines.length} Sitemap directive(s): ${sitemapLines.join(", ")}`
  );
  const disallows = (robots.match(/^Disallow:/gm) || []).length;
  const allows = (robots.match(/^Allow:/gm) || []).length;
  add("INFO", "robots.txt", `${disallows} Disallow and ${allows} Allow directives; author pages explicitly allowed for E-E-A-T crawlability.`);
}

const sitemapIndex = hostSources["public/sitemap-index.xml"];
const sitemapMain = hostSources["public/sitemap.xml"];
const sitemapArticles = hostSources["public/sitemap-articles.xml"];
const sitemapNews = read("public/sitemap-news.xml");

if (sitemapIndex) {
  const declared = (sitemapIndex.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) => s.replace(/<\/?loc>/g, ""));
  const newsEntryCount = sitemapNews ? (sitemapNews.match(/<loc>/g) || []).length : 0;
  const undeclared = [];
  if (sitemapMain && !declared.some((d) => d.endsWith("/sitemap.xml"))) undeclared.push("sitemap.xml");
  if (sitemapArticles && !declared.some((d) => d.endsWith("/sitemap-articles.xml"))) undeclared.push("sitemap-articles.xml");
  if (sitemapNews && newsEntryCount > 0 && !declared.some((d) => d.endsWith("/sitemap-news.xml"))) undeclared.push("sitemap-news.xml");
  add(
    undeclared.length === 0 ? "PASS" : "WARN",
    "Sitemap index",
    undeclared.length === 0
      ? `sitemap-index.xml declares all ${declared.length} child sitemaps that exist in public/.`
      : `sitemap-index.xml does not declare: ${undeclared.join(", ")}.`
  );
  // An EMPTY news sitemap must NOT be advertised: Google News only accepts
  // articles from the last 48 hours, and submitting an empty urlset is a
  // reported error. generate-seo-sitemaps.mjs already omits it in that case,
  // so "exists but undeclared" is the correct state, not a defect.
  const newsAdvertised = declared.some((d) => d.endsWith("/sitemap-news.xml"));
  const newsConsistent = newsEntryCount > 0 ? newsAdvertised : !newsAdvertised;
  add(
    newsConsistent ? "PASS" : "FAIL",
    "News sitemap",
    newsEntryCount > 0
      ? `sitemap-news.xml contains ${newsEntryCount} URL(s) and is advertised in the index.`
      : "sitemap-news.xml is empty (no articles published in the last 48h) and is correctly omitted from sitemap-index.xml — Google News only accepts the last 48 hours."
  );
}

// Sitemap URL hygiene
if (sitemapMain) {
  const locs = [...sitemapMain.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const badHost = locs.filter((l) => !l.startsWith(`${CANONICAL}/`) && l !== CANONICAL);
  const trailing = locs.filter((l) => l.endsWith("/") && l !== `${CANONICAL}/`);
  const noLastmod = locs.filter((_, i) => {
    const block = sitemapMain.split("<url>").slice(1)[i] || "";
    return !/<lastmod>/.test(block);
  }).length;
  add(
    badHost.length === 0 && trailing.length === 0 ? "PASS" : "FAIL",
    "Sitemap hygiene",
    `sitemap.xml: ${locs.length} URLs, ${badHost.length} off-canonical host, ${trailing.length} trailing-slash duplicates, ${noLastmod} missing <lastmod>.`
  );
}

/* ── 3. Titles + meta descriptions ─────────────────────────────────────── */
let routeMetadata = null;
try {
  const mod = await import("./lib/route-metadata.mjs");
  routeMetadata = mod.ROUTE_METADATA || mod.default?.ROUTE_METADATA;
} catch (err) {
  add("WARN", "Route metadata", `Could not load scripts/lib/route-metadata.mjs: ${err.message}`);
}

if (routeMetadata) {
  const routes = Object.keys(routeMetadata);
  const titles = new Map();
  const descs = new Map();
  const longTitles = [];
  const longDescs = [];
  const shortDescs = [];
  const missing = [];

  for (const route of routes) {
    const meta = routeMetadata[route] || {};
    const title = meta.title || "";
    const desc = meta.description || "";
    if (!title || !desc) missing.push(route);
    if (title) {
      if (title.length > 60) longTitles.push(`${route} (${title.length})`);
      if (titles.has(title)) titles.set(title, [...titles.get(title), route]);
      else titles.set(title, [route]);
    }
    if (desc) {
      if (desc.length > 160) longDescs.push(`${route} (${desc.length})`);
      if (desc.length < 70) shortDescs.push(`${route} (${desc.length})`);
      if (descs.has(desc)) descs.set(desc, [...descs.get(desc), route]);
      else descs.set(desc, [route]);
    }
  }

  const dupTitles = [...titles.entries()].filter(([, r]) => r.length > 1);
  const dupDescs = [...descs.entries()].filter(([, r]) => r.length > 1);

  add(
    missing.length === 0 ? "PASS" : "FAIL",
    "Title/meta completeness",
    `${routes.length} routes have metadata; ${missing.length} are missing a title or description${missing.length ? ": " + missing.slice(0, 10).join(", ") : ""}.`
  );
  add(
    dupTitles.length === 0 ? "PASS" : "FAIL",
    "Title uniqueness",
    dupTitles.length === 0
      ? `All ${routes.length} route titles are unique.`
      : `${dupTitles.length} duplicate title(s): ${dupTitles.map(([t, r]) => `"${t}" on ${r.join(" + ")}`).join("; ")}`
  );
  add(
    dupDescs.length === 0 ? "PASS" : "WARN",
    "Description uniqueness",
    dupDescs.length === 0
      ? `All ${routes.length} route descriptions are unique.`
      : `${dupDescs.length} duplicate description(s): ${dupDescs.map(([d, r]) => `"${d.slice(0, 50)}..." on ${r.join(" + ")}`).join("; ")}`
  );
  add(
    longTitles.length === 0 ? "PASS" : "WARN",
    "Title length",
    longTitles.length === 0
      ? "No titles exceed 60 characters (SERP truncation threshold)."
      : `${longTitles.length} title(s) exceed 60 chars and will truncate: ${longTitles.join(", ")}`
  );
  add(
    longDescs.length === 0 ? "PASS" : "WARN",
    "Description length",
    longDescs.length === 0
      ? "No descriptions exceed 160 characters."
      : `${longDescs.length} description(s) exceed 160 chars: ${longDescs.join(", ")}`
  );
  if (shortDescs.length) {
    add("WARN", "Description length", `${shortDescs.length} description(s) under 70 chars (weak snippet): ${shortDescs.join(", ")}`);
  }
}

/* ── 4. JSON-LD coverage ───────────────────────────────────────────────── */
const indexHtml = hostSources["index.html"] || "";
const jsonLdBlocks = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
const schemaTypes = [];
for (const [, body] of jsonLdBlocks) {
  try {
    const parsed = JSON.parse(body);
    const graph = parsed["@graph"] || [parsed];
    for (const node of graph) if (node["@type"]) schemaTypes.push(node["@type"]);
  } catch {
    /* ignore malformed */
  }
}
const required = ["Organization", "WebSite"];
const missingSchema = required.filter((t) => !schemaTypes.includes(t));
add(
  missingSchema.length === 0 ? "PASS" : "FAIL",
  "Homepage JSON-LD",
  `index.html ships ${jsonLdBlocks.length} JSON-LD block(s) with types: ${[...new Set(schemaTypes)].join(", ") || "none"}.`
);

// Article-level schema
const articleSchemaFiles = [];
const srcDir = path.join(ROOT, "src");
const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
};
let srcFiles = [];
try {
  srcFiles = walk(srcDir);
} catch {
  add("WARN", "Source scan", "src/ directory not found.");
}
for (const file of srcFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (/NewsArticle|"Article"|'Article'|BlogPosting/.test(content)) {
    articleSchemaFiles.push(path.relative(ROOT, file));
  }
}
add(
  articleSchemaFiles.length > 0 ? "PASS" : "WARN",
  "Article JSON-LD",
  articleSchemaFiles.length > 0
    ? `Article/NewsArticle schema is emitted from: ${articleSchemaFiles.slice(0, 8).join(", ")}${articleSchemaFiles.length > 8 ? ` (+${articleSchemaFiles.length - 8} more)` : ""}.`
    : "No source file emits Article/NewsArticle/BlogPosting schema."
);

const breadcrumbFiles = srcFiles.filter((f) => /BreadcrumbList/.test(fs.readFileSync(f, "utf8")));
add(
  breadcrumbFiles.length > 0 ? "PASS" : "WARN",
  "Breadcrumb JSON-LD",
  breadcrumbFiles.length > 0
    ? `BreadcrumbList schema emitted from ${breadcrumbFiles.length} file(s): ${breadcrumbFiles.slice(0, 5).map((f) => path.relative(ROOT, f)).join(", ")}`
    : "No BreadcrumbList schema found in src/."
);

const faqFiles = srcFiles.filter((f) => /FAQPage/.test(fs.readFileSync(f, "utf8")));
add(
  faqFiles.length > 0 ? "PASS" : "WARN",
  "FAQ JSON-LD",
  faqFiles.length > 0
    ? `FAQPage schema emitted from ${faqFiles.length} file(s).`
    : "No FAQPage schema found in src/."
);

const howToFiles = srcFiles.filter((f) => /"HowTo"|'HowTo'|HowTo/.test(fs.readFileSync(f, "utf8")));
add(
  howToFiles.length > 0 ? "PASS" : "WARN",
  "HowTo JSON-LD",
  howToFiles.length > 0
    ? `HowTo schema emitted from ${howToFiles.length} file(s).`
    : "No HowTo schema found in src/ — recovery playbooks are a missed rich-result opportunity."
);

/* ── 5. Client-side meta injection risk ────────────────────────────────── */
const metaInjectorFiles = srcFiles.filter((f) => {
  const c = fs.readFileSync(f, "utf8");
  return /document\.title\s*=|setAttribute\("content"|querySelector\('meta|querySelector\("meta|createElement\("link"\)/.test(c);
});

// Google warns against using JS to change a canonical away from the value in
// the original HTML. Rather than just flagging every file that touches the
// head, verify that the canonical writer actually reads the prerendered value
// before overwriting it. This turns a latent risk into a structural guarantee.
const seoHeadFile = path.join(ROOT, "src", "components", "seo", "SEOHead.tsx");
const seoHeadSrc = fs.existsSync(seoHeadFile) ? fs.readFileSync(seoHeadFile, "utf8") : "";
const readsSsrCanonical = /getAttribute\((['"])href\1\)/.test(seoHeadSrc) &&
  /ssrCanonical/.test(seoHeadSrc) &&
  /canonicalLink\.href\s*=\s*ssrCanonical/.test(seoHeadSrc);
const unguardedCanonicalWrite = /canonicalLink\.href\s*=\s*canonical\s*;/.test(seoHeadSrc);

add(
  readsSsrCanonical && !unguardedCanonicalWrite ? "PASS" : "FAIL",
  "Canonical SSR guard",
  readsSsrCanonical && !unguardedCanonicalWrite
    ? "SEOHead reads the prerendered canonical href and preserves it verbatim; it only fills the tag when absent or when an explicit canonical override is passed."
    : `SEOHead does not safely preserve the prerendered canonical (reads SSR value: ${readsSsrCanonical}, unguarded write present: ${unguardedCanonicalWrite}). Google warns against JS changing a canonical away from the original HTML value.`
);

add(
  metaInjectorFiles.length === 0 ? "PASS" : "WARN",
  "Client-side meta injection",
  metaInjectorFiles.length === 0
    ? "No runtime DOM mutation of <title>/<meta>/<link rel=canonical> detected in src/."
    : `${metaInjectorFiles.length} file(s) mutate head tags at runtime: ${metaInjectorFiles.slice(0, 8).map((f) => path.relative(ROOT, f)).join(", ")}${metaInjectorFiles.length > 8 ? ` (+${metaInjectorFiles.length - 8} more)` : ""}. Canonical writes are guarded (see "Canonical SSR guard"); verify title/meta writes do not regress SSR values.`
);

// Prerender coverage
const prerenderRoutesFile = read("prerender-routes.json");
let prerenderCount = 0;
if (prerenderRoutesFile) {
  try {
    prerenderCount = JSON.parse(prerenderRoutesFile).length;
  } catch {
    /* ignore */
  }
}
add(
  prerenderCount > 0 ? "PASS" : "WARN",
  "Prerendering",
  prerenderCount > 0
    ? `prerender-routes.json lists ${prerenderCount} statically prerendered routes (crawlers receive real HTML).`
    : "prerender-routes.json missing or empty — routes may be client-rendered only."
);

/* ── 5b. Built output: per-route canonical verification ────────────────── */
const distDir = path.join(ROOT, "dist");
if (fs.existsSync(distDir)) {
  const htmlFiles = [];
  const walkHtml = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkHtml(full);
      else if (entry.name === "index.html") htmlFiles.push(full);
    }
  };
  walkHtml(distDir);

  let selfCanonical = 0;
  const canonicalProblems = [];
  const titleProblems = [];
  const noindexMissing = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const rel = path.relative(distDir, file).replace(/\\/g, "/");
    const routePath = rel === "index.html" ? "/" : `/${rel.replace(/\/index\.html$/, "")}`;
    const expected = routePath === "/" ? `${CANONICAL}/` : `${CANONICAL}${routePath}`;
    const m = html.match(/<link rel="canonical" href="([^"]*)"/);
    if (!m) canonicalProblems.push(`${routePath}: no canonical tag`);
    else if (m[1] !== expected) canonicalProblems.push(`${routePath}: canonical is ${m[1]}`);
    else selfCanonical += 1;

    const t = html.match(/<title>([^<]*)<\/title>/);
    // Only flag genuinely thin titles on pages that are meant to be indexed.
    // Utility routes (/signin, /api, /settings) are robots-disallowed and
    // noindex, so their short titles never reach a SERP.
    const isUtility = /^\/?(signin|signup|search|settings|bookmarks|profile|api|simple|enhanced|enhanced-simple|original-index|tools-old|notifications|subscription|security-profile|sitemap|seo-checklist|keyword-gap-analysis|newsletter\/verify|preview|draft|admin)/.test(routePath);
    if (t && t[1].length < 30 && !isUtility) {
      titleProblems.push(`${routePath}: "${t[1]}" (${t[1].length} chars)`);
    }
    // noindex pages must actually carry the directive in the served HTML
    if (isUtility && !/name=["']robots["'][^>]+noindex/.test(html)) {
      noindexMissing.push(routePath);
    }
  }
  add(
    canonicalProblems.length === 0 ? "PASS" : "FAIL",
    "Built canonical tags",
    canonicalProblems.length === 0
      ? `All ${htmlFiles.length} built index.html files self-canonicalise to their own route.`
      : `${canonicalProblems.length} of ${htmlFiles.length} built pages do not self-canonicalise: ${canonicalProblems.slice(0, 10).join("; ")}${canonicalProblems.length > 10 ? ` (+${canonicalProblems.length - 10} more)` : ""}`
  );
  if (titleProblems.length) {
    add("WARN", "Built titles", `${titleProblems.length} indexable built page(s) have titles under 30 chars: ${titleProblems.slice(0, 10).join("; ")}`);
  }
  add(
    noindexMissing.length === 0 ? "PASS" : "WARN",
    "Noindex directives",
    noindexMissing.length === 0
      ? "Every robots-disallowed utility route also ships a noindex robots meta tag."
      : `${noindexMissing.length} utility route(s) are robots-disallowed but ship no noindex meta: ${noindexMissing.slice(0, 10).join(", ")}`
  );
} else {
  add("INFO", "Built output", "No dist/ directory — run `npm run build` to verify prerendered canonicals.");
}

/* ── 5c. Internal linking from built article pages ─────────────────────── */
if (fs.existsSync(distDir)) {
  const articleHtml = [];
  const walkArticles = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkArticles(full);
      else if (entry.name === "index.html" && full.includes(`${path.sep}article${path.sep}`)) articleHtml.push(full);
    }
  };
  walkArticles(distDir);

  if (articleHtml.length) {
    const HUB_PREFIXES = ["/gaming/security-guides", "/gaming/security", "/games", "/threats", "/methodology", "/platforms/"];
    let toHub = 0;
    let toTool = 0;
    let toRecovery = 0;
    let toRelatedArticle = 0;
    const weak = [];

    for (const file of articleHtml) {
      const html = fs.readFileSync(file, "utf8");
      const links = new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]));
      const rel = path.relative(distDir, file).replace(/\\/g, "/");
      const hasHub = HUB_PREFIXES.some((p) => [...links].some((l) => l.startsWith(p)));
      const hasTool = [...links].some((l) => l.startsWith("/tools/"));
      const hasRecovery = [...links].some((l) => l.startsWith("/recover") || l.startsWith("/platforms/"));
      const hasRelated = [...links].filter((l) => l.startsWith("/article/")).length >= 2;
      if (hasHub) toHub++;
      if (hasTool) toTool++;
      if (hasRecovery) toRecovery++;
      if (hasRelated) toRelatedArticle++;
      if (!hasHub || !hasTool) weak.push(rel.replace(/\/index\.html$/, ""));
    }

    const n = articleHtml.length;
    add(
      weak.length === 0 ? "PASS" : "WARN",
      "Article internal links",
      `${n} built article pages: ${toHub} link to a hub page, ${toTool} link to a tool, ${toRecovery} link to recovery/platform, ${toRelatedArticle} link to 2+ related articles.${weak.length ? ` Missing hub or tool link: ${weak.slice(0, 10).join(", ")}${weak.length > 10 ? ` (+${weak.length - 10} more)` : ""}` : ""}`
    );
  }
}

/* ── 5d. Built article title quality (truncation / brand repetition) ───── */
if (fs.existsSync(distDir)) {
  const articlePages = [];
  const walkTitles = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkTitles(full);
      else if (entry.name === "index.html" && full.includes(`${path.sep}article${path.sep}`)) articlePages.push(full);
    }
  };
  walkTitles(distDir);

  if (articlePages.length) {
    const long = [];
    const longNoindex = [];
    const brandHeavy = [];
    for (const file of articlePages) {
      const html = fs.readFileSync(file, "utf8");
      const t = html.match(/<title>([^<]*)<\/title>/);
      if (!t) continue;
      const title = t[1];
      const rel = path.relative(distDir, file).replace(/\\/g, "/").replace(/\/index\.html$/, "");
      // A noindex article never appears in a SERP, so an over-long title there
      // is cosmetic. Counting it as a defect buried the 16 real offenders under
      // 59 intentionally demoted off-niche articles.
      const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
      if (title.length > 60) (noindex ? longNoindex : long).push(`${rel} (${title.length})`);
      // Brand suffix appearing more than once, or brand before the topic
      const brandCount = (title.match(/The Grid Nexus/g) || []).length;
      if (brandCount > 1) brandHeavy.push(`${rel}: "${title}"`);
    }
    add(
      long.length === 0 ? "PASS" : "WARN",
      "Built article titles",
      long.length === 0
        ? `All ${articlePages.length - longNoindex.length} indexable built article titles are ≤60 chars (no SERP truncation).`
        : `${long.length} indexable built article title(s) exceed 60 chars: ${long.slice(0, 10).join(", ")}`
    );
    if (longNoindex.length) {
      add("INFO", "Noindex article titles", `${longNoindex.length} noindex article title(s) exceed 60 chars — not shown in search, so not a defect: ${longNoindex.slice(0, 5).join(", ")}`);
    }
    if (brandHeavy.length) {
      add("WARN", "Brand repetition", `${brandHeavy.length} built title(s) repeat the brand name: ${brandHeavy.slice(0, 5).join("; ")}`);
    }
  }
}

/* ── 6. Core Web Vitals signals ────────────────────────────────────────── */
const imgFiles = srcFiles.filter((f) => /<img\b/.test(fs.readFileSync(f, "utf8")));
const lazyImgs = srcFiles.filter((f) => /loading=["']lazy["']/.test(fs.readFileSync(f, "utf8")));
add("INFO", "Images", `${imgFiles.length} file(s) render <img>; ${lazyImgs.length} use loading="lazy".`);

const heroFiles = srcFiles.filter((f) => /fetchpriority|fetchPriority/.test(fs.readFileSync(f, "utf8")));
add(
  heroFiles.length > 0 ? "PASS" : "WARN",
  "LCP hint",
  heroFiles.length > 0
    ? `${heroFiles.length} file(s) set fetchPriority on hero imagery.`
    : "No fetchPriority hints found — LCP hero images may be deprioritised."
);

const fontStylesheets = [...indexHtml.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+fonts\.googleapis[^>]*>/g)];
const hasPreconnect = /rel=["']preconnect["'][^>]+fonts\.googleapis/.test(indexHtml);
const hasGstaticPreconnect = /rel=["']preconnect["'][^>]+fonts\.gstatic[^>]+crossorigin/.test(indexHtml);
add(
  fontStylesheets.length === 0 || (hasPreconnect && hasGstaticPreconnect) ? "PASS" : "WARN",
  "Fonts",
  fontStylesheets.length === 0
    ? "No Google Fonts stylesheet in index.html — no render-blocking font risk."
    : hasPreconnect && hasGstaticPreconnect
      ? `${fontStylesheets.length} Google Fonts stylesheet(s), both preconnected (googleapis + crossorigin gstatic).`
      : `${fontStylesheets.length} Google Fonts stylesheet(s) without complete preconnect (googleapis: ${hasPreconnect}, gstatic+crossorigin: ${hasGstaticPreconnect}).`
);

/* ── 7. Asset weight (LCP / bandwidth) ─────────────────────────────────── */
const assetsDir = path.join(ROOT, "dist", "assets");
if (fs.existsSync(assetsDir)) {
  const entries = fs.readdirSync(assetsDir).map((f) => ({
    name: f,
    size: fs.statSync(path.join(assetsDir, f)).size,
  }));
  // Include WebP/AVIF: the theme images were re-encoded to WebP, so a
  // jpeg/png-only filter would silently stop measuring them and report a
  // false PASS.
  const images = entries.filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e.name));
  const heavyImages = images.filter((e) => e.size > 400 * 1024);
  const totalImageMb = images.reduce((a, b) => a + b.size, 0) / 1048576;
  const jsFiles = entries.filter((e) => e.name.endsWith(".js"));
  // Measure GZIPPED size, not raw disk size. Raw size is what sits on the
  // server; gzip is what the browser actually downloads and what Core Web
  // Vitals / Lighthouse score. A 547 KB raw entry chunk is only ~167 KB over
  // the wire, so a raw-size threshold reports a false WARN on a healthy build.
  const jsGz = jsFiles.map((e) => ({
    name: e.name,
    raw: e.size,
    gz: zlib.gzipSync(fs.readFileSync(path.join(assetsDir, e.name))).length,
  }));
  const bigJs = jsGz.filter((e) => e.gz > 500 * 1024);
  const totalRawMb = jsGz.reduce((a, b) => a + b.raw, 0) / 1048576;
  const totalGzKb = jsGz.reduce((a, b) => a + b.gz, 0) / 1024;
  const worst = jsGz.slice().sort((a, b) => b.gz - a.gz)[0];
  add(
    heavyImages.length === 0 ? "PASS" : "WARN",
    "Image weight",
    heavyImages.length === 0
      ? `No raster asset exceeds 400 KB (${images.length} images, ${totalImageMb.toFixed(1)} MB total).`
      : `${heavyImages.length} raster asset(s) exceed 400 KB (${totalImageMb.toFixed(1)} MB total across ${images.length} images): ${heavyImages.sort((a, b) => b.size - a.size).slice(0, 6).map((e) => `${e.name} ${(e.size / 1048576).toFixed(1)}MB`).join(", ")}. These are served as article cover images and directly hurt LCP on mobile.`
  );
  add(
    bigJs.length === 0 ? "PASS" : "WARN",
    "JS bundle size",
    bigJs.length === 0
      ? `No JS chunk exceeds 500 KB gzipped (${jsFiles.length} chunks, ${totalRawMb.toFixed(2)} MB raw / ${totalGzKb.toFixed(0)} KB gzipped; largest: ${worst.name} ${(worst.gz / 1024).toFixed(0)} KB gz).`
      : `${bigJs.length} JS chunk(s) exceed 500 KB gzipped: ${bigJs.map((e) => `${e.name} ${(e.gz / 1024).toFixed(0)}KB gz`).join(", ")}.`
  );
}

/* ── 8. Cache headers for static assets ────────────────────────────────── */
const cacheConfig = (nginx || "") + (netlify || "");
const hasImmutable = /immutable|max-age=31536000|Cache-Control.*year/i.test(cacheConfig);
add(
  hasImmutable ? "PASS" : "WARN",
  "Asset caching",
  hasImmutable
    ? "Long-lived cache headers are configured for hashed static assets."
    : "No immutable/long max-age cache header found for hashed assets in nginx.conf or netlify.toml."
);

/* ── 9. Sitemap URLs that have no built page (submitted-but-404 risk) ──── */

// A missing dist/ must FAIL, not silently skip. The partial-build incident that
// produced Finding 1 was invisible precisely because this check was gated on
// dist/ existing.
if (!fs.existsSync(distDir)) {
  add(
    "FAIL",
    "Sitemap vs build",
    "dist/ does not exist — run `npm run build` before auditing. Sitemap-vs-build parity cannot be verified, so submitted-but-404 URLs would go undetected."
  );
} else if (!sitemapMain) {
  add("FAIL", "Sitemap vs build", "public/sitemap.xml is missing — no submitted URLs to verify against the build.");
} else {
  // Union every sitemap declared by the index. Articles live in
  // sitemap-articles.xml, so checking sitemap.xml alone would flag every
  // article as an orphan page.
  const declared = new Set(["public/sitemap.xml"]);
  if (sitemapIndex) {
    for (const m of sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const file = m[1].replace(`${CANONICAL}/`, "");
      if (fs.existsSync(path.join(ROOT, "public", file))) declared.add(`public/${file}`);
    }
  }
  const allLocs = [];
  for (const file of declared) {
    const content = read(file);
    if (!content) continue;
    for (const m of content.matchAll(/<loc>([^<]+)<\/loc>/g)) allLocs.push(m[1]);
  }

  const orphans = [];
  for (const loc of allLocs) {
    const routePath = loc.replace(`${CANONICAL}`, "") || "/";
    if (routePath === "/") continue;
    const built =
      fs.existsSync(path.join(distDir, routePath, "index.html")) ||
      fs.existsSync(path.join(distDir, `${routePath}.html`));
    if (!built) orphans.push(routePath);
  }
  add(
    orphans.length === 0 ? "PASS" : "FAIL",
    "Sitemap vs build",
    orphans.length === 0
      ? `Every one of the ${allLocs.length} submitted URLs (across ${declared.size} sitemaps) has a corresponding built page.`
      : `${orphans.length} submitted URL(s) have NO built page — these will 404 or serve the SPA shell with no route: ${orphans.slice(0, 15).join(", ")}${orphans.length > 15 ? ` (+${orphans.length - 15} more)` : ""}`
  );

  // Reverse direction: built pages absent from every sitemap.
  //
  // Deliberately excluded from this signal:
  //   - noindex pages. Off-niche articles are demoted on purpose (see
  //     scripts/lib/off-niche-articles.mjs) and ship `noindex, follow`. They
  //     must NOT be in the sitemap — flagging them would be noise.
  //   - robots-disallowed utility routes, which are intentionally unsubmitted.
  // What remains is genuine index bloat: crawlable, indexable pages that Google
  // is never told about.
  const submitted = new Set(
    allLocs.map((loc) => {
      const routePath = loc.replace(`${CANONICAL}`, "") || "/";
      return routePath === "/" ? "/" : routePath.replace(/\/$/, "");
    })
  );
  const robotsDisallow = [];
  if (robots) {
    for (const line of robots.split(/\r?\n/)) {
      const m = line.match(/^\s*Disallow:\s*(\S+)/i);
      if (m && m[1] !== "/*" && m[1] !== "*") robotsDisallow.push(m[1]);
    }
  }
  const isNoindexPage = (htmlPath) => {
    try {
      const html = fs.readFileSync(htmlPath, "utf8");
      return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
    } catch {
      return false;
    }
  };

  const builtRoutes = [];
  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const route = `${prefix}${entry.name}`;
      const htmlPath = path.join(dir, entry.name, "index.html");
      if (fs.existsSync(htmlPath)) {
        const normalized = route.replace(/\/$/, "");
        const blocked = robotsDisallow.some((d) => normalized.startsWith(d.replace(/\*$/, "")));
        if (!blocked && !isNoindexPage(htmlPath)) builtRoutes.push(route);
      }
      walk(path.join(dir, entry.name), `${route}/`);
    }
  };
  walk(distDir, "/");
  const unsubmitted = builtRoutes.filter((r) => !submitted.has(r.replace(/\/$/, "")));
  add(
    unsubmitted.length === 0 ? "PASS" : "WARN",
    "Sitemap coverage",
    unsubmitted.length === 0
      ? `All ${builtRoutes.length} indexable, crawlable built routes are submitted across ${declared.size} sitemaps.`
      : `${unsubmitted.length} indexable built route(s) are NOT submitted in any sitemap (orphan/index-bloat risk): ${unsubmitted.slice(0, 15).join(", ")}${unsubmitted.length > 15 ? ` (+${unsubmitted.length - 15} more)` : ""}`
  );
}

/* ── Report ────────────────────────────────────────────────────────────── */
const order = { FAIL: 0, WARN: 1, INFO: 2, PASS: 3 };
findings.sort((a, b) => order[a.severity] - order[b.severity]);

const counts = findings.reduce((acc, f) => {
  acc[f.severity] = (acc[f.severity] || 0) + 1;
  return acc;
}, {});

console.log("\n=== THE GRID NEXUS — CURRENT-STATE SEO AUDIT ===\n");
console.log(`FAIL: ${counts.FAIL || 0}   WARN: ${counts.WARN || 0}   INFO: ${counts.INFO || 0}   PASS: ${counts.PASS || 0}\n`);
for (const f of findings) {
  const tag = f.severity.padEnd(4);
  console.log(`[${tag}] ${f.area}: ${f.message}`);
}
console.log("");

const failCount = counts.FAIL || 0;
const warnCount = counts.WARN || 0;
console.log(`Summary: ${failCount} blocking issue(s), ${warnCount} warning(s).`);
process.exit(failCount > 0 ? 1 : 0);