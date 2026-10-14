/**
 * Pure, self-contained scam-triage domain checker (blueprint F03 / T07 MVP).
 *
 * Parses a URL or bare hostname and produces a conservative verdict WITHOUT
 * fetching anything. Safety properties (blueprint acceptance criteria):
 *   - Exact-host / dot-boundary matching: `steamcommunity.com.evil.com` and
 *     `evil-steamcommunity.com` never match `steamcommunity.com`.
 *   - Homograph detection: non-ASCII host characters are flagged as look-alikes.
 *   - Secret-token detection: token/reset/invite/signed URLs are flagged and
 *     blocked from submission (they are bearer-like, private artifacts).
 *   - Unknown domains return "insufficient_evidence" — never "safe" or "clean".
 *   - HTTPS, domain age, and "no detections" are never treated as proof of trust.
 */

export type TriageVerdict =
  | "known_malicious"
  | "suspicious"
  | "no_known_indicators"
  | "insufficient_evidence";

export interface OfficialDomain {
  host: string; // exact canonical host, lowercase
  label: string; // e.g. "Steam"
}

export interface KnownBadIndicator {
  host: string; // exact host or suffix, lowercase
  label: string;
}

export interface TriageResult {
  verdict: TriageVerdict;
  reasons: string[];
  normalizedHost: string | null;
  matchedOfficial: string | null;
  matchedBad: string | null;
  hasSecretToken: boolean;
  blockSubmission: boolean;
  recommendedActions: string[];
}

/** Token-like query params / fragments that must never leave the client. */
const TOKEN_PARAM_RE =
  /[?&#](?:token|access_token|reset_token|password_reset|invite|invite_code|code|ticket|login_ticket|session|session_id|auth|sig|signature|x-amz-signature|expires|key)=/i;

/** Lowercase + strip scheme/port/path; returns the punycode hostname or null. */
export function normalizeHostname(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  let u: URL;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `http://${s}`);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  if (!host) return null;
  return host;
}

/** True if the raw input contains non-ASCII characters (homograph risk). */
export function detectHomograph(input: string): boolean {
  return /[^\x00-\x7F]/.test(input);
}

/** True if the URL carries a token/one-time-code/signed parameter. */
export function detectSecretToken(input: string): boolean {
  return TOKEN_PARAM_RE.test(input);
}

/** host === official, or a real subdomain of it (dot boundary enforced). */
export function isOfficialHost(host: string, officialHost: string): boolean {
  return host === officialHost || host.endsWith("." + officialHost);
}

export function triageDomain(
  input: string,
  officialDomains: OfficialDomain[],
  knownBad: KnownBadIndicator[]
): TriageResult {
  const reasons: string[] = [];
  const actions: string[] = [];
  const hasSecretToken = detectSecretToken(input);
  const blockSubmission = hasSecretToken;

  const host = normalizeHostname(input);

  if (!host) {
    return {
      verdict: "insufficient_evidence",
      reasons: ["Could not parse a hostname from the input."],
      normalizedHost: null,
      matchedOfficial: null,
      matchedBad: null,
      hasSecretToken,
      blockSubmission,
      recommendedActions: ["Paste the domain only (e.g. steamcommunity.com), without a full login or reset link."],
    };
  }

  if (detectHomograph(input)) {
    reasons.push("The domain uses non-ASCII characters — a common look-alike (homograph) spoof.");
  }

  const bad = knownBad.find((b) => isOfficialHost(host, b.host));
  if (bad) {
    return {
      verdict: "known_malicious",
      reasons: [...reasons, `Matches a known-bad indicator: ${bad.label}.`],
      normalizedHost: host,
      matchedOfficial: null,
      matchedBad: bad.label,
      hasSecretToken,
      blockSubmission,
      recommendedActions: [
        "Do not enter credentials, download anything, or approve requests.",
        "Report it and warn anyone else who may have received the same link.",
      ],
    };
  }

  const official = officialDomains.find((o) => isOfficialHost(host, o.host));
  if (official) {
    return {
      verdict: "no_known_indicators",
      reasons: [
        ...reasons,
        `This is (or is a subdomain of) the official ${official.label} domain.`,
        ...(hasSecretToken ? ["This link carries a token or one-time code — treat it as private."] : []),
      ],
      normalizedHost: host,
      matchedOfficial: official.label,
      matchedBad: null,
      hasSecretToken,
      blockSubmission,
      recommendedActions: [
        ...(hasSecretToken ? ["Do not paste this link anywhere; it may grant access to your account."] : []),
        "Confirm you reached it directly (typed/known bookmark), not via a link in a message.",
      ],
    };
  }

  if (hasSecretToken) {
    reasons.push("This link carries a token or one-time code — treat it as private and do not share it.");
    actions.push("Do not paste this link anywhere; it may grant access to your account.");
  }

  return {
    verdict: "insufficient_evidence",
    reasons: [...reasons, "Domain is not on the official or known-bad list — no conclusion can be drawn."],
    normalizedHost: host,
    matchedOfficial: null,
    matchedBad: null,
    hasSecretToken,
    blockSubmission,
    recommendedActions: [
      ...actions,
      "If you were directed here by a message or giveaway, verify through an official channel first.",
    ],
  };
}
