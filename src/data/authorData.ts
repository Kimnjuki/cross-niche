/**
 * Author registry for E-E-A-T (Experience, Expertise, Authoritativeness, Trust).
 *
 * Honesty policy: only real, verifiable people are listed. Invented personas
 * with fabricated credentials ("Dr. X", fake CISSP/Ph.D. bios, fake social
 * handles) were removed — a solo operator's single honest byline outperforms
 * invented experts and is not a trust/legal liability.
 */
export interface AuthorProfile {
  name: string;
  jobTitle: string;
  bio: string;
  expertise: string[];
  imageUrl?: string;
  sameAs?: string[];
}

/** Author profiles keyed by slug. */
export const authorProfiles: Record<string, AuthorProfile> = {
  'kim-njuki': {
    name: 'Kim Njuki',
    jobTitle: 'Founder & Editor',
    bio: 'Kim Njuki founded The Grid Nexus to give players plain-language answers to one question: "is this safe, and what do I do right now?" Coverage focuses on gaming account protection, scam awareness, and platform-specific security guidance. Every factual claim cites a primary source — official vendor documentation or published security research — and carries the date it was verified.',
    expertise: ['Gaming Security', 'Account Protection', 'Online Safety'],
  },
};

/** Default profile for articles without an individual byline. */
export const defaultAuthorProfile: AuthorProfile = {
  name: 'Kim Njuki',
  jobTitle: 'Founder & Editor',
  bio: 'Kim Njuki founded The Grid Nexus to give players plain-language answers to one question: "is this safe, and what do I do right now?" Coverage focuses on gaming account protection, scam awareness, and platform-specific security guidance, with claims cited to primary sources.',
  expertise: ['Gaming Security', 'Account Protection', 'Online Safety'],
};

export function getAuthorProfile(slug: string | undefined): AuthorProfile | null {
  if (!slug || slug === 'anonymous') return null;
  const normalized = slug.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return authorProfiles[normalized] ?? null;
}
