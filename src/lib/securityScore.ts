/**
 * Security score normalisation.
 *
 * Editors and the CMS author `security_score` on a 0–100 scale (85, 92, 78 …),
 * while the UI renders it on a 0–5 scale (`{score}/5`) with colour thresholds at
 * 2 / 3 / 4. Rendering the raw value produced labels like "85/5" on every card.
 *
 * Normalise at the display boundary so both scales are accepted and nothing
 * out of range is ever printed.
 */
export function normalizeSecurityScore(score: number | null | undefined): number | null {
  if (score === null || score === undefined) return null;

  const value = Number(score);
  if (!Number.isFinite(value) || value <= 0) return null;

  // Already on the 0–5 scale the UI uses.
  if (value <= 5) return Math.round(value * 10) / 10;

  // 0–100 scale → 0–5 scale.
  if (value <= 100) return Math.round((value / 20) * 10) / 10;

  // Out of range: refuse to display rather than invent a plausible number.
  return null;
}

/** Ready-to-render label, e.g. "4.3/5", or null when nothing trustworthy exists. */
export function formatSecurityScore(score: number | null | undefined): string | null {
  const normalized = normalizeSecurityScore(score);
  return normalized === null ? null : `${normalized}/5`;
}
