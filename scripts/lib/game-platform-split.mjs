/**
 * Account platforms that were graded inside the game library.
 * Their canonical page is the platform security hub, not /games/{slug}.
 * Nintendo Switch Online stays on /games — there is no Nintendo hub to send it to.
 */
export const PLATFORM_GRADE_REDIRECTS = {
  steam: '/platforms/steam/security',
  discord: '/platforms/discord/security',
  'playstation-network': '/platforms/playstation/security',
};

/** Platform-hub slug → game-library slug that carries the documented grade. */
export const PLATFORM_SLUG_TO_GRADE_SLUG = {
  steam: 'steam',
  discord: 'discord',
  playstation: 'playstation-network',
};

export function isRedirectedGameSlug(slug) {
  return Object.prototype.hasOwnProperty.call(PLATFORM_GRADE_REDIRECTS, slug);
}

export function canonicalGradePath(slug) {
  return PLATFORM_GRADE_REDIRECTS[slug] || `/games/${slug}`;
}

export function gradeSourceSlugForPlatform(platformSlug) {
  return PLATFORM_SLUG_TO_GRADE_SLUG[platformSlug] || null;
}

export function entityTypeForGrade(game) {
  if (isRedirectedGameSlug(game?.slug)) return 'platform';
  if ((game?.genres || []).includes('platform')) return 'account-service';
  return 'game';
}

export function reviewedDate(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}
