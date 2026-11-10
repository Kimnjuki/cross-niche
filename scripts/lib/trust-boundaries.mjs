/**
 * Shared "What The Grid Nexus does not do" trust block for player-security pages.
 * Inject into scam-check, recovery, grades, verdicts, and threat report HTML.
 */
import { esc } from './static-chrome.mjs';

export const TRUST_BOUNDARIES = [
  'No account scanning — we do not connect to or inspect your game accounts.',
  'No credential collection — we never ask for passwords, MFA codes, recovery codes, cookies, or tokens.',
  'No guaranteed recovery — we route you to official platform processes; we do not recover accounts for you.',
  'No malware-clean guarantee — absence of known indicators is not proof a file or link is safe.',
  'No bypass assistance — we do not publish anti-cheat bypass, exploit, or cheat-evasion guidance.',
];

/**
 * @param {{ title?: string, compact?: boolean }} [opts]
 * @returns {string} HTML
 */
export function trustBoundariesHtml(opts = {}) {
  const title = opts.title ?? 'What The Grid Nexus does not do';
  const items = TRUST_BOUNDARIES.map((t) => `<li style="margin-bottom:0.4rem">${esc(t)}</li>`).join('');
  const pad = opts.compact ? '0.85rem 1rem' : '1rem 1.15rem';
  return `
    <aside aria-labelledby="trust-boundaries-heading" style="margin:1.5rem 0;padding:${pad};border:1px solid rgba(148,163,184,0.35);border-radius:0.75rem;background:rgba(15,23,42,0.55)">
      <h2 id="trust-boundaries-heading" style="font-size:1.05rem;margin:0 0 0.55rem;color:#f8fafc">${esc(title)}</h2>
      <ul style="margin:0;padding-left:1.2rem;color:#94a3b8;font-size:0.92rem;max-width:70ch">${items}</ul>
      <p style="margin:0.75rem 0 0;font-size:0.85rem;color:#64748b">See <a href="/privacy/tools">tool privacy</a>, <a href="/methodology">methodology</a>, and <a href="/corrections">corrections</a>.</p>
    </aside>`;
}
