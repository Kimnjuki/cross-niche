/**
 * CanonicalLink — NO-OP component.
 *
 * SEOHead.tsx already manages <link rel="canonical"> for ALL pages (including
 * article, category, and static routes). Having both components write the
 * canonical tag creates a race condition and is flagged by Sitechecker as
 * "Multiple canonical tags" across 142 pages.
 *
 * This component exists solely to satisfy the import in App.tsx without
 * breaking the dependency graph. It renders nothing and writes nothing.
 */

export const CanonicalLink = () => {
  return null;
};
