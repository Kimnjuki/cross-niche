/**
 * Canonical site URL – used for redirects, metadata, and internal links.
 */
export const SITE_URL = import.meta.env.VITE_SITE_URL || `https://thegridnexus.com`;
export const isCanonicalHost = (host) => host === new URL(SITE_URL).host;
export const url = (path) => new URL(path, SITE_URL).href;
