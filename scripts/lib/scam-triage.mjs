/**
 * Node/browser-safe scam triage (mirrors src/lib/triage/*.ts).
 * Used by generate-scam-check-page.mjs and the vanilla progressive-enhancement island.
 * Never fetches URLs. Unknown domains → insufficient_evidence, never "safe".
 */

export const TOKEN_PARAM_RE =
  /[?&#](?:token|access_token|reset_token|password_reset|invite|invite_code|code|ticket|login_ticket|session|session_id|auth|sig|signature|x-amz-signature|expires|key)=/i;

const MESSAGE_RULES = [
  {
    category: 'free-skin-generators',
    flag: 'Promises free in-game currency, skins, or subscriptions.',
    re: /\b(free|unlimited|unlock)\b[^.\n]{0,40}\b(skins?|nitro|v-?bucks|riot points|rp|robux|gems?|coins?|gift cards?|keys?)\b/i,
  },
  {
    category: 'free-gift-card-sites',
    flag: "Offers a free gift card or reward in exchange for a survey or 'verification'.",
    re: /\b(free|claim)\b[^.\n]{0,40}\b(gift ?cards?|steam ?cards?|psn ?codes?|xbox ?codes?)\b/i,
  },
  {
    category: 'discord-verify-qr-scams',
    flag: "Asks you to scan a QR code or log in to 'verify' your account.",
    re: /\b(scan|qr ?code|verify (your )?(account|identity|age|human))\b/i,
  },
  {
    category: 'steam-account-phishing',
    flag: 'Asks for your password, login, or Steam Guard / 2FA code.',
    re: /\b(password|login|sign ?in|credentials|steam ?guard|2fa code|two-?factor code|auth code)\b/i,
  },
  {
    category: 'fake-support-recovery',
    flag: "Offers paid account recovery or 'hack-back' services.",
    re: /\b(recover|recovery|unban|unlock|hack back|get (your )?account back)\b[^.\n]{0,40}\b(for a fee|paid|pay|purchase)\b|\b(i can|we can|guaranteed)\b[^.\n]{0,40}\b(recover|unban)\b/i,
  },
  {
    category: 'free-game-cheats-aimbot',
    flag: "Promotes cheats, aimbots, or 'undetected' hacks.",
    re: /\b(aimbot|wallhack|esp hack|undetected cheat|free cheat|game hack|trainer)\b/i,
  },
  {
    category: 'game-boosting-services',
    flag: 'Offers account boosting, piloting, or rank-up services.',
    re: /\b(boosting|booster|pilot(ing)?|rank up|elo boost|climb)\b/i,
  },
  {
    category: 'account-sellers',
    flag: 'Offers to buy or sell game accounts.',
    re: /\b(buy(ing)?|sell(ing)?|for sale)\b[^.\n]{0,30}\b(accounts?|skins?|inventor(y|ies))\b|\b(accounts?|skins?)\b[^.\n]{0,20}\b(for sale|cheap|available)\b/i,
  },
  {
    category: null,
    flag: 'Uses urgency or scarcity pressure to rush a decision.',
    re: /\b(act now|limited time|expires?|last chance|hurry|only today|24 ?hours|ends soon|don'?t miss)\b/i,
  },
];

export function normalizeHostname(input) {
  const s = String(input ?? '').trim();
  if (!s) return null;
  let u;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `http://${s}`);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  return host || null;
}

export function detectHomograph(input) {
  return /[^\x00-\x7F]/.test(String(input ?? ''));
}

export function detectSecretToken(input) {
  return TOKEN_PARAM_RE.test(String(input ?? ''));
}

export function isOfficialHost(host, officialHost) {
  return host === officialHost || host.endsWith('.' + officialHost);
}

export function extractUrl(input) {
  const m = String(input ?? '').match(
    /https?:\/\/[^\s"']+|[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s"']*)?/i
  );
  return m ? m[0] : null;
}

export function triageDomain(input, officialDomains = [], knownBad = []) {
  const reasons = [];
  const actions = [];
  const hasSecretToken = detectSecretToken(input);
  const blockSubmission = hasSecretToken;
  const host = normalizeHostname(input);

  if (!host) {
    return {
      verdict: 'insufficient_evidence',
      reasons: ['Could not parse a hostname from the input.'],
      normalizedHost: null,
      matchedOfficial: null,
      matchedBad: null,
      hasSecretToken,
      blockSubmission,
      recommendedActions: [
        'Paste the domain only (e.g. steamcommunity.com), without a full login or reset link.',
      ],
    };
  }

  if (detectHomograph(input)) {
    reasons.push(
      'The domain uses non-ASCII characters — a common look-alike (homograph) spoof.'
    );
  }

  const bad = knownBad.find((b) => isOfficialHost(host, b.host));
  if (bad) {
    return {
      verdict: 'known_malicious',
      reasons: [...reasons, `Matches a known-bad indicator: ${bad.label}.`],
      normalizedHost: host,
      matchedOfficial: null,
      matchedBad: bad.label,
      hasSecretToken,
      blockSubmission,
      recommendedActions: [
        'Do not enter credentials, download anything, or approve requests.',
        'Report it and warn anyone else who may have received the same link.',
        'If you already interacted with it, open the Recovery Navigator.',
      ],
    };
  }

  const official = officialDomains.find((o) => isOfficialHost(host, o.host));
  if (official) {
    return {
      verdict: 'no_known_indicators',
      reasons: [
        ...reasons,
        `This is (or is a subdomain of) the official ${official.label} domain.`,
        ...(hasSecretToken
          ? ['This link carries a token or one-time code — treat it as private.']
          : []),
      ],
      normalizedHost: host,
      matchedOfficial: official.label,
      matchedBad: null,
      hasSecretToken,
      blockSubmission,
      recommendedActions: [
        ...(hasSecretToken
          ? ['Do not paste this link anywhere; it may grant access to your account.']
          : []),
        'Confirm you reached it directly (typed/known bookmark), not via a link in a message.',
      ],
    };
  }

  if (hasSecretToken) {
    reasons.push(
      'This link carries a token or one-time code — treat it as private and do not share it.'
    );
    actions.push(
      'Do not paste this link anywhere; it may grant access to your account.'
    );
  }

  return {
    verdict: 'insufficient_evidence',
    reasons: [
      ...reasons,
      'Domain is not on the official or known-bad list — no conclusion can be drawn.',
    ],
    normalizedHost: host,
    matchedOfficial: null,
    matchedBad: null,
    hasSecretToken,
    blockSubmission,
    recommendedActions: [
      ...actions,
      'If you were directed here by a message or giveaway, verify through an official channel first.',
      'Absence of known indicators is not proof this domain is safe.',
    ],
  };
}

export function triageMessage(input) {
  const text = String(input ?? '').trim();
  const redFlags = [];
  let matchedCategory = null;

  for (const rule of MESSAGE_RULES) {
    if (rule.re.test(text)) {
      redFlags.push(rule.flag);
      if (!matchedCategory && rule.category) matchedCategory = rule.category;
    }
  }

  if (redFlags.length === 0) {
    return {
      verdict: 'no_known_indicators',
      redFlags: [],
      recommendedActions: [
        'No obvious scam patterns detected — but absence of red flags is not proof something is safe.',
        'Verify through an official channel before logging in, downloading, or sending anything.',
        'If it arrived as an unsolicited message, treat it with suspicion regardless.',
      ],
      matchedCategory: null,
    };
  }

  return {
    verdict: 'suspicious',
    redFlags,
    recommendedActions: [
      'Do not click links, enter credentials, download anything, or approve requests.',
      'Do not send money, gift cards, or 2FA codes to anyone.',
      'Verify through an official channel, and warn others who received the same message.',
      'If you already shared credentials or codes, open the Recovery Navigator.',
    ],
    matchedCategory,
  };
}

/**
 * Combined triage for the SSR/vanilla tool.
 * @returns {{ kind: 'domain'|'message', result: object, embeddedDomain?: object }}
 */
export function triageInput(raw, officialDomains = [], knownBad = [], kindHint = 'auto') {
  const text = String(raw ?? '').trim();
  if (!text) {
    return {
      kind: 'message',
      result: {
        verdict: 'insufficient_evidence',
        reasons: ['No input provided.'],
        recommendedActions: ['Paste a domain, URL, or message to check.'],
        redFlags: [],
        matchedCategory: null,
        blockSubmission: false,
        normalizedHost: null,
      },
    };
  }

  const singleToken = !/\s/.test(text);
  const looksDomain =
    /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/\S*)?$/i.test(text) || Boolean(extractUrl(text));
  const asDomain =
    kindHint === 'domain' || (kindHint === 'auto' && singleToken && looksDomain);

  if (asDomain) {
    const domainResult = triageDomain(text, officialDomains, knownBad);
    return { kind: 'domain', result: domainResult };
  }

  const msg = triageMessage(text);
  const url = extractUrl(text);
  let embeddedDomain = null;
  if (url) {
    embeddedDomain = triageDomain(url, officialDomains, knownBad);
    if (
      msg.verdict === 'no_known_indicators' &&
      (embeddedDomain.verdict === 'known_malicious' ||
        embeddedDomain.verdict === 'suspicious' ||
        embeddedDomain.blockSubmission)
    ) {
      return { kind: 'domain', result: embeddedDomain, embeddedFromMessage: true };
    }
  }

  return {
    kind: 'message',
    result: {
      ...msg,
      reasons: msg.redFlags,
      blockSubmission: false,
      normalizedHost: embeddedDomain?.normalizedHost ?? null,
    },
    embeddedDomain,
  };
}

export const VERDICT_COPY = {
  known_malicious: {
    label: 'known_malicious',
    headline: 'Known malicious indicator',
    tone: '#f87171',
  },
  suspicious: {
    label: 'suspicious',
    headline: 'Suspicious patterns detected',
    tone: '#fbbf24',
  },
  no_known_indicators: {
    label: 'no_known_indicators',
    headline: 'No known indicators (not a safety clearance)',
    tone: '#34d399',
  },
  insufficient_evidence: {
    label: 'insufficient_evidence',
    headline: 'Insufficient evidence — do not treat as safe',
    tone: '#94a3b8',
  },
  provider_unavailable: {
    label: 'provider_unavailable',
    headline: 'External reputation lookup unavailable',
    tone: '#94a3b8',
  },
};
