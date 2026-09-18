/**
 * Shared authorData.ts reader for build-time generators.
 *
 * src/data/authorData.ts is TypeScript, so plain `node scripts/*.mjs` cannot
 * import it (no type-stripping on the Node versions this repo supports). The
 * generator scripts therefore used to reference author pages "dynamically from
 * authorData" but never actually emitted them — leaving /author/* URLs out of
 * both sitemap.xml and prerender-routes.json.
 *
 * This module extracts the two exported author object literals directly from
 * the TS source text. Both literals are plain JSON-safe objects (no TS syntax
 * inside the braces), so a scoped `new Function` evaluation is exact and safe:
 * the input file is repo-owned build-time source, never user input.
 *
 * Consumers: generate-seo-sitemaps.mjs, generate-prerender-routes.mjs,
 * generate-static-authors.mjs
 */
import fs from 'fs';
import path from 'path';
import { projectRoot } from './mock-content.mjs';

const AUTHOR_DATA_PATH = path.join(projectRoot, 'src', 'data', 'authorData.ts');

const FALLBACK_PROFILE = {
  name: 'The Grid Nexus Editorial Team',
  jobTitle: 'Editorial Team',
  bio: 'Our editorial team brings together experts in technology, cybersecurity, and gaming to deliver accurate, timely, and insightful coverage.',
  expertise: ['Technology', 'Cybersecurity', 'Gaming', 'News'],
};

/**
 * Capture the balanced `{ ... }` object literal that follows `export const <name>`.
 * Brace counting is string-aware so braces inside bios/social URLs never unbalance.
 */
function extractObjectLiteral(source, exportName) {
  const anchor = source.indexOf(`export const ${exportName}`);
  if (anchor === -1) return null;

  const start = source.indexOf('{', anchor);
  if (start === -1) return null;

  let depth = 0;
  let quote = null;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      if (ch === '\\') {
        i += 1; // skip the escaped character
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return null;
}

function evaluateLiteral(literal) {
   
  return new Function(`"use strict"; return (${literal});`)();
}

let cache = null;

/**
 * Read the author registry.
 * @returns {{ profiles: Record<string, object>, defaultProfile: object, source: string }}
 */
export function loadAuthorProfiles() {
  if (cache) return cache;

  if (!fs.existsSync(AUTHOR_DATA_PATH)) {
    cache = { profiles: {}, defaultProfile: FALLBACK_PROFILE, source: 'fallback' };
    return cache;
  }

  try {
    const source = fs.readFileSync(AUTHOR_DATA_PATH, 'utf8');
    const profilesLiteral = extractObjectLiteral(source, 'authorProfiles');
    const defaultLiteral = extractObjectLiteral(source, 'defaultAuthorProfile');

    cache = {
      profiles: profilesLiteral ? evaluateLiteral(profilesLiteral) : {},
      defaultProfile: defaultLiteral
        ? { ...FALLBACK_PROFILE, ...evaluateLiteral(defaultLiteral) }
        : FALLBACK_PROFILE,
      source: 'authorData.ts',
    };
  } catch (error) {
    console.warn(`[author-source] could not parse authorData.ts (${error.message}); using fallback`);
    cache = { profiles: {}, defaultProfile: FALLBACK_PROFILE, source: 'fallback' };
  }

  return cache;
}

/** Convenience accessor mirroring the old `authorProfiles` import. */
export const authorProfiles = loadAuthorProfiles().profiles;

/** Convenience accessor mirroring the old `defaultAuthorProfile` import. */
export const defaultAuthorProfile = loadAuthorProfiles().defaultProfile;

/** Normalise an author display name into its registry slug. */
export function authorSlug(name) {
  return String(name ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export const AUTHOR_DATA_PATH_RESOLVED = AUTHOR_DATA_PATH;
