/**
 * Render a live article page in Chromium and report the *actual* DOM structure.
 *
 * The site is a client-rendered SPA, so fetching the HTML proves nothing: the
 * 31 KB index.html shell is byte-identical for every route. This script boots a
 * real browser, waits for the article body, and reports the defects that a
 * crawl/text-extraction of the page exposes:
 *
 *   - duplicated share/header blocks (inline + floating rows)
 *   - non-deterministic view/share counters
 *   - TOC entries that do not match real headings (leaked body paragraphs)
 *   - lists flattened into literal "•" / "-" runs inside a single <p>
 *   - duplicate FAQ blocks / boilerplate fallback FAQs
 *   - broken images, "x/5" score labels
 *
 * Run: node scripts/diagnose-live-article.mjs [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'https://thegridnexus.com/article/mobile-gaming-security-guide';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 240));
});
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message.slice(0, 240)));

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForSelector('[data-article-content]', { timeout: 45_000 }).catch(() => {});
await page.waitForTimeout(4000);

const report = await page.evaluate(() => {
  const text = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const all = (sel) => Array.from(document.querySelectorAll(sel));

  // ---- share / header blocks -------------------------------------------------
  // Leaf-level only: an ancestor contains the same text, so requiring that no
  // child element repeats the signature counts each rendered bar exactly once.
  const signature = (el) => /share this article/i.test(text(el)) && /more sharing options/i.test(text(el));
  const shareBlocks = all('div')
    .filter((d) => signature(d) && !Array.from(d.children).some((c) => signature(c)))
    .map((d) => {
      const r = d.getBoundingClientRect();
      const cs = getComputedStyle(d);
      return {
        classes: String(d.className).slice(0, 120),
        position: cs.position,
        display: cs.display,
        rendered: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden',
        inViewport: r.top < window.innerHeight && r.bottom > 0,
        rect: { top: Math.round(r.top + window.scrollY), left: Math.round(r.left), height: Math.round(r.height) },
        counter: (text(d).match(/([\d,]+)\s*views\s*([\d,]+)\s*shares/i) ?? []).slice(1),
      };
    });

  // ---- article body ----------------------------------------------------------
  const body = document.querySelector('[data-article-content]');
  const bodyHtml = body?.innerHTML ?? '';
  const paragraphsWithLiterals = all('[data-article-content] p')
    .filter((p) => /[•]/.test(p.textContent ?? '') || /(^|\s)-(?=\s[A-Z])/.test(p.textContent ?? ''))
    .map((p) => text(p).slice(0, 160));

  const headings = all('[data-article-content] h1, [data-article-content] h2, [data-article-content] h3, [data-article-content] h4').map(
    (h) => ({ tag: h.tagName, id: h.id || null, text: text(h).slice(0, 90) }),
  );

  // ---- TOC -------------------------------------------------------------------
  const toc = all('nav.toc a').map((a) => ({ href: a.getAttribute('href'), text: text(a).slice(0, 90) }));
  const headingIds = new Set(headings.map((h) => h.id).filter(Boolean));
  const tocBroken = toc.filter((t) => !headingIds.has((t.href ?? '').replace('#', '')));

  // ---- broken in-page anchors (TOC jump links) -------------------------------
  const anchorTargets = all('a[href^="#"]')
    .map((a) => a.getAttribute('href').slice(1))
    .filter(Boolean);
  const brokenAnchors = anchorTargets.filter((id) => !document.getElementById(id));

  // ---- FAQ -------------------------------------------------------------------
  const faqSections = all('section')
    .filter((s) => /frequently asked questions/i.test(text(s)))
    .map((s) => ({
      title: text(s.querySelector('h2') ?? s).slice(0, 120),
      questions: all('span.font-semibold, button', s).length,
    }));
  const faqPhraseCount = (text(document.body).match(/frequently asked questions/gi) ?? []).length;

  // ---- images / scores -------------------------------------------------------
  const brokenImages = all('img')
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute('src'));

  const scoreLabels = Array.from(document.body.innerText.matchAll(/\b(\d+)\/5\b/g))
    .map((m) => m[0])
    .slice(0, 12);

  // ---- mock / demo content leaking into production ---------------------------
  const mockTitles = ['GTA VI: Everything We Know', 'Elden Ring DLC Breaks Sales Records', 'Nintendo Switch 2 Specs Confirmed', 'Esports World Championship 2024'];
  const leakedMock = mockTitles.filter((t) => text(document.body).includes(t));

  return {
    url: location.href,
    title: document.title,
    h1: all('h1').map(text),
    shareBlocks,
    shareBlockCount: shareBlocks.length,
    bodyTextChars: text(body).length,
    bodyCounts: {
      h2: all('[data-article-content] h2').length,
      h3: all('[data-article-content] h3').length,
      ul: all('[data-article-content] ul').length,
      li: all('[data-article-content] li').length,
      img: all('[data-article-content] img').length,
    },
    paragraphsWithBulletLiterals: paragraphsWithLiterals,
    headings,
    tocCount: toc.length,
    tocFirstFive: toc.slice(0, 5),
    tocBroken,
    brokenAnchors,
    faqSections,
    faqPhraseCount,
    brokenImages,
    scoreLabels,
    leakedMockArticles: leakedMock,
    consoleErrors: [],
  };
});

report.consoleErrors = consoleErrors;
console.log(JSON.stringify(report, null, 2));
await browser.close();
