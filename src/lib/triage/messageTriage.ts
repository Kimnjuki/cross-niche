/**
 * Pure, self-contained scam-triage for message text (F03 / T07 extension).
 *
 * Detects red flags in a pasted message, game/mod name, or giveaway pitch
 * WITHOUT fetching anything. Complements domainTriage: URL/domain inputs go to
 * triageDomain; free-form text goes here. Safety properties:
 *   - "free X" currency/skin/item pitches are flagged as scams.
 *   - Urgency / scarcity pressure is flagged.
 *   - Requests for credentials, 2FA codes, or "verify your account" are flagged.
 *   - QR-code "verification" is flagged (session-theft pattern).
 *   - Cheat/hack/boosting/account-selling language is flagged.
 *   - No signals returns "no_known_indicators" — never "safe"/"clean".
 */

export type MessageVerdict =
  | "suspicious"
  | "no_known_indicators";

export interface MessageTriageResult {
  verdict: MessageVerdict;
  redFlags: string[];
  recommendedActions: string[];
  matchedCategory: string | null; // safety-verdict slug, when a category is recognized
}

interface Rule {
  category: string | null;
  flag: string;
  re: RegExp;
}

const RULES: Rule[] = [
  {
    category: "free-skin-generators",
    flag: "Promises free in-game currency, skins, or subscriptions.",
    re: /\b(free|unlimited|unlock)\b[^.\n]{0,40}\b(skins?|nitro|v-?bucks|riot points|rp|robux|gems?|coins?|gift cards?|keys?)\b/i,
  },
  {
    category: "free-gift-card-sites",
    flag: "Offers a free gift card or reward in exchange for a survey or 'verification'.",
    re: /\b(free|claim)\b[^.\n]{0,40}\b(gift ?cards?|steam ?cards?|psn ?codes?|xbox ?codes?)\b/i,
  },
  {
    category: "discord-verify-qr-scams",
    flag: "Asks you to scan a QR code or log in to 'verify' your account.",
    re: /\b(scan|qr ?code|verify (your )?(account|identity|age|human))\b/i,
  },
  {
    category: "steam-account-phishing",
    flag: "Asks for your password, login, or Steam Guard / 2FA code.",
    re: /\b(password|login|sign ?in|credentials|steam ?guard|2fa code|two-?factor code|auth code)\b/i,
  },
  {
    category: "fake-support-recovery",
    flag: "Offers paid account recovery or 'hack-back' services.",
    re: /\b(recover|recovery|unban|unlock|hack back|get (your )?account back)\b[^.\n]{0,40}\b(for a fee|paid|pay|purchase)\b|\b(i can|we can|guaranteed)\b[^.\n]{0,40}\b(recover|unban)\b/i,
  },
  {
    category: "free-game-cheats-aimbot",
    flag: "Promotes cheats, aimbots, or 'undetected' hacks.",
    re: /\b(aimbot|wallhack|esp hack|undetected cheat|free cheat|game hack|trainer)\b/i,
  },
  {
    category: "game-boosting-services",
    flag: "Offers account boosting, piloting, or rank-up services.",
    re: /\b(boosting|booster|pilot(ing)?|rank up|elo boost|climb)\b/i,
  },
  {
    category: "account-sellers",
    flag: "Offers to buy or sell game accounts.",
    re: /\b(buy(ing)?|sell(ing)?|for sale)\b[^.\n]{0,30}\b(accounts?|skins?|inventor(y|ies))\b|\b(accounts?|skins?)\b[^.\n]{0,20}\b(for sale|cheap|available)\b/i,
  },
  {
    category: null,
    flag: "Uses urgency or scarcity pressure to rush a decision.",
    re: /\b(act now|limited time|expires?|last chance|hurry|only today|24 ?hours|ends soon|don'?t miss)\b/i,
  },
];

/**
 * Extract the first URL-like token from free text (for forwarding to triageDomain).
 */
export function extractUrl(input: string): string | null {
  const m = input.match(/https?:\/\/[^\s"']+|[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s"']*)?/i);
  return m ? m[0] : null;
}

export function triageMessage(input: string): MessageTriageResult {
  const text = input.trim();
  const redFlags: string[] = [];
  let matchedCategory: string | null = null;

  for (const rule of RULES) {
    if (rule.re.test(text)) {
      redFlags.push(rule.flag);
      if (!matchedCategory && rule.category) matchedCategory = rule.category;
    }
  }

  if (redFlags.length === 0) {
    return {
      verdict: "no_known_indicators",
      redFlags: [],
      recommendedActions: [
        "No obvious scam patterns detected — but absence of red flags is not proof something is safe.",
        "Verify through an official channel before logging in, downloading, or sending anything.",
        "If it arrived as an unsolicited message, treat it with suspicion regardless.",
      ],
      matchedCategory: null,
    };
  }

  return {
    verdict: "suspicious",
    redFlags,
    recommendedActions: [
      "Do not click links, enter credentials, download anything, or approve requests.",
      "Do not send money, gift cards, or 2FA codes to anyone.",
      "Verify through an official channel, and warn others who received the same message.",
    ],
    matchedCategory,
  };
}
