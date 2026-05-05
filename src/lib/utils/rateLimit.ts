/**
 * Client-side rate limiting using an in-memory token bucket.
 *
 * Designed for tools that call server resources (API endpoints, Convex mutations)
 * to prevent accidental or abusive rapid-fire requests.
 *
 * Tier            Max Burst    Refill Rate    Refill Interval
 * ─────────────── ─────────── ─────────────── ────────────────
 * generous        10 tokens    2 tokens/sec   500ms
 * standard         5 tokens    1 token/sec    1000ms
 * strict           3 tokens    1 token/2s     2000ms
 *
 * Usage:
 *   const guard = new RateLimiter('generous');
 *   if (guard.consume()) { await callApi(); }
 *   else { showToast('Slow down!'); }
 */

export type RateLimitTier = 'generous' | 'standard' | 'strict';

interface TierConfig {
  maxBurst: number;
  refillRate: number;       // tokens per interval
  refillIntervalMs: number;
}

const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  generous: { maxBurst: 10, refillRate: 2, refillIntervalMs: 500 },
  standard: { maxBurst: 5, refillRate: 1, refillIntervalMs: 1000 },
  strict: { maxBurst: 3, refillRate: 1, refillIntervalMs: 2000 },
};

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: TierConfig;

  constructor(tier: RateLimitTier = 'standard') {
    this.config = TIER_CONFIGS[tier];
    this.tokens = this.config.maxBurst;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on elapsed time.
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed < this.config.refillIntervalMs) return;

    const intervals = Math.floor(elapsed / this.config.refillIntervalMs);
    const add = intervals * this.config.refillRate;
    this.tokens = Math.min(this.config.maxBurst, this.tokens + add);
    this.lastRefill = now - (elapsed % this.config.refillIntervalMs);
  }

  /**
   * Try to consume one token. Returns true if allowed, false if rate-limited.
   */
  consume(tokens = 1): boolean {
    this.refill();
    if (this.tokens < tokens) return false;
    this.tokens -= tokens;
    return true;
  }

  /**
   * Returns the number of remaining tokens (good for UI feedback).
   */
  remaining(): number {
    this.refill();
    return Math.max(0, this.tokens);
  }

  /**
   * Reset the bucket back to max burst.
   */
  reset(): void {
    this.tokens = this.config.maxBurst;
    this.lastRefill = Date.now();
  }
}

/**
 * Create instances for each major tool.
 * Shared across the app so rate limits are per-tab (not per-call).
 */
export const toolRateLimiters = {
  sentimentAnalyzer: new RateLimiter('generous'),
  recommendationEngine: new RateLimiter('generous'),
  newsPersonalizer: new RateLimiter('standard'),
  threatScanner: new RateLimiter('strict'),
  communityModerator: new RateLimiter('standard'),
  gamingCopilot: new RateLimiter('standard'),
  releasePredictor: new RateLimiter('generous'),
} as const;

export type ToolLimiterKey = keyof typeof toolRateLimiters;
