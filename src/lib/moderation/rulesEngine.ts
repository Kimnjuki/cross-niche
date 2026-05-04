export type Category = 'profanity' | 'harassment' | 'spam' | 'pii' | 'nsfw';

export interface RuleHit {
  ruleId: string;
  category: Category;
  severity: 'low' | 'medium' | 'high';
  description: string;
  snippet?: string;
}

export interface ModerationResult {
  verdict: 'approved' | 'flagged' | 'removed';
  scores: Record<Category, number>;
  ruleHits: RuleHit[];
  analyzedAt: number;
  inputLengthChars: number;
}

// Promotional keywords
const PROMO_KEYWORDS = ['buy now', 'click here', 'free', 'limited time', 'act now', 'subscribe', 'check this out', 'dm me', 'link in bio'];

// URL pattern
const URL_RE = /https?:\/\/[^\s,)]+/gi;

function extractSnippet(text: string, pattern: RegExp, contextChars = 30): string {
  const match = text.match(pattern);
  if (!match) return '';
  const idx = text.indexOf(match[0]);
  if (idx === -1) return match[0].slice(0, 50);
  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + match[0].length + contextChars);
  const snippet = text.slice(start, end);
  if (start > 0) return '...' + snippet;
  return snippet;
}

export function moderateText(text: string): ModerationResult {
  const scores: Record<Category, number> = { profanity: 0, harassment: 0, spam: 0, pii: 0, nsfw: 0 };
  const ruleHits: RuleHit[] = [];
  const wordCount = text.split(/\s+/).length;
  const lower = text.toLowerCase();

  // ── Profanity ──────────────────────────────────────────────
  const PROFANITY_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'bastard', 'damn', 'crap', 'dick', 'piss', 'slut', 'whore'];
  let profanityCount = 0;
  for (const word of PROFANITY_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      profanityCount += matches.length;
      ruleHits.push({
        ruleId: `profanity_${word}`,
        category: 'profanity',
        severity: profanityCount > 2 ? 'high' : profanityCount > 1 ? 'medium' : 'low',
        description: `Detected profanity: "${word}"`,
        snippet: extractSnippet(text, regex),
      });
    }
  }
  scores.profanity = Math.min(1, profanityCount / Math.max(1, wordCount / 5));

  // ── Harassment ─────────────────────────────────────────────
  const HARASSMENT_PATTERNS = [
    { id: 'kill_yourself', pattern: /\b(kill yourself|kys|end yourself)\b/gi, severity: 'high' as const },
    { id: 'death_threat', pattern: /\b(i will (hurt|find|kill|destroy) you|you should die|hope you die)\b/gi, severity: 'high' as const },
    { id: 'personal_attack', pattern: /\byou are (a |an )?(idiot|moron|piece of shit|waste)\b/gi, severity: 'medium' as const },
    { id: 'slur', pattern: /\b(n[ie]gg[ae]r|f[a4]gg?ot|r[et]ard|tr[ea]nn?y)\b/gi, severity: 'high' as const },
    { id: 'threat_physical', pattern: /\b(i('ll| will) beat|punch|stab|shoot|hit) you\b/gi, severity: 'high' as const },
  ];
  for (const { id, pattern, severity } of HARASSMENT_PATTERNS) {
    if (pattern.test(text)) {
      ruleHits.push({
        ruleId: id,
        category: 'harassment',
        severity,
        description: `Detected harassment pattern: ${id.replace(/_/g, ' ')}`,
        snippet: extractSnippet(text, pattern),
      });
    }
  }
  const harassmentHitCount = ruleHits.filter(h => h.category === 'harassment').length;
  scores.harassment = Math.min(1, harassmentHitCount * 0.4);

  // ── Spam ───────────────────────────────────────────────────
  const urls = text.match(URL_RE) || [];
  const capsChars = (text.match(/[A-Z]/g) || []).length;
  const alphaChars = (text.match(/[a-zA-Z]/g) || []).length;
  const capsRatio = alphaChars > 0 ? capsChars / alphaChars : 0;
  const repeatedChars = /(.{2,})\1{3,}/.test(text);
  const phonePattern = /\b(\+?\d[\s.-]?){9,13}\b/.test(text);
  const promoCount = PROMO_KEYWORDS.filter(k => lower.includes(k)).length;
  const promoDensity = wordCount > 0 ? promoCount / wordCount : 0;

  let spamScore = 0;
  if (urls.length > 2) {
    spamScore += 0.4;
    ruleHits.push({
      ruleId: 'spam_urls',
      category: 'spam',
      severity: urls.length > 4 ? 'high' : 'medium',
      description: `Found ${urls.length} URLs in text`,
      snippet: urls.slice(0, 2).join(', '),
    });
  }
  if (capsRatio > 0.6) {
    spamScore += 0.3;
    ruleHits.push({
      ruleId: 'spam_excessive_caps',
      category: 'spam',
      severity: 'medium',
      description: 'Excessive capital letters (>60%)',
    });
  }
  if (repeatedChars) {
    spamScore += 0.2;
    ruleHits.push({
      ruleId: 'spam_repeated_chars',
      category: 'spam',
      severity: 'low',
      description: 'Repeated character patterns detected',
    });
  }
  if (phonePattern) {
    spamScore += 0.2;
    ruleHits.push({
      ruleId: 'spam_phone',
      category: 'spam',
      severity: 'medium',
      description: 'Phone number detected in text',
    });
  }
  if (promoDensity > 0.15) {
    spamScore += 0.3;
    ruleHits.push({
      ruleId: 'spam_promo_density',
      category: 'spam',
      severity: 'medium',
      description: `High promotional keyword density (${Math.round(promoDensity * 100)}%)`,
    });
  }
  scores.spam = Math.min(1, spamScore);

  // ── PII ────────────────────────────────────────────────────
  const PII_PATTERNS = [
    { id: 'pii_email', pattern: /[\w.-]+@[\w.-]+\.[a-z]{2,}/gi, severity: 'high' as const },
    { id: 'pii_ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, severity: 'high' as const },
    { id: 'pii_credit_card', pattern: /\b(?:\d[ -]?){13,16}\b/g, severity: 'high' as const },
  ];
  for (const { id, pattern, severity } of PII_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      ruleHits.push({
        ruleId: id,
        category: 'pii',
        severity,
        description: `Detected ${id.replace('pii_', '').replace(/_/g, ' ')} pattern`,
        snippet: extractSnippet(text, pattern),
      });
    }
  }
  const piiHitCount = ruleHits.filter(h => h.category === 'pii').length;
  scores.pii = piiHitCount > 0 ? 1.0 : 0;

  // ── NSFW ───────────────────────────────────────────────────
  const NSFW_TERMS = ['porn', 'nsfw', 'sex', 'xxx', 'onlyfans', 'nude', '18+', 'adult content'];
  let nsfwCount = 0;
  for (const term of NSFW_TERMS) {
    if (lower.includes(term)) {
      nsfwCount++;
      ruleHits.push({
        ruleId: `nsfw_${term.replace(/[^a-z]/g, '_')}`,
        category: 'nsfw',
        severity: nsfwCount > 2 ? 'high' : 'medium',
        description: `Detected NSFW term: "${term}"`,
        snippet: extractSnippet(text, new RegExp(term, 'gi')),
      });
    }
  }
  scores.nsfw = Math.min(1, nsfwCount / 3);

  // ── Verdict logic ──────────────────────────────────────────
  let verdict: ModerationResult['verdict'] = 'approved';
  if (scores.harassment >= 0.7 || scores.profanity >= 0.15 || scores.nsfw >= 0.5) {
    verdict = 'removed';
  } else if (scores.pii >= 0.5 || scores.spam >= 0.3 || scores.harassment >= 0.4 || scores.profanity >= 0.05) {
    verdict = 'flagged';
  }

  return {
    verdict,
    scores,
    ruleHits,
    analyzedAt: Date.now(),
    inputLengthChars: text.length,
  };
}

/**
 * Strip PII spans from text for logging (replaces detected PII with [REDACTED])
 */
export function redactPII(text: string): string {
  const PII_PATTERNS = [
    /[\w.-]+@[\w.-]+\.[a-z]{2,}/gi,
    /\b\d{3}-\d{2}-\d{4}\b/g,
    /\b(?:\d[ -]?){13,16}\b/g,
    /\b(\+?\d[\s.-]?){9,13}\b/g,
  ];
  let result = text;
  for (const pattern of PII_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}
