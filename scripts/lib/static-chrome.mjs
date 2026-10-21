/**
 * Shared static-page chrome for server-rendered HTML shells.
 *
 * The SPA (React) pages get the full Navbar/Footer via <Layout>. The static
 * shells (/safety, /games, /recover, /platforms, /threats, trust pages, ...)
 * are standalone HTML and previously carried a minimal inline header. This
 * module provides ONE consistent, futuristic navbar + footer + CSS so every
 * page — SPA and static alike — shares the same chrome.
 *
 * Usage (in a generator):
 *   import { staticShell } from './lib/static-chrome.mjs';
 *   staticShell(title, description, canonical, body, jsonLd, activePath)
 */

export const SITE_NAME = 'The Grid Nexus';
export const BASE_URL = 'https://thegridnexus.com';

export const NAV_LINKS = [
  { href: '/gaming', label: 'Gaming Security' },
  { href: '/games', label: 'Security Grades' },
  { href: '/safety', label: 'Is it safe?' },
  { href: '/threats', label: 'Threat Report' },
  { href: '/recover', label: 'Recovery' },
  { href: '/tools/scam-check', label: 'Scam Checker' },
  { href: '/tools/gaming-security-checkup', label: 'Checkup' },
];

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CSS = `
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', 'Manrope', system-ui, sans-serif; background: #0A0A0B; color: #e2e8f0; line-height: 1.65; }
    h1, h2, h3, h4 { font-family: 'Space Grotesk', 'Inter Tight', system-ui, sans-serif; letter-spacing: -0.02em; color: #f8fafc; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    a { color: #00F0FF; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .site-nav { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(10, 10, 11, 0.82); border-bottom: 1px solid rgba(255, 255, 255, 0.07); }
    .site-nav-inner { max-width: 80rem; margin: 0 auto; padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .site-logo { display: inline-flex; align-items: center; gap: 0.55rem; color: #f8fafc; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.05rem; text-decoration: none; }
    .site-logo:hover { text-decoration: none; }
    .site-logo-mark { width: 1.5rem; height: 1.5rem; border-radius: 0.45rem; background: linear-gradient(135deg, #00F0FF 0%, #A855F7 55%, #FFB800 100%); display: inline-flex; align-items: center; justify-content: center; }
    .site-logo-mark-inner { width: 0.85rem; height: 0.85rem; border-radius: 0.3rem; background: rgba(255,255,255,0.35); }
    .site-nav-links { display: flex; align-items: center; gap: 1.15rem; flex-wrap: wrap; font-size: 0.92rem; }
    .site-nav-links a { color: #94a3b8; text-decoration: none; transition: color 0.15s ease; }
    .site-nav-links a:hover { color: #00F0FF; text-decoration: none; }
    .site-nav-links a.active { color: #00F0FF; }
    .site-wrap { max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem 3rem; background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 240, 255, 0.05), transparent); }
    .site-footer { border-top: 1px solid rgba(255, 255, 255, 0.07); background: linear-gradient(180deg, #0A0A0B 0%, #000 100%); }
    .site-footer-inner { max-width: 80rem; margin: 0 auto; padding: 1.75rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: #64748b; }
    .site-footer-links { display: flex; gap: 1.25rem; flex-wrap: wrap; }
    .site-footer-links a { color: #94a3b8; }
    .site-footer-links a:hover { color: #00F0FF; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

function isActive(href, activePath) {
  if (!activePath) return false;
  if (href === '/') return activePath === '/';
  return activePath === href || activePath.startsWith(href + '/');
}

export const chromeCss = CSS;

export function navHtml(activePath) {
  const links = NAV_LINKS.map((l) => {
    const active = isActive(l.href, activePath);
    return `<a href="${l.href}"${active ? ' class="active"' : ''}>${esc(l.label)}</a>`;
  }).join('');
  return `<nav class="site-nav" aria-label="Primary">
    <div class="site-nav-inner">
      <a href="/" class="site-logo" aria-label="${SITE_NAME} home">
        <span class="site-logo-mark"><span class="site-logo-mark-inner"></span></span>
        ${SITE_NAME}
      </a>
      <div class="site-nav-links">${links}</div>
    </div>
  </nav>`;
}

export function footerHtml() {
  return `<footer class="site-footer">
    <div class="site-footer-inner">
      <span>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</span>
      <div class="site-footer-links">
        <a href="/about">About</a>
        <a href="/methodology">Methodology</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/recover">Recovery</a>
      </div>
    </div>
  </footer>`;
}

/**
 * Full standalone HTML shell with the shared navbar + footer + futuristic CSS.
 * jsonLd may be a single object or an array (rendered as multiple JSON-LD scripts).
 */
export function staticShell(title, description, canonical, body, jsonLd, activePath) {
  const scripts = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    .filter(Boolean)
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join('\n    ');
  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:image" content="https://thegridnexus.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${SITE_NAME} — gaming security for players" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="https://thegridnexus.com/og-image.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>${CSS}</style>
    ${scripts}
  </head>
  <body>
    ${navHtml(activePath)}
    <div class="site-wrap">${body}</div>
    ${footerHtml()}
  </body>
</html>`;
}
